import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '45-firefly',
	level: 0,
	order: 45,
	title: 'Firefly',
	emoji: '🌟',
	oneLiner: 'A single glowing pixel that drifts when you tilt.',
	story: 'Imagine a tiny firefly trapped in your duck. Tip the chip and it slides — gently, never panicking.',
	duckyIntro: 'There\'s a firefly inside me. Tilt to herd it.',
	hardware: ['accel', 'led-matrix', 'oled'],
	pairMode: false,
	preset: 'firefly',
	dimension: 'art',
	estMinutes: 4,
	remixPrompts: [
		'Try to make the firefly trace a square — all four corners.',
		'Two ducks side-by-side: can both fireflies meet at the centre?',
		'Cup your hand around Ducky and slowly tilt. Watch the trail.'
	]
};

export default meta;
