import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '31-hot-potato',
	level: 3,
	order: 31,
	title: 'Hot Potato',
	emoji: '🥔',
	oneLiner: 'A countdown. A radio pass. Whoever holds it when zero hits — loses.',
	story: "One duck starts with the potato. The countdown ticks. Press B to pass it over radio before it explodes. Write the bargraph countdown, the passing logic, and what happens when time runs out.",
	duckyIntro: 'Tick tick tick. Do you pass it or hold it? Write the rules — then play.',
	hardware: ['buttons', 'led-matrix', 'speaker', 'radio'],
	pairMode: true,
	estMinutes: 20,
	remixPrompts: [
		'Make the countdown speed up each time the potato is passed (subtract 2 per pass instead of 1).',
		'Play faster beeps as the countdown drops: add music.pitch(800 + countdown * 20, 50) inside show_countdown.',
		'Add a winner counter: track how many rounds each player has won and scroll the score after each round.'
	]
};

export default meta;
