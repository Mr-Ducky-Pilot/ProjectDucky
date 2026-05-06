import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '11-drawing-pad',
	level: 1,
	order: 11,
	title: 'Drawing Pad',
	emoji: '🎨',
	oneLiner: 'Paint a 5×5 picture in the browser. Beam it to the chip.',
	story: 'Each light on the chip is a tiny dot — paint your design, then send it. The whole thing is live; tweak and resend as much as you like.',
	duckyIntro: 'Tap the squares to draw, then beam it over.',
	hardware: ['led-matrix'],
	pairMode: false,
	estMinutes: 6,
	remixPrompts: [
		'Make a flipbook: send pattern, change one pixel, send again.',
		'Try the Heart preset, then invert it.'
	]
};

export default meta;
