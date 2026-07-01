import type { DuckyMood } from '$lib/components/Ducky.svelte';
import type { SoundName } from '$lib/webusb/protocol';

export type FaceName = 'happy' | 'sad' | 'wink' | 'wave' | 'sleep' | 'duck' | 'dizzy';

export type MoodPaletteEntry = {
	/** 0-255 each, sent to the board via {type:'rgb'}. */
	rgb: [number, number, number];
	/** Same colour as a CSS hex string, for browser-side reuse. */
	hex: string;
	/** Closest ducky_os.py FACES key — see note below, this is a judgement call. */
	face: FaceName;
	sound: SoundName | null;
};

/**
 * DuckyMood (browser mascot mood) and ducky_os.py's on-board FACES dict are
 * two vocabularies that were never unified anywhere in this codebase and only
 * share one value ('sad'). This table picks the closest FACES match per
 * DuckyMood — it's a hand-judged approximation, not a strict mapping.
 * ducky_os.py's own MOOD_RGB dict (keyed by FACES names, for the mood-badge
 * preset) is a separate, small, loosely-consistent sibling table for the same
 * reason: there's no shared import mechanism across the TS/Python boundary.
 */
export const MOOD_PALETTE: Record<DuckyMood, MoodPaletteEntry> = {
	idle:        { rgb: [60, 50, 10],   hex: '#3c320a', face: 'duck',  sound: null },
	excited:     { rgb: [255, 120, 20], hex: '#ff7814', face: 'happy', sound: 'SPRING' },
	thinking:    { rgb: [90, 60, 200],  hex: '#5a3cc8', face: 'wink',  sound: 'MYSTERIOUS' },
	celebrating: { rgb: [255, 190, 20], hex: '#ffbe14', face: 'happy', sound: 'HAPPY' },
	curious:     { rgb: [30, 180, 220], hex: '#1eb4dc', face: 'wink',  sound: 'HELLO' },
	sleepy:      { rgb: [20, 20, 70],   hex: '#141446', face: 'sleep', sound: 'YAWN' },
	sad:         { rgb: [30, 60, 140],  hex: '#1e3c8c', face: 'sad',   sound: 'SAD' }
};
