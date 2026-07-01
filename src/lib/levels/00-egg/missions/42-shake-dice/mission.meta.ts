import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '42-shake-dice',
	level: 0,
	order: 42,
	title: 'Shake-a-Dice',
	emoji: '🎲',
	oneLiner: 'Shake your duck to roll a six-sided die.',
	story: 'A real die, sitting in your hand. Shake it, hear the click, see the pips appear. Use it in any game you play.',
	duckyIntro: 'Shake me hard and I\'ll roll for you!',
	hardware: ['accel', 'led-matrix', 'speaker'],
	pairMode: false,
	preset: 'dice',
	dimension: 'movement',
	estMinutes: 5,
	remixPrompts: [
		'Roll 30 times — write down each number. Do you see all six fairly often?',
		'Two ducks? Roll-off! Highest wins.',
		'Use it to pick a chore. Six chores, one shake.'
	]
};

export default meta;
