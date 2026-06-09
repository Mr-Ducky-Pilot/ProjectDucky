import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '46-pet-secret-call',
	level: 4,
	order: 46,
	title: 'Secret Call',
	emoji: '📡',
	oneLiner: 'A radio cry only your duck recognises. Other ducks ignore it.',
	story: 'Your duck has a call sign — a six-letter code generated when it was born. This mission makes it broadcast that call sign, and react only to its own.',
	duckyIntro: 'Give me a secret call. Only my friends will know it.',
	hardware: ['radio', 'led-matrix'],
	pairMode: true,
	dimension: 'pet',
	dimensions: ['pet', 'mechanics'],
	estMinutes: 8,
	petWrites: ['personality.callSign'],
	petReads: true,
	remixPrompts: [
		'Change your call sign — re-flash. Old packets stop matching.',
		'Two ducks with the same call sign — make them best friends.',
		'Listen on the channel while a friend broadcasts — yours stays quiet.'
	]
};

export default meta;
