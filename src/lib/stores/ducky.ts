import { writable } from 'svelte/store';
import type { DuckyMood } from '$lib/components/Ducky.svelte';

export type DuckyState = {
	mood: DuckyMood;
	line: string;
	visible: boolean;
};

const initial: DuckyState = {
	mood: 'idle',
	line: '',
	visible: true
};

export const ducky = writable<DuckyState>(initial);

export function say(line: string, mood: DuckyMood = 'excited') {
	ducky.set({ mood, line, visible: true });
}

export function setMood(mood: DuckyMood) {
	ducky.update((s) => ({ ...s, mood }));
}

export function quiet() {
	ducky.update((s) => ({ ...s, line: '' }));
}
