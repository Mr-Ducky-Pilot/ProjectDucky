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
		blurb: 'Snap blocks together to build something only you would build.',
		color: '#ffd23a',
		available: false,
		tagline: 'Open the editor. Coming soon.'
	},
	{
		id: 3,
		emoji: '🦆',
		title: 'Swim',
		blurb: 'Two ducks, one experience. Pair up with a friend.',
		color: '#4cc1ff',
		available: false,
		tagline: 'Walkie-talkies, secret handshakes.'
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
