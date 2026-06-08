import { MicropythonFsHex } from '@microbit/microbit-fs';
// `?raw` imports: Vite ships the Python source as strings in the JS bundle.
import duckyOsSource from './ducky_os.py?raw';
import ssd1327Source from './ssd1327.py?raw';

const RUNTIME_URL = '/firmware/micropython-v2.hex';

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

let hexCache: ArrayBuffer | null = null;

/**
 * Build the Ducky OS firmware as an Intel-hex string. Combines the bundled
 * MicroPython V2 runtime with our universal-listener Python script using
 * @microbit/microbit-fs (the same library python.microbit.org uses).
 *
 * Cached after the first build — the result doesn't depend on user input
 * for L0/L1 missions, so we only pay the fs assembly cost once per session.
 */
export async function buildDuckyHex(): Promise<ArrayBuffer> {
	if (hexCache) return hexCache;
	const runtime = await fetchRuntime();
	const fs = new MicropythonFsHex(runtime);
	fs.write('main.py', duckyOsSource);
	fs.write('ssd1327.py', ssd1327Source);
	const hexString = fs.getIntelHex();
	const encoder = new TextEncoder();
	hexCache = encoder.encode(hexString).buffer as ArrayBuffer;
	return hexCache;
}

/** Wipe the cache — useful if we ever rebuild the Python source at runtime. */
export function invalidateDuckyHex(): void {
	hexCache = null;
}

/**
 * Build a custom hex from an arbitrary MicroPython source string.
 * Used by Level 2 (Waddle) missions where kids write their own code.
 * Not cached — user code changes on every call.
 */
export async function buildCustomHex(source: string): Promise<ArrayBuffer> {
	const runtime = await fetchRuntime();
	const fs = new MicropythonFsHex(runtime);
	fs.write('main.py', source);
	fs.write('ssd1327.py', ssd1327Source);   // available for L2 kids: from ssd1327 import OLED
	const hexString = fs.getIntelHex();
	const encoder = new TextEncoder();
	return encoder.encode(hexString).buffer as ArrayBuffer;
}
