import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '46-warm-cold',
	level: 0,
	order: 46,
	title: 'Warm or Cold?',
	emoji: '🌡️',
	oneLiner: 'Your duck shows how warm the room is, right now.',
	story: 'A thermometer that lives in your hand. Hold it near a radiator, near a window, near an ice cube — watch it react. Got a real Grove Temperature Sensor? Clip it on and Ducky automatically trusts it over its own CPU guess.',
	duckyIntro: 'Where is it warmest in your home? Help me find out.',
	hardware: ['temp', 'ambient-temp', 'led-matrix'],
	pairMode: false,
	preset: 'warm-cold',
	dimension: 'science',
	estMinutes: 5,
	remixPrompts: [
		'Find your home\'s warmest spot. Coldest spot. Why are they where they are?',
		'Hold a warm drink against Ducky — how fast does the reading climb?',
		'If you have the real sensor: compare it to the CPU guess side by side — how far off is the chip?'
	]
};

export default meta;
