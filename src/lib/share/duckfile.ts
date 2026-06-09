/**
 * .duck file + URL hash sharing format.
 *
 * - File: pretty-printed JSON, MIME application/json, extension .duck
 * - URL: /share#<base64url(deflate-raw(JSON))> — uses browser-native CompressionStream
 */
import type { Pet } from '$lib/stores/pet';

export const DUCK_FILE_VERSION = 1;

export type DuckShare =
	| { kind: 'ducky.share'; version: 1; type: 'pet'; pet: Pet; exportedAt: number }
	| {
			kind: 'ducky.share';
			version: 1;
			type: 'remix';
			pet: Pet;
			remix: { missionId: string; code: string; notes?: string };
			exportedAt: number;
	  }
	| {
			kind: 'ducky.share';
			version: 1;
			type: 'storybook';
			pet: Pet;
			storybook: { scenes: Array<{ matrix: string; oledText?: string; tone?: string; ms: number }> };
			exportedAt: number;
	  };

export function makePetShare(pet: Pet): DuckShare {
	return {
		kind: 'ducky.share',
		version: 1,
		type: 'pet',
		pet,
		exportedAt: Date.now()
	};
}

export function makeRemixShare(
	pet: Pet,
	remix: { missionId: string; code: string; notes?: string }
): DuckShare {
	return { kind: 'ducky.share', version: 1, type: 'remix', pet, remix, exportedAt: Date.now() };
}

/* ─── Encode / decode ──────────────────────────────────────────────────── */

function bytesToBase64Url(bytes: Uint8Array): string {
	let bin = '';
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
	return btoa(bin).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function base64UrlToBytes(s: string): Uint8Array {
	const norm = s.replaceAll('-', '+').replaceAll('_', '/');
	const padded = norm + '='.repeat((4 - (norm.length % 4)) % 4);
	const bin = atob(padded);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

async function deflate(bytes: Uint8Array): Promise<Uint8Array> {
	const cs = new CompressionStream('deflate-raw');
	const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(cs);
	const buf = await new Response(stream).arrayBuffer();
	return new Uint8Array(buf);
}

async function inflate(bytes: Uint8Array): Promise<Uint8Array> {
	const ds = new DecompressionStream('deflate-raw');
	const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(ds);
	const buf = await new Response(stream).arrayBuffer();
	return new Uint8Array(buf);
}

export async function encodeShare(share: DuckShare): Promise<string> {
	const json = JSON.stringify(share);
	const enc = new TextEncoder().encode(json);
	const compressed = await deflate(enc);
	return bytesToBase64Url(compressed);
}

export async function decodeShare(hash: string): Promise<DuckShare | null> {
	try {
		const bytes = base64UrlToBytes(hash);
		const inflated = await inflate(bytes);
		const json = new TextDecoder().decode(inflated);
		const parsed = JSON.parse(json);
		if (parsed?.kind === 'ducky.share' && parsed?.version === 1) return parsed as DuckShare;
		return null;
	} catch {
		return null;
	}
}

export function downloadDuckFile(share: DuckShare, filenameHint?: string) {
	const json = JSON.stringify(share, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	const slug =
		filenameHint?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ||
		share.pet.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
		'ducky';
	a.href = url;
	a.download = `${slug || 'ducky'}.duck`;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readDuckFile(file: File): Promise<DuckShare | null> {
	try {
		const text = await file.text();
		const parsed = JSON.parse(text);
		if (parsed?.kind === 'ducky.share' && parsed?.version === 1) return parsed as DuckShare;
		return null;
	} catch {
		return null;
	}
}

export function buildShareUrl(hash: string, origin?: string): string {
	const base = origin ?? (typeof location !== 'undefined' ? location.origin : '');
	return `${base}/share#${hash}`;
}
