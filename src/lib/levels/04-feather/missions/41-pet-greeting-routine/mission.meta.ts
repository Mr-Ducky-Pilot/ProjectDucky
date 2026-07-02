import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '41-pet-greeting-routine',
	level: 4,
	order: 41,
	title: 'Boot Greeting',
	emoji: '👋',
	oneLiner: 'Program what your duck does when it wakes up.',
	story: 'Choose its first face, first sound, and first scroll. Every time it powers on, a tiny icon of your actual pet species flashes first — then this is what your friends see.',
	duckyIntro: 'When I wake, what should I do first?',
	hardware: ['led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'pet',
	dimensions: ['pet', 'story'],
	estMinutes: 8,
	petWrites: ['personality.greeting'],
	petReads: true,
	remixPrompts: [
		'Make a totally over-the-top greeting (long scroll + full tune).',
		'Make a quiet one — single tone, fast face.',
		'Compare two greetings side-by-side with a friend.'
	]
};

export default meta;
