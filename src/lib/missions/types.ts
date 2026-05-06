import type { Component } from 'svelte';

export type Sensor =
	| 'led-matrix'
	| 'oled'
	| 'mic'
	| 'speaker'
	| 'accel'
	| 'compass'
	| 'temp'
	| 'light'
	| 'buttons'
	| 'logo-touch'
	| 'radio'
	| 'output';

export type HexVariant = 'static' | 'parameterized' | 'universal';

export type LevelId = 0 | 1 | 2 | 3 | 4 | 5;

export type MissionMeta = {
	id: string; // "01-ducky-says-hi"
	level: LevelId;
	order: number;
	title: string;
	emoji: string;
	oneLiner: string;
	story: string;
	duckyIntro: string;
	hardware: Sensor[];
	pairMode: boolean;
	hexPath?: string;
	hexVariant?: HexVariant;
	estMinutes: number;
	remixPrompts?: string[];
};

export type Mission = MissionMeta & {
	conceptMarkdown: string;
	interactive?: () => Promise<{ default: Component }>;
};
