import type { Comprehension, Expr, Module, Stmt } from './ast';
import { BreakSignal, ContinueSignal, ReturnSignal, RuntimeErr } from './errors';
import { deepEqual, getListMethod, getStringMethod, truthy, type NativeFn } from './builtins';
import { SleepRequest } from './device-api';

export type Signal = { type: 'sleep'; ms: number } | { type: 'tick' };

const STEP_BUDGET = 2000;

type PyFunction = { __pyFunction: true; params: string[]; body: Stmt[]; closure: Scope };

export class Scope {
	vars = new Map<string, unknown>();
	globalNames = new Set<string>();
	constructor(public parent: Scope | null) {}
	get(name: string): unknown {
		let s: Scope | null = this;
		while (s) {
			if (s.vars.has(name)) return s.vars.get(name);
			s = s.parent;
		}
		throw new RuntimeErr(`name '${name}' is not defined`);
	}
	set(name: string, value: unknown) {
		if (this.globalNames.has(name)) {
			let root: Scope = this;
			while (root.parent) root = root.parent;
			root.vars.set(name, value);
			return;
		}
		this.vars.set(name, value);
	}
	declareGlobal(name: string) {
		this.globalNames.add(name);
	}
}

function isPyFunction(v: unknown): v is PyFunction {
	return !!v && typeof v === 'object' && (v as any).__pyFunction === true;
}

type DictValue = {
	__isDict: true;
	items: NativeFn;
	keys: NativeFn;
	values: NativeFn;
	get: NativeFn;
	__getitem__: (k: unknown) => unknown;
	__setitem__: (k: unknown, v: unknown) => void;
};

function makeDict(entries: [unknown, unknown][]): DictValue {
	const map = new Map<unknown, unknown>(entries);
	return {
		__isDict: true,
		items: () => Array.from(map.entries()),
		keys: () => Array.from(map.keys()),
		values: () => Array.from(map.values()),
		get: (args) => (map.has(args[0]) ? map.get(args[0]) : (args[1] ?? null)),
		__getitem__: (k) => {
			if (!map.has(k)) throw new RuntimeErr(`key not found`);
			return map.get(k);
		},
		__setitem__: (k, v) => {
			map.set(k, v);
		}
	};
}

function toIterable(v: unknown): unknown[] {
	if (Array.isArray(v)) return v;
	if (typeof v === 'string') return v.split('');
	throw new RuntimeErr('this value cannot be looped over');
}

function normalizeIndex(i: number, len: number): number {
	return i < 0 ? i + len : i;
}

function indexValue(obj: unknown, idx: unknown): unknown {
	const i = Number(idx);
	if (typeof obj === 'string') return obj[normalizeIndex(i, obj.length)];
	if (Array.isArray(obj)) return obj[normalizeIndex(i, obj.length)];
	if (obj && typeof (obj as any).__getitem__ === 'function') return (obj as any).__getitem__(i);
	throw new RuntimeErr('this value cannot be indexed');
}

function sliceValue(obj: unknown, lower: number | null, upper: number | null, step: number | null): unknown {
	const isStr = typeof obj === 'string';
	if (!isStr && !Array.isArray(obj)) throw new RuntimeErr('this value cannot be sliced');
	const len = (obj as string | unknown[]).length;
	const st = step ?? 1;
	let start = lower ?? (st > 0 ? 0 : len - 1);
	let stop = upper ?? (st > 0 ? len : -1);
	if (lower !== null) start = normalizeIndex(lower, len);
	if (upper !== null) stop = normalizeIndex(upper, len);
	const out: unknown[] = [];
	if (st > 0) for (let i = Math.max(0, start); i < Math.min(len, stop); i += st) out.push((obj as any)[i]);
	else for (let i = Math.min(len - 1, start); i > stop; i += st) out.push((obj as any)[i]);
	return isStr ? out.join('') : out;
}

