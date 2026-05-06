import { MicropythonFsHex } from '@microbit/microbit-fs';
// `?raw` import: Vite ships the Python source as a string in the JS bundle.
import duckyOsSource from './ducky_os.py?raw';

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
	const hexString = fs.getIntelHex();
	const encoder = new TextEncoder();
	hexCache = encoder.encode(hexString).buffer as ArrayBuffer;
	return hexCache;
}

/** Wipe the cache — useful if we ever rebuild the Python source at runtime. */
export function invalidateDuckyHex(): void {
	hexCache = null;
}
