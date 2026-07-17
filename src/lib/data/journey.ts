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
	/** Longer narrative "why this level exists" copy — powers the /journey roadmap cards. */
	philosophy: string;
};

export const LEVELS: readonly LevelInfo[] = [
	{
		id: 0,
		emoji: '🥚',
		title: 'Egg',
		blurb: 'First touch. Press, shake, whisper, see what Ducky does.',
		color: '#fff1d9',
		available: true,
		tagline: 'No code yet — pure play.',
		philosophy:
			"Poke it, shake it, whisper to it, and something happens back right away. There's nothing to read first — just experiment, have fun, and discover why it works, all while realizing you're already in control."
	},
	{
		id: 1,
		emoji: '🐣',
		title: 'Hatch',
		blurb: 'Tweak the dials. Same hardware, brand new powers.',
		color: '#ffe07a',
		available: true,
		tagline: 'Sliders, sounds, a tiny drawing pad.',
		philosophy:
			"The browser becomes the controls: sliders bend light into color, a clap wakes the speaker, a drawing pad turns into a real display. Whether you come in through music, art, or plain curiosity, there's a door that fits you."
	},
	{
		id: 2,
		emoji: '🐥',
		title: 'Waddle',
		blurb: 'Fill in the blanks. Flash your code. Watch it run on the chip.',
		color: '#ffd23a',
		available: true,
		tagline: 'Real MicroPython, real chip.',
		philosophy:
			"You write your first real code here, but only the part that matters: drop a number or a word into a line someone already built, and watch actual MicroPython run on the chip in your hand. It's the first time the duck moves because of your words instead of ours."
	},
	{
		id: 3,
		emoji: '🦆',
		title: 'Swim',
		blurb: 'Write the functions. Flash two boards. Build apps that talk to each other.',
		color: '#4cc1ff',
		available: true,
		tagline: 'Functions, radio, real games.',
		philosophy:
			"Two ducks, two kids, one radio: some of what happens next only works if you find a friend and you both show up. This is where the pet is born, and where the kit stops being something you can finish by yourself."
	},
	{
		id: 4,
		emoji: '🪶',
		title: 'Feather',
		blurb: 'Program your duck\'s personality — greetings, moods, tricks, dream mode.',
		color: '#7ad44b',
		available: true,
		tagline: 'Make your pet truly yours.',
		philosophy:
			"Give your duck a mood, a trick, a private little dream, and it stops being a shared kit and starts being a creature only you could have made. The scaffolding falls away here, so every choice from now on is genuinely yours."
	},
	{
		id: 5,
		emoji: '🌟',
		title: 'Soar',
		blurb: 'Open MicroPython. Build whatever. Share .duck files with friends.',
		color: '#ff7a6b',
		available: true,
		tagline: 'You don\'t need me anymore.',
		philosophy:
			"An empty Python editor, a gallery of other kids' remixes, and real sensor data waiting to become a science-fair project. From here, nobody's telling you what to build next."
	}
] as const;
