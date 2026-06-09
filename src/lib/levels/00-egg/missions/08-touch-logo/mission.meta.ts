import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '08-touch-logo',
	level: 0,
	order: 8,
	title: 'Touch Logo',
	emoji: '👆',
	oneLiner: 'Touch the gold logo. Watch Ducky quack.',
	story: 'The shiny gold "MICROBIT" logo at the top of the chip is actually a touch sensor. Press it like a fingerprint reader.',
	duckyIntro: 'Tap the gold logo on the chip — Ducky should chirp.',
	hardware: ['logo-touch', 'speaker'],
	pairMode: false,
	preset: 'touch-logo',
	dimension: 'music',
	estMinutes: 2,
	remixPrompts: [
		'Try it with sticky tape on the logo. Does it still work?',
		'Two fingers, one finger, knuckle?'
	]
};

export default meta;
