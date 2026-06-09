import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '17-dice-roller',
	level: 1,
	order: 17,
	title: 'Dice Roller',
	emoji: '🎲',
	oneLiner: 'Shake the chip. Watch a random number appear on the LEDs.',
	story: 'Shake the micro:bit and it rolls a random dice — 1 to 6 — then shows the dots on the LED grid. The accelerometer detects the shake, the browser picks the number.',
	duckyIntro: "Shake me hard! I'll roll and show you what you got.",
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'mechanics',
	estMinutes: 5,
	remixPrompts: [
		'Add a second dice — two shakes, two numbers, show their sum.',
		'Make a D20: random 1–20 scrolled as text.',
		'Make a "magic 8-ball" that scrolls YES or NO on shake.'
	]
};

export default meta;
