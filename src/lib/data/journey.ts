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
		blurb: 'Program your duck\'s personality — greetings, moods, tricks, dream mode.',
		color: '#7ad44b',
		available: true,
		tagline: 'Make your pet truly yours.'
	},
	{
		id: 5,
		emoji: '🌟',
		title: 'Soar',
		blurb: 'Open MicroPython. Build whatever. Share .duck files with friends.',
		color: '#ff7a6b',
		available: true,
		tagline: 'You don\'t need me anymore.'
	}
] as const;
