import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '15-reaction-tester',
	level: 1,
	order: 15,
	title: 'Reaction Tester',
	emoji: '⚡',
	oneLiner: 'Wait for the green flash. Slap the button. How fast are you?',
	story: 'A countdown. A green light. A button. The chip times you in milliseconds — and remembers your best.',
	duckyIntro: 'Wait for green. Don’t jump the gun!',
	hardware: ['buttons', 'led-matrix'],
	pairMode: false,
	dimension: 'movement',
	estMinutes: 4,
	remixPrompts: [
		'Race a friend, side by side, two ducks.',
		'Average across 10 tries — humans aren’t consistent.'
	]
};

export default meta;
