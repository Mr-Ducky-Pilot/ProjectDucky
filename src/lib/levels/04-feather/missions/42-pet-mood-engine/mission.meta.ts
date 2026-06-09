import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '42-pet-mood-engine',
	level: 4,
	order: 42,
	title: 'Mood Engine',
	emoji: '🌈',
	oneLiner: 'Pick rules — bright → happy, cold → grumpy. Your duck reacts.',
	story: 'Stack up to four if/elif rules. Your duck checks sensors continuously and updates its face to match.',
	duckyIntro: 'How should I feel when things change?',
	hardware: ['light', 'temp', 'mic', 'led-matrix'],
	pairMode: false,
	dimension: 'wellbeing',
	dimensions: ['pet', 'wellbeing'],
	estMinutes: 10,
	petWrites: ['personality.moodRules'],
	petReads: true,
	remixPrompts: [
		'Make a duck that\'s ALWAYS happy somehow.',
		'Make one that\'s very judgmental — different mood for every sensor.',
		'Test it: cover the chip, shake it, see the moods cycle.'
	]
};

export default meta;
