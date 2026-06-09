import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '52-mini-arcade',
	level: 5,
	order: 52,
	title: 'Mini Arcade',
	emoji: '🎮',
	oneLiner: 'A tilt-maze that fits in 5×5. Add your own twist.',
	story: 'The template ships a working tilt-maze: dodge obstacles, reach the goal. Tweak speed, walls, scoring — make it harder, weirder, yours.',
	duckyIntro: 'Best game I\'ve ever played fits in 25 pixels.',
	hardware: ['accel', 'buttons', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'movement',
	dimensions: ['movement', 'mechanics'],
	estMinutes: 30,
	remixPrompts: [
		'Add a timer — game ends after 30s.',
		'Add lives. 3 wall hits and you lose.',
		'Build a high-score wall (use display.scroll).'
	]
};

export default meta;
