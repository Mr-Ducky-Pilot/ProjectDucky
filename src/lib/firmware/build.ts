import { MicropythonFsHex } from '@microbit/microbit-fs';
import duckyOsSource from './ducky_os.py?raw';

const RUNTIME_URL = '/firmware/micropython-v2.hex';
const FS_BUDGET = 20480;

let runtimeCache: string | null = null;

async function fetchRuntime(): Promise<string> {
	if (runtimeCache) return runtimeCache;
	const res = await fetch(RUNTIME_URL);
	if (!res.ok) {
		throw new Error(
			`Couldn't load MicroPython runtime (${res.status}). Is /firmware/micropython-v2.hex on disk?`
		);
	}
	runtimeCache = await res.text();
	return runtimeCache;
}

/**
 * Strip whole comment-only lines and blank lines from Python source.
 * Only whole-line removal — never touches trailing comments on code lines
 * (indentation-sensitive: we can't risk moving tokens around).
 */
function minify(src: string): string {
	return src
		.split('\n')
		.filter((line) => {
			const t = line.trim();
			return t !== '' && !t.startsWith('#');
		})
		.join('\n');
}

/**
 * Strip all lines between (and including) L0-MENU-ONLY:BEGIN / END marker pairs.
 */
function stripMenuOnlyRegions(src: string): string {
	const lines = src.split('\n');
	const out: string[] = [];
	let inside = false;
	for (const line of lines) {
		const t = line.trim();
		if (t === '# L0-MENU-ONLY:BEGIN') { inside = true; continue; }
		if (t === '# L0-MENU-ONLY:END')   { inside = false; continue; }
		if (!inside) out.push(line);
	}
	return out.join('\n');
}

/**
 * Write `main` into a fresh filesystem, enforce FS_BUDGET, and assemble the hex.
 * `tooLarge` builds the caller-specific error message when the budget is exceeded.
 * On success in dev mode, logs the byte count so budget regressions are visible
 * immediately instead of discovered via an emergency fix commit.
 */
async function assemble(
	main: string,
	tooLarge: (used: number, over: number) => string
): Promise<ArrayBuffer> {
	const runtime = await fetchRuntime();
	const fs = new MicropythonFsHex(runtime);
	fs.write('main.py', main);
	const used = fs.getStorageUsed();
	if (used > FS_BUDGET) {
		throw new Error(tooLarge(used, used - FS_BUDGET));
	}
	if (import.meta.env.DEV) {
		const pct = ((used / FS_BUDGET) * 100).toFixed(1);
		console.info(`[ducky-fs] ${used}/${FS_BUDGET} bytes (${pct}%) — ${FS_BUDGET - used} bytes free`);
	}
	const hexString = fs.getIntelHex();
	const encoder = new TextEncoder();
	return encoder.encode(hexString).buffer as ArrayBuffer;
}

async function buildHex(main: string): Promise<ArrayBuffer> {
	return assemble(
		main,
		(used, over) => `Firmware too large: ${used} bytes used, budget is ${FS_BUDGET} bytes. Over by ${over} bytes.`
	);
}

// Shared across every Level 0 + Level 1 mission — flash once, cache it. All
// presets stay in tick() (selected live via P:<preset>), so switching missions
// never requires a reflash — only the standalone on-board menu (irrelevant
// once the browser is driving) is stripped.
let duckyOsHexCache: ArrayBuffer | null = null;

/**
 * Build the shared Ducky OS listener firmware used by every L0 + L1 mission.
 * No on-board menu (browser drives preset selection via P:<preset>); every
 * preset's tick() logic stays intact so switching missions is instant.
 */
export async function buildDuckyOsHex(): Promise<ArrayBuffer> {
	if (duckyOsHexCache) return duckyOsHexCache;

	let src = stripMenuOnlyRegions(duckyOsSource);
	src = minify(src);
	duckyOsHexCache = await buildHex(src);
	return duckyOsHexCache;
}

export function invalidateHexCache(): void {
	duckyOsHexCache = null;
}

/**
 * Build a custom hex from an arbitrary MicroPython source string.
 * Used by Level 2+ missions where kids write their own code.
 * Not cached — user code changes on every call.
 */
export async function buildCustomHex(source: string): Promise<ArrayBuffer> {
	return assemble(
		source,
		(used) =>
			`Your code is too long to fit on the micro:bit (${used} bytes, limit is ${FS_BUDGET}). ` +
			`Try shortening your code or removing unused variables.`
	);
}
