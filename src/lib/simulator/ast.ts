// AST for the restricted MicroPython subset the sandbox previewer executes.
// Scope: exactly what src/lib/levels/05-soar templates use (see design doc
// docs/superpowers/specs/2026-07-11-sandbox-code-preview-design.md).

export type Stmt =
	| { kind: 'Assign'; target: Expr; value: Expr; line: number }
	| { kind: 'AugAssign'; target: Expr; op: string; value: Expr; line: number }
	| { kind: 'ExprStmt'; expr: Expr; line: number }
	| { kind: 'If'; test: Expr; body: Stmt[]; orelse: Stmt[]; line: number }
	| { kind: 'While'; test: Expr; body: Stmt[]; line: number }
	| { kind: 'For'; target: Expr; iter: Expr; body: Stmt[]; line: number }
	| { kind: 'FunctionDef'; name: string; params: string[]; body: Stmt[]; line: number }
	| { kind: 'Return'; value: Expr | null; line: number }
	| { kind: 'Try'; body: Stmt[]; handler: Stmt[]; line: number }
	| { kind: 'Import'; line: number }
	| { kind: 'Global'; names: string[]; line: number }
	| { kind: 'Pass'; line: number }
	| { kind: 'Break'; line: number }
	| { kind: 'Continue'; line: number };

export type Comprehension = { target: Expr; iter: Expr; ifs: Expr[] };

export type Expr =
	| { kind: 'Num'; value: number }
	| { kind: 'Str'; value: string }
	| { kind: 'Bool'; value: boolean }
	| { kind: 'NoneLit' }
	| { kind: 'Name'; id: string }
	| { kind: 'Tuple'; elts: Expr[] }
	| { kind: 'List'; elts: Expr[] }
	| { kind: 'ListComp'; elt: Expr; generators: Comprehension[] }
	| { kind: 'Subscript'; obj: Expr; index: Expr }
	| { kind: 'Slice'; lower: Expr | null; upper: Expr | null; step: Expr | null }
	| { kind: 'Attribute'; obj: Expr; attr: string }
	| { kind: 'Call'; func: Expr; args: Expr[]; kwargs: { name: string; value: Expr }[] }
	| { kind: 'BinOp'; op: string; left: Expr; right: Expr }
	| { kind: 'BoolOp'; op: 'and' | 'or'; values: Expr[] }
	| { kind: 'UnaryOp'; op: string; operand: Expr }
	| { kind: 'Compare'; left: Expr; ops: string[]; comparators: Expr[] }
	| { kind: 'IfExp'; test: Expr; body: Expr; orelse: Expr }
	| { kind: 'Dict'; entries: { key: Expr; value: Expr }[] }
	| { kind: 'Starred'; value: Expr };

export type Module = { body: Stmt[] };

export class ParseError extends Error {
	line: number;
	constructor(message: string, line: number) {
		super(message);
		this.line = line;
	}
}
