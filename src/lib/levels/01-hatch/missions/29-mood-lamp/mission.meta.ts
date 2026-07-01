import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '29-mood-lamp',
	level: 1,
	order: 29,
	title: 'Mood Lamp',
	emoji: '🌈',
	oneLiner: 'One mood, three outputs at once: a face, a colour, and a sound.',
	story: 'Ducky just got a real RGB LED — its first splash of actual colour, since the 5×5 grid can only glow one shade. Press A or B to cycle through seven moods; each one shows a face, glows a colour, and plays a sound, all at the same time.',
	duckyIntro: 'Watch — one feeling, but I show it three ways at once.',
	hardware: ['rgb-led', 'buttons', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'wellbeing',
	estMinutes: 5,
	remixPrompts: [
		'Which mood color would you pick for each feeling? Try changing one in the code.',
		'Cover the light sensor while a mood is showing — does the room brightness change how the colour looks to you?',
		'Ask a friend to guess the mood from the colour alone, with the screen covered.'
	]
};

export default meta;
