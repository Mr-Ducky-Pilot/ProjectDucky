import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '12-mood-ring',
	level: 1,
	order: 12,
	title: 'Mood Ring',
	emoji: '💍',
	oneLiner: 'Pick a sensor + a threshold. Watch Ducky change face.',
	story: 'A mood ring switches color based on temperature. Yours can switch on anything: temperature, brightness, motion, sound. You decide the cutoff.',
	duckyIntro: 'Pick the sensor. Pick the threshold. I’ll be happy when it crosses.',
	hardware: ['accel', 'mic', 'light', 'temp', 'led-matrix'],
	pairMode: false,
	hexVariant: 'universal',
	estMinutes: 5,
	remixPrompts: [
		'Set a really mean threshold and try to make Ducky happy.',
		'Switch sensors mid-mission — does the mood update?'
	]
};

export default meta;
