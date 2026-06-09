import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '46-warm-cold',
	level: 0,
	order: 46,
	title: 'Warm or Cold?',
	emoji: '🌡️',
	oneLiner: 'Your duck shows how warm the room is, right now.',
	story: 'A thermometer that lives in your hand. Hold it near a radiator, near a window, near an ice cube — watch it react.',
	duckyIntro: 'Where is it warmest in your home? Help me find out.',
	hardware: ['temp', 'led-matrix', 'oled'],
	pairMode: false,
	preset: 'warm-cold',
	dimension: 'science',
	estMinutes: 5,
	remixPrompts: [
		'Find your home\'s warmest spot. Coldest spot. Why are they where they are?',
		'Hold a warm drink against Ducky — how fast does the reading climb?',
		'Take readings every hour. Make a temperature diary.'
	]
};

export default meta;
