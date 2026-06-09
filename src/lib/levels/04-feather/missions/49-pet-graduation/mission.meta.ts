import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '49-pet-graduation',
	level: 4,
	order: 49,
	title: 'Graduation',
	emoji: '🎓',
	oneLiner: 'Auto-generated 60-second demo of everything your duck has learned.',
	story: 'Reads your pet store and builds one giant routine: greeting → favourite reaction → trick → mood engine → dream mode. Flash, watch, share.',
	duckyIntro: 'Watch me show off everything you taught me.',
	hardware: ['led-matrix', 'speaker', 'accel', 'mic'],
	pairMode: false,
	dimension: 'pet',
	dimensions: ['pet', 'story'],
	estMinutes: 6,
	petReads: true,
	remixPrompts: [
		'Record a video. Send it to a friend.',
		'Compare two ducks side by side.',
		'Tweak something earlier and re-run graduation.'
	]
};

export default meta;
