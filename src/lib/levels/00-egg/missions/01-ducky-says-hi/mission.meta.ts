import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '01-ducky-says-hi',
	level: 0,
	order: 1,
	title: 'Ducky Says Hi',
	emoji: '👋',
	oneLiner: 'Type your name. Watch it scroll across the chip.',
	story: 'Your duck doesn’t know your name yet. Tell it once — it’ll remember.',
	duckyIntro: 'Tell me what to call you and I’ll wave it back at you.',
	hardware: ['led-matrix', 'oled', 'speaker'],
	pairMode: false,
	hexPath: '/hex/L0-01-ducky-says-hi.hex',
	hexVariant: 'parameterized',
	estMinutes: 3,
	remixPrompts: [
		'What if Ducky greets two names, like a co-pilot?',
		'Make Ducky chirp instead of waving.'
	]
};

export default meta;
