import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '16-pixel-animator',
	level: 1,
	order: 16,
	title: 'Pixel Animator',
	emoji: '🎬',
	oneLiner: 'Draw 3 frames. Hit play. Watch your flipbook come to life.',
	story: 'A cartoon is just pictures shown so fast your brain fills in the motion. Draw three frames, set the speed, and your chip will flip through them on loop.',
	duckyIntro: 'Draw your three frames. Even a tiny change between each one looks like movement!',
	hardware: ['led-matrix'],
	pairMode: false,
	estMinutes: 8,
	remixPrompts: [
		'Make a heartbeat: tiny heart → big heart → tiny heart.',
		'Try a bouncing ball: dot at top, dot at middle, dot at bottom.',
		'Can you make Ducky blink?'
	]
};

export default meta;
