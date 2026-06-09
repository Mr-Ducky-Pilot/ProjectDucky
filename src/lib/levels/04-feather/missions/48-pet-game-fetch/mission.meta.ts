import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '48-pet-game-fetch',
	level: 4,
	order: 48,
	title: 'Fetch',
	emoji: '🎾',
	oneLiner: 'Throw your duck (a tilt counts). A dot chases the "ball" and brings it back.',
	story: 'Tilt one way, the dot zooms across the matrix. Tilt back, it returns. Like fetch — but Python.',
	duckyIntro: 'Throw the ball! I\'ll go get it!',
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'movement',
	dimensions: ['pet', 'movement'],
	estMinutes: 8,
	remixPrompts: [
		'Tune the chase speed — fast or lazy duck?',
		'Add a "tired" face after 10 fetches.',
		'Two ducks playing? Fetch-relay.'
	]
};

export default meta;
