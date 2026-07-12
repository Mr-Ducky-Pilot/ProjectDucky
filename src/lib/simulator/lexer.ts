import { ParseError } from './ast';

export type TokenType =
	| 'NAME'
	| 'NUMBER'
	| 'STRING'
	| 'FSTRING'
	| 'OP'
	| 'NEWLINE'
	| 'INDENT'
	| 'DEDENT'
	| 'EOF';

export type Token = { type: TokenType; value: string; line: number };

export const KEYWORDS = new Set([
	'if', 'elif', 'else', 'while', 'for', 'in', 'def', 'return', 'try', 'except',
	'import', 'from', 'as', 'True', 'False', 'None', 'and', 'or', 'not', 'pass',
	'break', 'continue'
]);

const THREE_CHAR_OPS = ['**=', '//='];
const TWO_CHAR_OPS = ['**', '//', '==', '!=', '<=', '>=', '+=', '-=', '*=', '/=', '%='];
const ONE_CHAR_OPS = '+-*/%=<>()[]{},:.;';

function isIdentStart(c: string) {
	return /[A-Za-z_]/.test(c);
}
function isIdentChar(c: string) {
	return /[A-Za-z0-9_]/.test(c);
}
function isDigit(c: string) {
	return /[0-9]/.test(c);
}

export function tokenize(source: string): Token[] {
	const tokens: Token[] = [];
	const indentStack = [0];
	let i = 0;
	let line = 1;
	let atLineStart = true;
	let bracketDepth = 0;
	const len = source.length;

	function readString(quote: string, isF: boolean): string {
		let out = '';
		i++; // skip opening quote
		while (i < len && source[i] !== quote) {
			if (source[i] === '\\' && i + 1 < len) {
				const next = source[i + 1];
				const map: Record<string, string> = { n: '\n', t: '\t', r: '\r', '\\': '\\', '"': '"', "'": "'" };
				out += map[next] ?? next;
				i += 2;
			} else {
				if (source[i] === '\n') line++;
				out += source[i];
				i++;
			}
		}
		i++; // skip closing quote
		return out;
	}

	while (i < len) {
		if (atLineStart && bracketDepth === 0) {
			// Measure indentation of this logical line.
			let col = 0;
			let j = i;
			while (j < len && (source[j] === ' ' || source[j] === '\t')) {
				col += source[j] === '\t' ? 4 : 1;
				j++;
			}
			// Blank line or comment-only line: skip without touching indent stack.
			if (j >= len || source[j] === '\n' || source[j] === '#') {
				if (j < len && source[j] === '#') {
					while (j < len && source[j] !== '\n') j++;
				}
				if (j < len && source[j] === '\n') {
					line++;
					j++;
				}
				i = j;
				continue;
			}
			i = j;
			atLineStart = false;
			const top = indentStack[indentStack.length - 1];
			if (col > top) {
				indentStack.push(col);
				tokens.push({ type: 'INDENT', value: '', line });
			} else if (col < top) {
				while (indentStack.length > 1 && indentStack[indentStack.length - 1] > col) {
					indentStack.pop();
					tokens.push({ type: 'DEDENT', value: '', line });
				}
			}
			continue;
		}

		const c = source[i];

		if (c === '\n') {
			line++;
			i++;
			if (bracketDepth === 0) {
				tokens.push({ type: 'NEWLINE', value: '', line });
				atLineStart = true;
			}
			continue;
		}
		if (c === ' ' || c === '\t' || c === '\r') {
			i++;
			continue;
		}
		if (c === '#') {
			while (i < len && source[i] !== '\n') i++;
			continue;
		}
		if (c === '\\' && source[i + 1] === '\n') {
			// explicit line continuation
			i += 2;
			line++;
			continue;
		}

		// f-strings
		if ((c === 'f' || c === 'F') && (source[i + 1] === '"' || source[i + 1] === "'")) {
			const startLine = line;
			i++;
			const val = readString(source[i], true);
			tokens.push({ type: 'FSTRING', value: val, line: startLine });
			continue;
		}
		if (c === '"' || c === "'") {
			const startLine = line;
			const val = readString(c, false);
			tokens.push({ type: 'STRING', value: val, line: startLine });
			continue;
		}
		if (isDigit(c) || (c === '.' && isDigit(source[i + 1] ?? ''))) {
			let start = i;
			while (i < len && isDigit(source[i])) i++;
			if (source[i] === '.') {
				i++;
				while (i < len && isDigit(source[i])) i++;
			}
			tokens.push({ type: 'NUMBER', value: source.slice(start, i), line });
			continue;
		}
		if (isIdentStart(c)) {
			let start = i;
			while (i < len && isIdentChar(source[i])) i++;
			tokens.push({ type: 'NAME', value: source.slice(start, i), line });
			continue;
		}
		if (c === '(' || c === '[' || c === '{') {
			bracketDepth++;
			tokens.push({ type: 'OP', value: c, line });
			i++;
			continue;
		}
		if (c === ')' || c === ']' || c === '}') {
			bracketDepth = Math.max(0, bracketDepth - 1);
			tokens.push({ type: 'OP', value: c, line });
			i++;
			continue;
		}

		const three = source.slice(i, i + 3);
		if (THREE_CHAR_OPS.includes(three)) {
			tokens.push({ type: 'OP', value: three, line });
			i += 3;
			continue;
		}
		const two = source.slice(i, i + 2);
		if (TWO_CHAR_OPS.includes(two)) {
			tokens.push({ type: 'OP', value: two, line });
			i += 2;
			continue;
		}
		if (ONE_CHAR_OPS.includes(c)) {
			tokens.push({ type: 'OP', value: c, line });
			i++;
			continue;
		}

		throw new ParseError(`Unexpected character '${c}'`, line);
	}

	if (!atLineStart) tokens.push({ type: 'NEWLINE', value: '', line });
	while (indentStack.length > 1) {
		indentStack.pop();
		tokens.push({ type: 'DEDENT', value: '', line });
	}
	tokens.push({ type: 'EOF', value: '', line });
	return tokens;
}
