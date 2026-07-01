import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '55-pet-storybook',
	level: 5,
	order: 55,
	title: 'Storybook',
	emoji: '📚',
	oneLiner: 'Sequence of LED frames + tones. A duck-sized animated tale.',
	story: 'String scenes together: a frame, a caption, a sound, a pause. Build a 30-second story your friend can replay just by powering on the chip.',
	duckyIntro: 'Tell me a story I can act out.',
	hardware: ['led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'story',
	dimensions: ['story', 'art'],
	estMinutes: 25,
	petReads: true,
	remixPrompts: [
		'Tell a real story (your day, a memory, a joke).',
		'Adapt a 5-line poem.',
		'Trade storybooks — read each other\'s.'
	]
};

export default meta;
