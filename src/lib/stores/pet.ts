import { writable, derived, get, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Dimension } from '$lib/missions/types';

/* ─── Types ─────────────────────────────────────────────────────────────── */

export type PetColor = { primary: string; secondary: string; bill: string };
export type PetPattern = 'plain' | 'spots' | 'stripes' | 'star' | 'heart';
export type PetAccessory = 'none' | 'bow' | 'cap' | 'glasses' | 'crown' | 'scarf';

export type PetSpecies =
	| 'duck'
	| 'cat'
	| 'dog'
	| 'bunny'
	| 'fox'
	| 'panda'
	| 'dragon'
	| 'axolotl'
	| 'penguin'
	| 'owl'
	| 'unicorn'
	| 'robot';

export const SPECIES_INFO: Record<
	PetSpecies,
	{ label: string; emoji: string; defaultName: string; defaultColor: PetColor }
> = {
	duck:    { label: 'Duck',    emoji: '🦆', defaultName: 'Ducky',     defaultColor: { primary: '#ffd23a', secondary: '#ffe07a', bill: '#ff9b1a' } },
	cat:     { label: 'Cat',     emoji: '🐱', defaultName: 'Whiskers',  defaultColor: { primary: '#f5a86b', secondary: '#ffcfa3', bill: '#ff9b9b' } },
	dog:     { label: 'Dog',     emoji: '🐶', defaultName: 'Buddy',     defaultColor: { primary: '#c9925a', secondary: '#e8c098', bill: '#1f2333' } },
	bunny:   { label: 'Bunny',   emoji: '🐰', defaultName: 'Cotton',    defaultColor: { primary: '#fff8ec', secondary: '#ffffff', bill: '#ff9bb5' } },
	fox:     { label: 'Fox',     emoji: '🦊', defaultName: 'Ember',     defaultColor: { primary: '#ff7a3a', secondary: '#ffae6b', bill: '#1f2333' } },
	panda:   { label: 'Panda',   emoji: '🐼', defaultName: 'Bamboo',    defaultColor: { primary: '#ffffff', secondary: '#f4f4f6', bill: '#1f2333' } },
	dragon:  { label: 'Dragon',  emoji: '🐲', defaultName: 'Spark',     defaultColor: { primary: '#7ad44b', secondary: '#bde692', bill: '#ffd23a' } },
	axolotl: { label: 'Axolotl', emoji: '🦎', defaultName: 'Bubbles',   defaultColor: { primary: '#ff9bd5', secondary: '#ffc8e6', bill: '#ff5fa2' } },
	penguin: { label: 'Penguin', emoji: '🐧', defaultName: 'Tux',       defaultColor: { primary: '#1f2333', secondary: '#4a4f6c', bill: '#ffa84a' } },
	owl:     { label: 'Owl',     emoji: '🦉', defaultName: 'Hoot',      defaultColor: { primary: '#8a6a4a', secondary: '#c9a380', bill: '#ffa84a' } },
	unicorn: { label: 'Unicorn', emoji: '🦄', defaultName: 'Sparkle',   defaultColor: { primary: '#f0e6ff', secondary: '#ffffff', bill: '#ff9bd5' } },
	robot:   { label: 'Robot',   emoji: '🤖', defaultName: 'Bolt',      defaultColor: { primary: '#9ba6c4', secondary: '#cdd4e6', bill: '#4cc1ff' } }
};

export const ALL_SPECIES: PetSpecies[] = Object.keys(SPECIES_INFO) as PetSpecies[];

export type MoodTrigger =
	| 'bright'
	| 'dark'
	| 'cold'
	| 'warm'
	| 'loud'
	| 'quiet'
	| 'shake';

export type GestureName = 'shake' | 'tilt-l' | 'tilt-r';

export type PetPersonality = {
	greeting: { face: string; tone: string; scroll: string };
	moodRules: { when: MoodTrigger; mood: string }[];
	favoriteThing: MoodTrigger | null;
	trick: { gesture: GestureName | null; preset: string };
	callSign: string;
	grumpyEnabled: boolean;
	dreamMode: boolean;
};

export type PetFriend = {
	callSign: string;
	name: string;
	color: PetColor;
	pattern: PetPattern;
	metAt: number;
	metInMission: string;
};

export type PetUnlocks = {
	dimensions: Record<Dimension, boolean>;
	levelsCompleted: number[];
};

export type PetStatEntry = { best: number; lastPlayed: number };

export type Pet = {
	schemaVersion: 1;
	id: string;
	name: string;
	species: PetSpecies;
	color: PetColor;
	pattern: PetPattern;
	accessory: PetAccessory;
	personality: PetPersonality;
	unlocks: PetUnlocks;
	stats: Record<string, PetStatEntry>;
	friends: PetFriend[];
	createdAt: number;
	updatedAt: number;
};

/* ─── Defaults ──────────────────────────────────────────────────────────── */

const FRIEND_CAP = 50;
const STAT_CAP = 100;

function uuid(): string {
	if (browser && 'crypto' in globalThis && 'randomUUID' in crypto) {
		return crypto.randomUUID();
	}
	return 'pet-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function randomCallSign(): string {
	const letters = 'BCDFGHJKLMNPQRSTVWXYZ';
	let s = '';
	for (let i = 0; i < 6; i++) s += letters[Math.floor(Math.random() * letters.length)];
	return s;
}

