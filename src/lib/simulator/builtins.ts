// Python builtin functions and string/list method dispatch for the
// restricted interpreter. Every native function uses the same calling
// convention: (args, kwargs) => value | SleepRequest. All plain
// synchronous JS — the interpreter's `sleep()` special-case (in
// device-api.ts) is the only builtin family that needs to pause
// execution, via the SleepRequest marker.

import { RuntimeErr } from './errors';

export type NativeFn = (args: unknown[], kwargs: Record<string, unknown>) => unknown;

export function truthy(v: unknown): boolean {
	if (v === false || v === null || v === undefined) return false;
	if (v === 0) return false;
	if (v === '') return false;
	if (Array.isArray(v) && v.length === 0) return false;
	return true;
}

export function pyStr(v: unknown): string {
	if (v === null || v === undefined) return 'None';
	if (typeof v === 'boolean') return v ? 'True' : 'False';
	if (typeof v === 'number') return String(v);
	if (typeof v === 'string') return v;
	if (Array.isArray(v)) return '[' + v.map(pyRepr).join(', ') + ']';
	return String(v);
}

function pyRepr(v: unknown): string {
	if (typeof v === 'string') return `'${v}'`;
	return pyStr(v);
}

function toNumber(v: unknown): number {
	if (typeof v === 'number') return v;
	if (typeof v === 'boolean') return v ? 1 : 0;
	if (typeof v === 'string') {
		const n = Number(v);
		if (!Number.isNaN(n)) return n;
	}
	throw new RuntimeErr(`expected a number, got ${pyStr(v)}`);
}

export function pyLen(v: unknown): number {
	if (typeof v === 'string' || Array.isArray(v)) return v.length;
	throw new RuntimeErr(`object of this type has no len()`);
}

export function pyRange(args: unknown[]): number[] {
	const nums = args.map(toNumber);
	let start = 0,
		stop = 0,
		step = 1;
	if (nums.length === 1) stop = nums[0];
	else if (nums.length === 2) [start, stop] = nums;
	else if (nums.length >= 3) [start, stop, step] = nums;
	const out: number[] = [];
	if (step > 0) for (let i = start; i < stop; i += step) out.push(i);
	else if (step < 0) for (let i = start; i > stop; i += step) out.push(i);
	return out;
}

export const BUILTINS: Record<string, NativeFn> = {
	len: (args) => pyLen(args[0]),
	abs: (args) => Math.abs(toNumber(args[0])),
	str: (args) => pyStr(args[0]),
	int: (args) => Math.trunc(toNumber(args[0])),
	float: (args) => toNumber(args[0]),
	bool: (args) => truthy(args[0]),
	print: () => null, // real routing happens in device-api.ts's wrapped `print`
	range: (args) => pyRange(args),
	min: (args) => {
		const vals = args.length === 1 && Array.isArray(args[0]) ? (args[0] as unknown[]) : args;
		return vals.reduce((a, b) => (toNumber(b) < toNumber(a) ? b : a));
	},
	max: (args) => {
		const vals = args.length === 1 && Array.isArray(args[0]) ? (args[0] as unknown[]) : args;
		return vals.reduce((a, b) => (toNumber(b) > toNumber(a) ? b : a));
	}
};

export function getStringMethod(s: string, name: string): NativeFn | undefined {
	switch (name) {
		case 'startswith':
			return (args) => s.startsWith(String(args[0]));
		case 'endswith':
			return (args) => s.endsWith(String(args[0]));
		case 'join':
			return (args) => (Array.isArray(args[0]) ? (args[0] as unknown[]).map(pyStr).join(s) : String(args[0]));
		case 'replace':
			return (args) => s.split(String(args[0])).join(String(args[1]));
		case 'strip':
			return () => s.trim();
		case 'upper':
			return () => s.toUpperCase();
		case 'lower':
			return () => s.toLowerCase();
		case 'split':
			return (args) => (args[0] === undefined ? s.split(/\s+/).filter(Boolean) : s.split(String(args[0])));
		default:
			return undefined;
	}
}

export function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((v, i) => deepEqual(v, b[i]));
	}
	return false;
}

export function getListMethod(arr: unknown[], name: string): NativeFn | undefined {
	switch (name) {
		case 'append':
			return (args) => {
				arr.push(args[0]);
				return null;
			};
		case 'remove':
			return (args) => {
				const idx = arr.findIndex((v) => deepEqual(v, args[0]));
				if (idx >= 0) arr.splice(idx, 1);
				return null;
			};
		case 'index':
			return (args) => arr.findIndex((v) => deepEqual(v, args[0]));
		case 'pop':
			return (args) => (args[0] === undefined ? arr.pop() : arr.splice(Number(args[0]), 1)[0]);
		default:
			return undefined;
	}
}

export const RANDOM_NS: Record<string, NativeFn> = {
	choice: (args) => {
		const arr = args[0];
		if (!Array.isArray(arr) || arr.length === 0) throw new RuntimeErr('random.choice() needs a non-empty list');
		return arr[Math.floor(Math.random() * arr.length)];
	},
	randint: (args) => {
		const lo = toNumber(args[0]);
		const hi = toNumber(args[1]);
		return lo + Math.floor(Math.random() * (hi - lo + 1));
	}
};
