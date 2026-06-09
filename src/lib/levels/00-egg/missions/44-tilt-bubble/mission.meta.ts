import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '44-tilt-bubble',
	level: 0,
	order: 44,
	title: 'Tilt Bubble',
	emoji: '🫧',
	oneLiner: 'Tilt your duck — a bubble floats to the highest corner.',
	story: 'It\'s a real bubble level. Tilt left, bubble drifts right. Tilt down, bubble drifts up. Like the one in a carpenter\'s ruler.',
	duckyIntro: 'Tilt me any way you like — watch where the bubble lands.',
	hardware: ['accel', 'led-matrix', 'oled'],
	pairMode: false,
	preset: 'bubble',
	dimension: 'movement',
	dimensions: ['science', 'movement'],
	estMinutes: 4,
	remixPrompts: [
		'Can you hold Ducky perfectly level? Bubble in dead centre — for 5 seconds.',
		'Check whether a table is truly flat. Move around its edge.',
		'Race a friend — first to centre the bubble wins.'
	]
};

export default meta;
