import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '33-clicker-wars',
	level: 3,
	order: 33,
	title: 'Clicker Wars',
	emoji: '⚡',
	oneLiner: 'Mash your button. Broadcast your score. Write the scoreboard. First to WIN wins.',
	story: "Two boards. Two players. One button each. Both sides broadcast their score every second, both receive the opponent's score. You write the broadcast loop, the receive handler, and a bargraph scoreboard. First to the target wins.",
	duckyIntro: 'Clicks, broadcasts, scoreboards. You design them all.',
	hardware: ['buttons', 'led-matrix', 'radio'],
	pairMode: true,
	dimension: 'movement',
	estMinutes: 20,
	remixPrompts: [
		'Add a 3-second countdown at the start — both boards show "3", "2", "1", "GO!" before the loop begins.',
		'Send a "reset" radio command (e.g., "R") that resets both scores to 0 when button B is pressed.',
		'Show win/loss message to the OPPONENT too: after winning, send "you lose" over radio so they see it.'
	]
};

export default meta;
