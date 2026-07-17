import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '35-magic-8-ball',
	level: 2,
	order: 35,
	title: 'Magic 8-Ball',
	emoji: '🎱',
	oneLiner: 'Shake your duck, ask a yes/no question, get a fortune.',
	story: 'A classic toy in code: shake to get an answer. You\'ll fill the answer list yourself — make it as wise or as silly as you want.',
	duckyIntro: 'Ask me anything. (But only yes/no questions.)',
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'story',
	estMinutes: 8,
	remixPrompts: [
		'Make all four answers positive — see if friends notice.',
		'Add specific in-jokes only your best friend would get.',
		'Replace the text with five emoji answers.'
	]
};

export default meta;