function applyBinOp(op: string, left: unknown, right: unknown): unknown {
	if (op === '+') {
		if (typeof left === 'string' || typeof right === 'string') {
			if (typeof left === 'string' && typeof right === 'string') return left + right;
			throw new RuntimeErr('cannot add a string and a number directly — try str() on one of them');
		}
		if (Array.isArray(left) && Array.isArray(right)) return [...left, ...right];
		return Number(left) + Number(right);
	}
	const l = Number(left);
	const r = Number(right);
	switch (op) {
		case '-':
			return l - r;
		case '*':
			if (typeof left === 'string') return left.repeat(Math.max(0, r));
			if (Array.isArray(left)) return Array.from({ length: Math.max(0, r) }, () => left).flat();
			return l * r;
		case '/':
			return l / r;
		case '//':
			return Math.floor(l / r);
		case '%':
			return ((l % r) + r) % r;
		case '**':
			return Math.pow(l, r);
	}
	throw new RuntimeErr(`unsupported operator '${op}'`);
}

function applyCompare(op: string, left: unknown, right: unknown): boolean {
	switch (op) {
		case '==':
			return deepEqual(left, right);
		case '!=':
			return !deepEqual(left, right);
		case '<':
			return (left as any) < (right as any);
		case '>':
			return (left as any) > (right as any);
		case '<=':
			return (left as any) <= (right as any);
		case '>=':
			return (left as any) >= (right as any);
		case 'in':
			if (typeof right === 'string') return right.includes(String(left));
			if (Array.isArray(right)) return right.some((v) => deepEqual(v, left));
			throw new RuntimeErr("'in' needs a list or string on the right");
		case 'not in':
			return !applyCompare('in', left, right);
		case 'is':
			return left === right;
		case 'is not':
			return left !== right;
	}
	throw new RuntimeErr(`unsupported comparison '${op}'`);
}

function getAttribute(obj: unknown, attr: string): unknown {
	if (typeof obj === 'string') {
		const fn = getStringMethod(obj, attr);
		if (fn) return fn;
		throw new RuntimeErr(`strings have no '.${attr}()'`);
	}
	if (Array.isArray(obj)) {
		const fn = getListMethod(obj, attr);
		if (fn) return fn;
		throw new RuntimeErr(`lists have no '.${attr}()'`);
	}
	if (obj && (typeof obj === 'object' || typeof obj === 'function') && attr in (obj as any)) {
		return (obj as any)[attr];
	}
	throw new RuntimeErr(`no '.${attr}' here`);
}

function assign(target: Expr, value: unknown, scope: Scope): void {
	if (target.kind === 'Name') {
		scope.set(target.id, value);
		return;
	}
	if (target.kind === 'Tuple' || target.kind === 'List') {
		const values = toIterable(value);
		target.elts.forEach((elt, i) => assign(elt, values[i], scope));
		return;
	}
	if (target.kind === 'Subscript') {
		// obj/index are re-evaluated synchronously here; neither can contain
		// a `sleep()` call in any of our templates, so this stays a plain
		// (non-generator) evaluation for simplicity.
		throw new RuntimeErr('internal: use assignSubscript for Subscript targets');
	}
	throw new RuntimeErr('cannot assign to this expression');
}

