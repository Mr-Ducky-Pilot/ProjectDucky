import { tokenize, type Token } from './lexer';
import { ParseError, type Comprehension, type Expr, type Module, type Stmt } from './ast';

const COMPARE_OPS = new Set(['==', '!=', '<', '>', '<=', '>=']);
const AUG_OPS = new Set(['+=', '-=', '*=', '/=', '%=', '//=', '**=']);

export function parse(source: string): Module {
	const tokens = tokenize(source);
	let pos = 0;

	function peek(): Token {
		return tokens[pos];
	}
	function at(type: string, value?: string): boolean {
		const t = tokens[pos];
		if (t.type !== type) return false;
		if (value !== undefined && t.value !== value) return false;
		return true;
	}
	function atKeyword(word: string): boolean {
		return at('NAME', word);
	}
	function advance(): Token {
		return tokens[pos++];
	}
	function expect(type: string, value?: string): Token {
		if (!at(type, value)) {
			const t = peek();
			throw new ParseError(
				`Expected ${value ?? type} but found '${t.value || t.type}'`,
				t.line
			);
		}
		return advance();
	}
	function skipNewlines() {
		while (at('NEWLINE')) advance();
	}

	// ---- Module / statements ----

	function parseModule(): Module {
		const body: Stmt[] = [];
		skipNewlines();
		while (!at('EOF')) {
			body.push(parseStatement());
			skipNewlines();
		}
		return { body };
	}

	function parseBlock(): Stmt[] {
		expect('OP', ':');
		if (!at('NEWLINE')) {
			// Single-line body, e.g. `if x: return 1` — used in a couple of the
			// L5 templates (52-mini-arcade, 56-science-fair).
			return [parseStatement()];
		}
		expect('NEWLINE');
		expect('INDENT');
		const body: Stmt[] = [];
		skipNewlines();
		while (!at('DEDENT') && !at('EOF')) {
			body.push(parseStatement());
			skipNewlines();
		}
		expect('DEDENT');
		return body;
	}

	function parseStatement(): Stmt {
		const t = peek();
		if (atKeyword('if')) return parseIf();
		if (atKeyword('while')) return parseWhile();
		if (atKeyword('for')) return parseFor();
		if (atKeyword('def')) return parseFuncDef();
		if (atKeyword('try')) return parseTry();
		if (atKeyword('return')) return parseReturn();
		if (atKeyword('pass')) {
			advance();
			expect('NEWLINE');
			return { kind: 'Pass', line: t.line };
		}
		if (atKeyword('break')) {
			advance();
			expect('NEWLINE');
			return { kind: 'Break', line: t.line };
		}
		if (atKeyword('continue')) {
			advance();
			expect('NEWLINE');
			return { kind: 'Continue', line: t.line };
		}
		if (atKeyword('import') || atKeyword('from')) return parseImport();
		if (atKeyword('global')) return parseGlobal();
		return parseSimpleAssignOrExpr();
	}

	function parseGlobal(): Stmt {
		const line = advance().line;
		const names: string[] = [expect('NAME').value];
		while (at('OP', ',')) {
			advance();
			names.push(expect('NAME').value);
		}
		expect('NEWLINE');
		return { kind: 'Global', names, line };
	}

	function parseIf(): Stmt {
		const line = advance().line; // 'if'
		const test = parseExprList(new Set([':']));
		const body = parseBlock();
		let orelse: Stmt[] = [];
		if (atKeyword('elif')) {
			orelse = [parseElif()];
		} else if (atKeyword('else')) {
			advance();
			orelse = parseBlock();
		}
		return { kind: 'If', test, body, orelse, line };
	}

	function parseElif(): Stmt {
		const line = advance().line; // 'elif'
		const test = parseExprList(new Set([':']));
		const body = parseBlock();
		let orelse: Stmt[] = [];
		if (atKeyword('elif')) {
			orelse = [parseElif()];
		} else if (atKeyword('else')) {
			advance();
			orelse = parseBlock();
		}
		return { kind: 'If', test, body, orelse, line };
	}

	function parseWhile(): Stmt {
		const line = advance().line;
		const test = parseExprList(new Set([':']));
		const body = parseBlock();
		return { kind: 'While', test, body, line };
	}

	function parseFor(): Stmt {
		const line = advance().line;
		const target = parseTargetList();
		expect('NAME', 'in');
		const iter = parseExprList(new Set([':']));
		const body = parseBlock();
		return { kind: 'For', target, iter, body, line };
	}

	// Targets (for-loop / comprehension loop variables) are restricted to
	// names (optionally tupled) — never a full expression. This matters
	// because a target is immediately followed by the literal keyword `in`
	// (`for row in WALLS`), and parseComparison() would otherwise treat that
	// `in` as the comparison operator and swallow the iterable too, leaving
	// nothing for the caller's `expect('NAME', 'in')` to find. Using
	// parseTrailer (not parseTest/parseComparison) for each target element
	// sidesteps that entirely — it stops right after the name.
	function parseTarget(): Expr {
		return parseTrailer();
	}

	function parseTargetList(): Expr {
		const first = parseTarget();
		if (at('OP', ',')) {
			const elts = [first];
			while (at('OP', ',')) {
				advance();
				if (atKeyword('in') || at('NEWLINE') || at('OP', ':') || at('OP', '=') || at('EOF')) break;
				elts.push(parseTarget());
			}
			return { kind: 'Tuple', elts };
		}
		return first;
	}

	function parseFuncDef(): Stmt {
		const line = advance().line;
		const name = expect('NAME').value;
		expect('OP', '(');
		const params: string[] = [];
		while (!at('OP', ')')) {
			params.push(expect('NAME').value);
			if (at('OP', ',')) advance();
			else break;
		}
		expect('OP', ')');
		const body = parseBlock();
		return { kind: 'FunctionDef', name, params, body, line };
	}

	function parseTry(): Stmt {
		const line = advance().line;
		const body = parseBlock();
		expect('NAME', 'except');
		// Optional bare exception type; no `as name` binding supported.
		if (at('NAME') && !at('OP', ':')) {
			if (atKeyword('as')) throw new ParseError("'except ... as e' is not supported", peek().line);
			advance();
			if (atKeyword('as')) throw new ParseError("'except ... as e' is not supported", peek().line);
		}
		const handler = parseBlock();
		return { kind: 'Try', body, handler, line };
	}

	function parseReturn(): Stmt {
		const line = advance().line;
		if (at('NEWLINE')) {
			advance();
			return { kind: 'Return', value: null, line };
		}
		const value = parseExprList(new Set([]));
		expect('NEWLINE');
		return { kind: 'Return', value, line };
	}

	function parseImport(): Stmt {
		const line = peek().line;
		while (!at('NEWLINE') && !at('EOF')) advance();
		if (at('NEWLINE')) advance();
		return { kind: 'Import', line };
	}

	function parseSimpleAssignOrExpr(): Stmt {
		const line = peek().line;
		const first = parseExprList(new Set(['=', ...AUG_OPS]));
		if (at('OP') && AUG_OPS.has(peek().value)) {
			const op = advance().value;
			const value = parseExprList(new Set([]));
			expect('NEWLINE');
			return { kind: 'AugAssign', target: first, op, value, line };
		}
		if (at('OP', '=')) {
			advance();
			const value = parseExprList(new Set(['=']));
			// chained assigns (a = b = 1) collapse to last value; rare, not in templates.
			expect('NEWLINE');
			return { kind: 'Assign', target: first, value, line };
		}
		expect('NEWLINE');
		return { kind: 'ExprStmt', expr: first, line };
	}

	// ---- Expressions ----
	// parseExprList: handles bare comma-tuples at statement level, e.g. `a, b = 1, 2`
	function parseExprList(stop: Set<string>): Expr {
		const first = parseTest();
		if (at('OP', ',')) {
			const elts = [first];
			while (at('OP', ',')) {
				advance();
				if (at('NEWLINE') || at('OP', ':') || at('OP', '=') || at('EOF')) break;
				elts.push(parseTest());
			}
			return { kind: 'Tuple', elts };
		}
		return first;
	}

	// parseTest: the general "value expression" entry point — ternary sits
	// above boolean/comparison/arithmetic, e.g. `600 if is_dash else 1200`.
	function parseTest(): Expr {
		const body = parseOrTest();
		if (atKeyword('if')) {
			advance();
			const test = parseOrTest();
			expect('NAME', 'else');
			const orelse = parseTest();
			return { kind: 'IfExp', test, body, orelse };
		}
		return body;
	}

	function parseOrTest(): Expr {
		let left = parseAndTest();
		if (atKeyword('or')) {
			const values = [left];
			while (atKeyword('or')) {
				advance();
				values.push(parseAndTest());
			}
			return { kind: 'BoolOp', op: 'or', values };
		}
		return left;
	}

	function parseAndTest(): Expr {
		let left = parseNotTest();
		if (atKeyword('and')) {
			const values = [left];
			while (atKeyword('and')) {
				advance();
				values.push(parseNotTest());
			}
			return { kind: 'BoolOp', op: 'and', values };
		}
		return left;
	}

	function parseNotTest(): Expr {
		if (atKeyword('not')) {
			const line = advance().line;
			return { kind: 'UnaryOp', op: 'not', operand: parseNotTest() };
		}
		return parseComparison();
	}

	function parseComparison(): Expr {
		let left = parseArith();
		const ops: string[] = [];
		const comparators: Expr[] = [];
		while (true) {
			if (at('OP') && COMPARE_OPS.has(peek().value)) {
				ops.push(advance().value);
				comparators.push(parseArith());
			} else if (atKeyword('in')) {
				advance();
				ops.push('in');
				comparators.push(parseArith());
			} else if (atKeyword('not') && tokens[pos + 1]?.type === 'NAME' && tokens[pos + 1]?.value === 'in') {
				advance();
				advance();
				ops.push('not in');
				comparators.push(parseArith());
			} else if (atKeyword('is')) {
				advance();
				if (atKeyword('not')) {
					advance();
					ops.push('is not');
				} else {
					ops.push('is');
				}
				comparators.push(parseArith());
			} else {
				break;
			}
		}
		if (ops.length === 0) return left;
		return { kind: 'Compare', left, ops, comparators };
	}

	function parseArith(): Expr {
		let left = parseTerm();
		while (at('OP', '+') || at('OP', '-')) {
			const op = advance().value;
			left = { kind: 'BinOp', op, left, right: parseTerm() };
		}
		return left;
	}

	function parseTerm(): Expr {
		let left = parseFactor();
		while (at('OP', '*') || at('OP', '/') || at('OP', '//') || at('OP', '%')) {
			const op = advance().value;
			left = { kind: 'BinOp', op, left, right: parseFactor() };
		}
		return left;
	}

	function parseFactor(): Expr {
		if (at('OP', '-') || at('OP', '+')) {
			const op = advance().value;
			return { kind: 'UnaryOp', op, operand: parseFactor() };
		}
		return parsePower();
	}

	function parsePower(): Expr {
		const base = parseTrailer();
		if (at('OP', '**')) {
			advance();
			return { kind: 'BinOp', op: '**', left: base, right: parseFactor() };
		}
		return base;
	}

	function parseTrailer(): Expr {
		let node = parseAtom();
		while (true) {
			if (at('OP', '.')) {
				advance();
				const attr = expect('NAME').value;
				node = { kind: 'Attribute', obj: node, attr };
			} else if (at('OP', '(')) {
				advance();
				const args: Expr[] = [];
				const kwargs: { name: string; value: Expr }[] = [];
				while (!at('OP', ')')) {
					if (at('NAME') && tokens[pos + 1]?.type === 'OP' && tokens[pos + 1]?.value === '=') {
						const name = advance().value;
						advance(); // '='
						kwargs.push({ name, value: parseTest() });
					} else if (at('OP', '*')) {
						advance();
						args.push({ kind: 'Starred', value: parseTest() });
					} else {
						const first = parseTest();
						if (atKeyword('for')) {
							// bare generator expression as sole call argument
							const generators = parseCompFor();
							args.push({ kind: 'ListComp', elt: first, generators });
						} else {
							args.push(first);
						}
					}
					if (at('OP', ',')) advance();
					else break;
				}
				expect('OP', ')');
				node = { kind: 'Call', func: node, args, kwargs };
			} else if (at('OP', '[')) {
				advance();
				node = { kind: 'Subscript', obj: node, index: parseSubscript() };
				expect('OP', ']');
			} else {
				break;
			}
		}
		return node;
	}

	function parseSubscript(): Expr {
		let lower: Expr | null = null;
		let upper: Expr | null = null;
		let step: Expr | null = null;
		let isSlice = false;
		if (!at('OP', ':')) lower = parseTest();
		if (at('OP', ':')) {
			isSlice = true;
			advance();
			if (!at('OP', ':') && !at('OP', ']')) upper = parseTest();
			if (at('OP', ':')) {
				advance();
				if (!at('OP', ']')) step = parseTest();
			}
		}
		if (isSlice) return { kind: 'Slice', lower, upper, step };
		return lower as Expr;
	}

	function parseCompFor(): Comprehension[] {
		const generators: Comprehension[] = [];
		while (atKeyword('for')) {
			advance();
			const target = parseTargetList();
			expect('NAME', 'in');
			const iter = parseTest();
			const ifs: Expr[] = [];
			while (atKeyword('if')) {
				advance();
				ifs.push(parseTest());
			}
			generators.push({ target, iter, ifs });
		}
		return generators;
	}

	function parseAtom(): Expr {
		const t = peek();
		if (t.type === 'NUMBER') {
			advance();
			return { kind: 'Num', value: Number(t.value) };
		}
		if (t.type === 'STRING') {
			advance();
			let value = t.value;
			// adjacent string literal concatenation: "a" "b"
			while (at('STRING')) value += advance().value;
			return { kind: 'Str', value };
		}
		if (t.type === 'FSTRING') {
			throw new ParseError('f-strings are not supported in the preview', t.line);
		}
		if (atKeyword('True')) {
			advance();
			return { kind: 'Bool', value: true };
		}
		if (atKeyword('False')) {
			advance();
			return { kind: 'Bool', value: false };
		}
		if (atKeyword('None')) {
			advance();
			return { kind: 'NoneLit' };
		}
		if (t.type === 'NAME') {
			advance();
			return { kind: 'Name', id: t.value };
		}
		if (at('OP', '(')) {
			advance();
			if (at('OP', ')')) {
				advance();
				return { kind: 'Tuple', elts: [] };
			}
			const first = parseTest();
			if (atKeyword('for')) {
				const generators = parseCompFor();
				expect('OP', ')');
				return { kind: 'ListComp', elt: first, generators };
			}
			if (at('OP', ',')) {
				const elts = [first];
				while (at('OP', ',')) {
					advance();
					if (at('OP', ')')) break;
					elts.push(parseTest());
				}
				expect('OP', ')');
				return { kind: 'Tuple', elts };
			}
			expect('OP', ')');
			return first;
		}
		if (at('OP', '[')) {
			advance();
			if (at('OP', ']')) {
				advance();
				return { kind: 'List', elts: [] };
			}
			const first = parseTest();
			if (atKeyword('for')) {
				const generators = parseCompFor();
				expect('OP', ']');
				return { kind: 'ListComp', elt: first, generators };
			}
			const elts = [first];
			while (at('OP', ',')) {
				advance();
				if (at('OP', ']')) break;
				elts.push(parseTest());
			}
			expect('OP', ']');
			return { kind: 'List', elts };
		}
		if (at('OP', '{')) {
			advance();
			const entries: { key: Expr; value: Expr }[] = [];
			while (!at('OP', '}')) {
				const key = parseTest();
				expect('OP', ':');
				const value = parseTest();
				entries.push({ key, value });
				if (at('OP', ',')) advance();
				else break;
			}
			expect('OP', '}');
			return { kind: 'Dict', entries };
		}
		throw new ParseError(`Unexpected token '${t.value || t.type}'`, t.line);
	}

	return parseModule();
}
