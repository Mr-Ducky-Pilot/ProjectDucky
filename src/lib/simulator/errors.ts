// Control-flow and error signals threaded through the generator-based
// interpreter via throw/catch across `yield*` delegation (works natively
// in JS generators).

export class RuntimeErr extends Error {
	line?: number;
	constructor(message: string, line?: number) {
		super(message);
		this.line = line;
	}
}

export class BreakSignal {}
export class ContinueSignal {}
export class ReturnSignal {
	constructor(public value: unknown) {}
}
