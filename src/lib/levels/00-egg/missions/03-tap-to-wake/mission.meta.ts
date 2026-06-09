import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '03-tap-to-wake',
	level: 0,
	order: 3,
	title: 'Tap to Wake',
	emoji: '🔘',
	oneLiner: 'Press a button. Watch the chip explode with light.',
	story: 'Two squishy buttons sit on the chip. Pick A or B and give it a tap — the LEDs ripple outwards.',
	duckyIntro: 'Press a button on the chip — or tap one of mine to preview.',
	hardware: ['buttons', 'led-matrix'],
	pairMode: false,
	preset: 'tap-wake',
	dimension: 'mechanics',
	estMinutes: 2,
	remixPrompts: ['Tap A and B together — what happens?', 'Try really fast tapping.']
};

export default meta;
