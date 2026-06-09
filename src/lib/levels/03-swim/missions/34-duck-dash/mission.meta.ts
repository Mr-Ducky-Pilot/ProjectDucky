import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '34-duck-dash',
	level: 3,
	order: 34,
	title: 'Duck Dash',
	emoji: '🎮',
	oneLiner: 'Tilt to move. Collect drops. See your opponent live on the grid. First to WIN wins.',
	story: "This is the capstone. Tilt your board to move your duck around the 5×5 LED grid. Drops appear randomly — collect them to score. Your opponent's position broadcasts over radio and shows up as a dimmer blip. Write the movement, the renderer, the radio bridge, and the drop collection.",
	duckyIntro: 'Five functions. A full game. You build it.',
	hardware: ['accel', 'buttons', 'led-matrix', 'radio'],
	pairMode: true,
	dimension: 'mechanics',
	estMinutes: 35,
	remixPrompts: [
		'Add collision: if you land on the opponent\'s position, lose a point (score -= 1).',
		'Add a button A "boost" that lets you move 2 steps at once for 2 seconds — track a boost timer.',
		'Speed up the game: reduce sleep(80) to sleep(40) after each drop collected.'
	]
};

export default meta;
