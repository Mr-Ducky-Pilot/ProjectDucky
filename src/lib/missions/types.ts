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

export type Dimension =
	| 'art'
	| 'music'
	| 'science'
	| 'wellbeing'
	| 'movement'
	| 'story'
	| 'pet'
	| 'mechanics';

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
	preset?: string;
	hexPath?: string;
	hexVariant?: HexVariant;
	estMinutes: number;
	remixPrompts?: string[];
	/** Primary creative/learning dimension this mission targets. */
	dimension?: Dimension;
	/** Optional secondary dimensions, used by the level filter chips. */
	dimensions?: Dimension[];
	/** If set, this mission writes one or more fields on the saved Pet. */
	petWrites?: string[];
	/** If true, this mission reads the saved Pet and uses it in the experience. */
	petReads?: boolean;
};

export type Mission = MissionMeta & {
	conceptMarkdown: string;
	codeMarkdown?: string;
	interactive?: () => Promise<{ default: Component }>;
};

export const DIMENSION_LABEL: Record<Dimension, string> = {
	art: 'Art',
	music: 'Music',
	science: 'Science',
	wellbeing: 'Wellbeing',
	movement: 'Movement',
	story: 'Story',
	pet: 'My Pet',
	mechanics: 'Code'
};

export const DIMENSION_COLOR: Record<Dimension, string> = {
	art: '#ff7a6b',
	music: '#b18cff',
	science: '#4cc1ff',
	wellbeing: '#7ad44b',
	movement: '#ff9b1a',
	story: '#ffd23a',
	pet: '#ff5fa2',
	mechanics: '#5a5f7a'
};

export const DIMENSION_EMOJI: Record<Dimension, string> = {
	art: '🎨',
	music: '🎵',
	science: '🔬',
	wellbeing: '🌿',
	movement: '💃',
	story: '📖',
	pet: '🦆',
	mechanics: '⚙️'
};
