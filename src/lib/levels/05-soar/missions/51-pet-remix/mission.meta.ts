import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '51-pet-remix',
	level: 5,
	order: 51,
	title: 'Pet Remix',
	emoji: '🔀',
	oneLiner: 'Load a friend\'s .duck file. Tweak. Re-export. Send it back.',
	story: 'Drop in a friend\'s shared duck. See their code. Change one thing — your colours, your tweak, your remix. Export and send it back.',
	duckyIntro: 'Steal like an artist. Then make it yours.',
	hardware: ['led-matrix'],
	pairMode: false,
	dimension: 'pet',
	dimensions: ['pet', 'story'],
	estMinutes: 15,
	petReads: true,
	remixPrompts: [
		'Trade .duck files with a friend.',
		'Remix something — even a single line. Re-share.',
		'Trace it back: ask your friend who they got it from.'
	]
};

export default meta;
