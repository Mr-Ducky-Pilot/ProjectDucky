import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '26-dot-mover',
	level: 2,
	order: 26,
	title: 'Dot Mover',
	emoji: '🕹️',
	oneLiner: 'Move a dot with the buttons. X and Y coordinates in real code.',
	story: 'Every game ever made uses coordinates. Fill in the starting position and the wrap-around edge, and your chip becomes a tiny game controller. Button A moves left, button B moves right — and the dot wraps around.',
	duckyIntro: "Set the starting point and the edge — let's write your first game!",
	hardware: ['buttons', 'led-matrix'],
	pairMode: false,
	estMinutes: 15,
	remixPrompts: [
		'Change the starting y position to move the dot to a different row.',
		'Add button presses on shake (accelerometer) to move the dot up/down.',
		'Make the dot leave a trail by not calling display.clear() every loop.',
		'OLED bonus: from ssd1327 import probe as op; oled=op() — draw the dot as a filled circle on the 96×96 OLED too, scaled up so it\'s much bigger than on the LED matrix.'
	]
};

export default meta;
