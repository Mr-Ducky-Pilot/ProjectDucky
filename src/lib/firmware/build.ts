import { MicropythonFsHex } from '@microbit/microbit-fs';
import duckyOsSource from './ducky_os.py?raw';
import ssd1327Source from './ssd1327.py?raw';

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
 * Replace the entire body of tick() with newBody (already indented lines string).
 * Works line-by-line: once inside tick(), skip lines until the first unindented one.
 */
function replaceTick(src: string, newBody: string): string {
	const lines = src.split('\n');
	const out: string[] = [];
	let inTick = false;
	let replaced = false;
	for (const line of lines) {
		if (!inTick && line.trimEnd() === 'def tick():') {
			inTick = true;
			if (!replaced) { out.push(line); out.push(newBody); replaced = true; }
			continue;
		}
		if (inTick) {
			if (line === '' || line.startsWith('    ') || line.startsWith('\t')) continue;
			inTick = false;
			out.push(line);
		} else {
			out.push(line);
		}
	}
	return out.join('\n');
}

/**
 * Extract the body lines of `elif preset == 'name':` from tick().
 * Returns those lines de-indented by one level (4 spaces).
 */
function extractPresetBranch(src: string, name: string): string {
	const lines = src.split('\n');
	const startPattern = new RegExp(`^    (?:if|elif) preset == '${name}':`);
	const nextBranchPattern = /^    (?:if|elif) preset == '/;

	let capturing = false;
	const body: string[] = [];

	for (const line of lines) {
		if (!capturing) {
			if (startPattern.test(line)) capturing = true;
			continue;
		}
		if (nextBranchPattern.test(line) && !startPattern.test(line)) break;
		if (line.length > 0 && line[0] !== ' ' && !line.startsWith('\t')) break;
		body.push(line.slice(4));
	}
	return body.join('\n');
}

async function buildHex(main: string): Promise<ArrayBuffer> {
	const runtime = await fetchRuntime();
	const fs = new MicropythonFsHex(runtime);
	fs.write('main.py', main);
	fs.write('ssd1327.py', ssd1327Source);
	const used = fs.getStorageUsed();
	if (used > FS_BUDGET) {
		throw new Error(
			`Firmware too large: ${used} bytes used, budget is ${FS_BUDGET} bytes. ` +
			`Over by ${used - FS_BUDGET} bytes.`
		);
	}
	const hexString = fs.getIntelHex();
	const encoder = new TextEncoder();
	return encoder.encode(hexString).buffer as ArrayBuffer;
}

// L1 hex is shared across all Level 1 missions — cache it.
let l1HexCache: ArrayBuffer | null = null;

/**
 * Build the Level 1 listener firmware.
 * No presets, no on-board menu. Browser sends M:/N:/F:/T:/S?/S!/R:/O: commands directly.
 */
export async function buildL1Hex(): Promise<ArrayBuffer> {
	if (l1HexCache) return l1HexCache;

	let src = stripMenuOnlyRegions(duckyOsSource);
	src = replaceTick(src, '    pass');
	src = minify(src);
	l1HexCache = await buildHex(src);
	return l1HexCache;
}

// L0 preset hexes are cached per preset name.
const l0HexCache = new Map<string, ArrayBuffer>();

/**
 * Build a Level 0 preset firmware with a single hardcoded preset.
 * No on-board menu. The preset runs immediately on boot.
 */
export async function buildL0PresetHex(preset: string): Promise<ArrayBuffer> {
	if (l0HexCache.has(preset)) return l0HexCache.get(preset)!;

	let src = stripMenuOnlyRegions(duckyOsSource);
	src = src.replace(/^preset = None$/m, `preset = '${preset}'`);

	const branch = extractPresetBranch(src, preset);
	const tickBody = [
		'    global preset, state',
		'    n = running_time()',
		`    if preset == '${preset}':`,
		...branch.split('\n').map((l) => '        ' + l)
	].join('\n');
	src = replaceTick(src, tickBody);
	src = minify(src);
	const hex = await buildHex(src);
	l0HexCache.set(preset, hex);
	return hex;
}

export function invalidateHexCache(): void {
	l1HexCache = null;
	l0HexCache.clear();
}

/**
 * Build a custom hex from an arbitrary MicroPython source string.
 * Used by Level 2+ missions where kids write their own code.
 * Not cached — user code changes on every call.
 */
export async function buildCustomHex(source: string): Promise<ArrayBuffer> {
	const runtime = await fetchRuntime();
	const fs = new MicropythonFsHex(runtime);
	fs.write('main.py', source);
	fs.write('ssd1327.py', ssd1327Source);
	const used = fs.getStorageUsed();
	if (used > FS_BUDGET) {
		throw new Error(
			`Your code is too long to fit on the micro:bit (${used} bytes, limit is ${FS_BUDGET}). ` +
			`Try shortening your code or removing unused variables.`
		);
	}
	const hexString = fs.getIntelHex();
	const encoder = new TextEncoder();
	return encoder.encode(hexString).buffer as ArrayBuffer;
}