export function defaultPet(): Pet {
	const now = Date.now();
	return {
		schemaVersion: 1,
		id: uuid(),
		name: '',
		species: 'duck',
		color: { ...SPECIES_INFO.duck.defaultColor },
		pattern: 'plain',
		accessory: 'none',
		personality: {
			greeting: { face: 'happy', tone: 'C4,200;E4,200;G4,300', scroll: '' },
			moodRules: [],
			favoriteThing: null,
			trick: { gesture: null, preset: 'heartbeat' },
			callSign: randomCallSign(),
			grumpyEnabled: false,
			dreamMode: false
		},
		unlocks: {
			dimensions: {
				art: false,
				music: false,
				science: false,
				wellbeing: false,
				movement: false,
				story: false,
				pet: false,
				mechanics: false
			},
			levelsCompleted: []
		},
		stats: {},
		friends: [],
		createdAt: now,
		updatedAt: now
	};
}

/* ─── Persistence ───────────────────────────────────────────────────────── */

const KEY = 'ducky.pet.v1';

function migrate(raw: unknown): Pet {
	const base = defaultPet();
	if (!raw || typeof raw !== 'object') return base;
	const r = raw as Partial<Pet>;
	const species: PetSpecies = r.species && r.species in SPECIES_INFO ? r.species : base.species;
	return {
		...base,
		...r,
		species,
		color: { ...base.color, ...(r.color ?? {}) },
		personality: {
			...base.personality,
			...(r.personality ?? {}),
			greeting: { ...base.personality.greeting, ...(r.personality?.greeting ?? {}) },
			trick: { ...base.personality.trick, ...(r.personality?.trick ?? {}) },
			moodRules: r.personality?.moodRules ?? []
		},
		unlocks: {
			dimensions: { ...base.unlocks.dimensions, ...(r.unlocks?.dimensions ?? {}) },
			levelsCompleted: r.unlocks?.levelsCompleted ?? []
		},
		stats: r.stats ?? {},
		friends: r.friends ?? []
	};
}

function load(): Pet {
	if (!browser) return defaultPet();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return defaultPet();
		return migrate(JSON.parse(raw));
	} catch {
		return defaultPet();
	}
}

export const pet: Writable<Pet> = writable(load());

if (browser) {
	pet.subscribe((value) => {
		try {
			localStorage.setItem(KEY, JSON.stringify(value));
		} catch {
			/* quota or private mode — degrade silently */
		}
	});
}

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function touch(p: Pet): Pet {
	return { ...p, updatedAt: Date.now() };
}

export function isNamed(p: Pet): boolean {
	return p.name.trim().length > 0;
}

export function setPetName(name: string) {
	pet.update((p) => touch({ ...p, name: name.trim().slice(0, 20) }));
}

export function setPetColor(color: Partial<PetColor>) {
	pet.update((p) => touch({ ...p, color: { ...p.color, ...color } }));
}

export function setPetSpecies(species: PetSpecies, opts: { recolor?: boolean } = {}) {
	pet.update((p) => {
		const next: Pet = { ...p, species };
		if (opts.recolor) next.color = { ...SPECIES_INFO[species].defaultColor };
		return touch(next);
	});
}

export function setPetPattern(pattern: PetPattern) {
	pet.update((p) => touch({ ...p, pattern }));
}

export function setPetAccessory(accessory: PetAccessory) {
	pet.update((p) => touch({ ...p, accessory }));
}

export function updatePersonality(partial: Partial<PetPersonality>) {
	pet.update((p) => touch({ ...p, personality: { ...p.personality, ...partial } }));
}

export function recordStat(missionKey: string, score: number) {
	pet.update((p) => {
		const prev = p.stats[missionKey];
		const next: PetStatEntry = {
			best: prev ? Math.max(prev.best, score) : score,
			lastPlayed: Date.now()
		};
		const stats = { ...p.stats, [missionKey]: next };
		const keys = Object.keys(stats);
		if (keys.length > STAT_CAP) {
			keys
				.sort((a, b) => stats[a].lastPlayed - stats[b].lastPlayed)
				.slice(0, keys.length - STAT_CAP)
				.forEach((k) => delete stats[k]);
		}
		return touch({ ...p, stats });
	});
}

export function unlockDimension(d: Dimension) {
	pet.update((p) => {
		if (p.unlocks.dimensions[d]) return p;
		return touch({
			...p,
			unlocks: {
				...p.unlocks,
				dimensions: { ...p.unlocks.dimensions, [d]: true }
			}
		});
	});
}

export function markLevelCompleted(level: number) {
	pet.update((p) => {
		if (p.unlocks.levelsCompleted.includes(level)) return p;
		return touch({
			...p,
			unlocks: {
				...p.unlocks,
				levelsCompleted: [...p.unlocks.levelsCompleted, level]
			}
		});
	});
}

export function addFriend(friend: Omit<PetFriend, 'metAt'> & { metAt?: number }) {
	pet.update((p) => {
		if (p.friends.some((f) => f.callSign === friend.callSign)) return p;
		const next = [...p.friends, { ...friend, metAt: friend.metAt ?? Date.now() }];
		if (next.length > FRIEND_CAP) next.splice(0, next.length - FRIEND_CAP);
		return touch({ ...p, friends: next });
	});
}

export function resetPet() {
	pet.set(defaultPet());
}

export function importPet(incoming: Pet) {
	pet.set(touch(migrate(incoming)));
}

export function exportPet(): Pet {
	return get(pet);
}

/* ─── Derived ───────────────────────────────────────────────────────────── */

export const petAvatar = derived(pet, ($p) => ({
	name: $p.name,
	species: $p.species,
	color: $p.color,
	pattern: $p.pattern,
	accessory: $p.accessory
}));

/** Friendly display name — the user's chosen name, or the species default ("Ducky", "Whiskers"…). */
export const petLabel = derived(pet, ($p) =>
	$p.name.trim() || SPECIES_INFO[$p.species].defaultName
);
