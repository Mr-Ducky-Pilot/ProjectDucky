import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '23-steady-hand',
	level: 2,
	order: 23,
	title: 'Steady Hand',
	emoji: '🤚',
	oneLiner: 'Keep the chip still. Your streak grows the steadier you are.',
	story: "The accelerometer measures tiny movements in all directions. Add up the wobble in both axes and compare it to your limit. The chip counts how many loops you've been steady — try to beat your own best.",
	duckyIntro: 'Two blanks — one for how steady, one for how fast. Ready?',
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'mechanics',
	estMinutes: 12,
	remixPrompts: [
		'Make the wobble limit stricter (lower number) to make it harder.',
		'Display the streak number instead of a face.',
		'Show a different image for a new personal best.',
		'OLED bonus: from ssd1327 import probe as op; oled=op() — show the streak count and "STEADY!" or "WOBBLE!" in big_text so you can read it without looking at the chip.'
	]
};

export default meta;
