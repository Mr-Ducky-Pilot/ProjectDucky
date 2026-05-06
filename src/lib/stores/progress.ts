import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Progress = {
	playerName: string;
	completed: string[]; // "0/01-ducky-says-hi"
	visited: string[];
};

const KEY = 'ducky.progress.v1';

const initial: Progress = {
	playerName: '',
	completed: [],
	visited: []
};

function load(): Progress {
	if (!browser) return initial;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return initial;
		return { ...initial, ...JSON.parse(raw) };
	} catch {
		return initial;
	}
}

export const progress: Writable<Progress> = writable(load());

if (browser) {
	progress.subscribe((value) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(value));
		} catch {
			// quota or private mode — degrade silently, in-memory still works.
		}
	});
}

export function markCompleted(level: number, missionId: string) {
	const key = `${level}/${missionId}`;
	progress.update((p) =>
		p.completed.includes(key) ? p : { ...p, completed: [...p.completed, key] }
	);
}

export function markVisited(level: number, missionId: string) {
	const key = `${level}/${missionId}`;
	progress.update((p) => (p.visited.includes(key) ? p : { ...p, visited: [...p.visited, key] }));
}

export function setPlayerName(name: string) {
	progress.update((p) => ({ ...p, playerName: name }));
}

export function isCompleted(p: Progress, level: number, missionId: string) {
	return p.completed.includes(`${level}/${missionId}`);
}
