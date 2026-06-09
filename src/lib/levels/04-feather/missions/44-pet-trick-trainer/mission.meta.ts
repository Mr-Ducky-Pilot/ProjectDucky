import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '44-pet-trick-trainer',
	level: 4,
	order: 44,
	title: 'Trick Trainer',
	emoji: '🎪',
	oneLiner: 'Teach your duck a gesture trick — shake = dance, tilt = roll.',
	story: 'Pick a gesture, pick a trick animation. Your duck performs it whenever the gesture fires.',
	duckyIntro: 'Train me. I\'ll learn fast.',
	hardware: ['accel', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'pet',
	dimensions: ['pet', 'movement'],
	estMinutes: 8,
	petWrites: ['personality.trick'],
	petReads: true,
	remixPrompts: [
		'Train it to do something silly.',
		'Quiz a friend: "guess what shake does!"',
		'Try two ducks — same trick, same time.'
	]
};

export default meta;