export function* runProgram(
	ast: Module,
	globals: Record<string, unknown>,
	onRuntimeError?: (e: RuntimeErr) => void
): Generator<Signal, void, void> {
	const scope = new Scope(null);
	for (const [k, v] of Object.entries(globals)) scope.set(k, v);
	let stepCount = 0;

	function* tick(): Generator<Signal, void, void> {
		stepCount++;
		if (stepCount >= STEP_BUDGET) {
			stepCount = 0;
			yield { type: 'tick' };
		}
	}

	function* evalExprList(exprs: Expr[], scope: Scope): Generator<Signal, unknown[], void> {
		const out: unknown[] = [];
		for (const e of exprs) out.push(yield* evalExpr(e, scope));
		return out;
	}

	function* evalExpr(expr: Expr, scope: Scope): Generator<Signal, unknown, void> {
		switch (expr.kind) {
			case 'Num':
				return expr.value;
			case 'Str':
				return expr.value;
			case 'Bool':
				return expr.value;
			case 'NoneLit':
				return null;
			case 'Name':
				return scope.get(expr.id);
			case 'Tuple':
			case 'List':
				return yield* evalExprList(expr.elts, scope);
			case 'ListComp':
				return yield* evalListComp(expr.elt, expr.generators, scope);
			case 'Subscript': {
				const obj = yield* evalExpr(expr.obj, scope);
				if (expr.index.kind === 'Slice') {
					const lower = expr.index.lower ? Number(yield* evalExpr(expr.index.lower, scope)) : null;
					const upper = expr.index.upper ? Number(yield* evalExpr(expr.index.upper, scope)) : null;
					const step = expr.index.step ? Number(yield* evalExpr(expr.index.step, scope)) : null;
					return sliceValue(obj, lower, upper, step);
				}
				const idx = yield* evalExpr(expr.index, scope);
				return indexValue(obj, idx);
			}
			case 'Attribute': {
				const obj = yield* evalExpr(expr.obj, scope);
				return getAttribute(obj, expr.attr);
			}
			case 'Call': {
				const fn = yield* evalExpr(expr.func, scope);
				const args: unknown[] = [];
				for (const a of expr.args) {
					if (a.kind === 'Starred') {
						const spread = yield* evalExpr(a.value, scope);
						args.push(...toIterable(spread));
					} else {
						args.push(yield* evalExpr(a, scope));
					}
				}
				const kwargs: Record<string, unknown> = {};
				for (const kw of expr.kwargs) kwargs[kw.name] = yield* evalExpr(kw.value, scope);
				return yield* callValue(fn, args, kwargs);
			}
			case 'BinOp': {
				const left = yield* evalExpr(expr.left, scope);
				const right = yield* evalExpr(expr.right, scope);
				return applyBinOp(expr.op, left, right);
			}
			case 'BoolOp': {
				let last: unknown = undefined;
				for (const v of expr.values) {
					last = yield* evalExpr(v, scope);
					if (expr.op === 'and' && !truthy(last)) return last;
					if (expr.op === 'or' && truthy(last)) return last;
				}
				return last;
			}
			case 'UnaryOp': {
				const v = yield* evalExpr(expr.operand, scope);
				if (expr.op === 'not') return !truthy(v);
				if (expr.op === '-') return -Number(v);
				return Number(v);
			}
			case 'Compare': {
				let left = yield* evalExpr(expr.left, scope);
				for (let i = 0; i < expr.ops.length; i++) {
					const right = yield* evalExpr(expr.comparators[i], scope);
					if (!applyCompare(expr.ops[i], left, right)) return false;
					left = right;
				}
				return true;
			}
			case 'IfExp': {
				const test = yield* evalExpr(expr.test, scope);
				return yield* evalExpr(truthy(test) ? expr.body : expr.orelse, scope);
			}
			case 'Dict': {
				const entries: [unknown, unknown][] = [];
				for (const e of expr.entries) {
					const k = yield* evalExpr(e.key, scope);
					const v = yield* evalExpr(e.value, scope);
					entries.push([k, v]);
				}
				return makeDict(entries);
			}
			case 'Starred':
				throw new RuntimeErr("'*' can only be used in a call's arguments");
		}
	}

	function* evalListComp(elt: Expr, generators: Comprehension[], outerScope: Scope): Generator<Signal, unknown[], void> {
		const results: unknown[] = [];
		const innerScope = new Scope(outerScope);
		function* recurse(genIndex: number): Generator<Signal, void, void> {
			if (genIndex === generators.length) {
				results.push(yield* evalExpr(elt, innerScope));
				return;
			}
			const gen = generators[genIndex];
			const iterable = yield* evalExpr(gen.iter, innerScope);
			for (const item of toIterable(iterable)) {
				assign(gen.target, item, innerScope);
				let ok = true;
				for (const cond of gen.ifs) {
					if (!truthy(yield* evalExpr(cond, innerScope))) {
						ok = false;
						break;
					}
				}
				if (ok) yield* recurse(genIndex + 1);
			}
		}
		yield* recurse(0);
		return results;
	}

	function assignAny(target: Expr, value: unknown, scope: Scope): void {
		if (target.kind === 'Subscript') {
			assignSubscriptSync(target, value, scope);
			return;
		}
		assign(target, value, scope);
	}

	// Subscript assignment targets in our templates (`np[0] = rgb`) never
	// involve a `sleep()` inside the index/object expressions, so this can
	// stay synchronous rather than adding another generator layer.
	function assignSubscriptSync(target: Extract<Expr, { kind: 'Subscript' }>, value: unknown, scope: Scope): void {
		const obj = evalExprSyncBestEffort(target.obj, scope);
		const idx = evalExprSyncBestEffort(target.index, scope);
		if (obj && typeof (obj as any).__setitem__ === 'function') {
			(obj as any).__setitem__(Number(idx), value);
			return;
		}
		if (Array.isArray(obj)) {
			(obj as unknown[])[normalizeIndex(Number(idx), obj.length)] = value;
			return;
		}
		throw new RuntimeErr('cannot assign into this value');
	}

	function evalExprSyncBestEffort(expr: Expr, scope: Scope): unknown {
		const gen = evalExpr(expr, scope);
		let result = gen.next();
		while (!result.done) result = gen.next(); // no sleep()s expected in index/target exprs
		return result.value;
	}

	function* execBlock(stmts: Stmt[], scope: Scope): Generator<Signal, void, void> {
		for (const stmt of stmts) {
			yield* tick();
			yield* execStmt(stmt, scope);
		}
	}

	function* execStmt(stmt: Stmt, scope: Scope): Generator<Signal, void, void> {
		switch (stmt.kind) {
			case 'Assign': {
				const value = yield* evalExpr(stmt.value, scope);
				assignAny(stmt.target, value, scope);
				return;
			}
			case 'AugAssign': {
				const cur = yield* evalExpr(stmt.target, scope);
				const rhs = yield* evalExpr(stmt.value, scope);
				const result = applyBinOp(stmt.op.slice(0, -1), cur, rhs);
				assignAny(stmt.target, result, scope);
				return;
			}
			case 'ExprStmt':
				yield* evalExpr(stmt.expr, scope);
				return;
			case 'If': {
				const test = yield* evalExpr(stmt.test, scope);
				yield* execBlock(truthy(test) ? stmt.body : stmt.orelse, scope);
				return;
			}
			case 'While': {
				while (true) {
					const test = yield* evalExpr(stmt.test, scope);
					if (!truthy(test)) break;
					try {
						yield* execBlock(stmt.body, scope);
					} catch (e) {
						if (e instanceof BreakSignal) break;
						if (e instanceof ContinueSignal) continue;
						if (e instanceof RuntimeErr) {
							onRuntimeError?.(e);
							continue; // recover at the top of this while, per design doc
						}
						throw e;
					}
				}
				return;
			}
			case 'For': {
				const iterable = yield* evalExpr(stmt.iter, scope);
				for (const item of toIterable(iterable)) {
					assign(stmt.target, item, scope);
					try {
						yield* execBlock(stmt.body, scope);
					} catch (e) {
						if (e instanceof BreakSignal) break;
						if (e instanceof ContinueSignal) continue;
						if (e instanceof RuntimeErr) {
							onRuntimeError?.(e);
							continue;
						}
						throw e;
					}
				}
				return;
			}
			case 'FunctionDef': {
				const fn: PyFunction = { __pyFunction: true, params: stmt.params, body: stmt.body, closure: scope };
				scope.set(stmt.name, fn);
				return;
			}
			case 'Return': {
				const value = stmt.value ? yield* evalExpr(stmt.value, scope) : null;
				throw new ReturnSignal(value);
			}
			case 'Try': {
				try {
					yield* execBlock(stmt.body, scope);
				} catch (e) {
					if (e instanceof BreakSignal || e instanceof ContinueSignal || e instanceof ReturnSignal) throw e;
					yield* execBlock(stmt.handler, scope);
				}
				return;
			}
			case 'Global':
				for (const n of stmt.names) scope.declareGlobal(n);
				return;
			case 'Import':
			case 'Pass':
				return;
			case 'Break':
				throw new BreakSignal();
			case 'Continue':
				throw new ContinueSignal();
		}
	}

	function* callValue(fn: unknown, args: unknown[], kwargs: Record<string, unknown>): Generator<Signal, unknown, void> {
		if (isPyFunction(fn)) {
			const frame = new Scope(fn.closure);
			fn.params.forEach((p, i) => frame.set(p, args[i]));
			try {
				yield* execBlock(fn.body, frame);
			} catch (e) {
				if (e instanceof ReturnSignal) return e.value;
				throw e;
			}
			return null;
		}
		if (typeof fn === 'function') {
			const result = (fn as NativeFn)(args, kwargs);
			if (result instanceof SleepRequest) {
				yield { type: 'sleep', ms: result.ms };
				return null;
			}
			return result;
		}
		throw new RuntimeErr('this is not something you can call with ()');
	}

	yield* execBlock(ast.body, scope);
}
