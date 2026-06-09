/**
 * The six "duck lifecycle" levels. Each level is a folder under src/lib/levels/
 * but the journey map is hand-authored so we control ordering, color, and copy.
 */
export type LevelInfo = {
	id: 0 | 1 | 2 | 3 | 4 | 5;
	emoji: string;
	title: string;
	blurb: string;
	color: string;
	available: boolean;
	tagline: string;
};

export const LEVELS: readonly LevelInfo[] = [
	{
		id: 0,
		emoji: '🥚',
		title: 'Egg',
		blurb: 'First touch. Press, shake, whisper, see what Ducky does.',
		color: '#fff1d9',
		available: true,
		tagline: 'No code yet — pure play.'
	},
	{
		id: 1,
		emoji: '🐣',
		title: 'Hatch',
		blurb: 'Tweak the dials. Same hardware, brand new powers.',
		color: '#ffe07a',
		available: true,
		tagline: 'Sliders, sounds, a tiny drawing pad.'
	},
	{
		id: 2,
		emoji: '🐥',
		title: 'Waddle',
		blurb: 'Fill in the blanks. Flash your code. Watch it run on the chip.',
		color: '#ffd23a',
		available: true,
		tagline: 'Real MicroPython, real chip.'
	},
	{
		id: 3,
		emoji: '🦆',
		title: 'Swim',
		blurb: 'Write the functions. Flash two boards. Build apps that talk to each other.',
		color: '#4cc1ff',
		available: true,
		tagline: 'Functions, radio, real games.'
	},
	{
		id: 4,
		emoji: '🪶',
		title: 'Feather',
		blurb: 'See the code behind the blocks. The big reveal.',
		color: '#7ad44b',
		available: false,
		tagline: 'It was code all along.'
	},
	{
		id: 5,
		emoji: '🌟',
		title: 'Soar',
		blurb: 'No missions, no rules. Just you and the sandbox.',
		color: '#ff7a6b',
		available: false,
		tagline: 'You don’t need me anymore.'
	}
] as const;
