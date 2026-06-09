import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '57-gallery',
	level: 5,
	order: 57,
	title: 'Gallery',
	emoji: '🖼️',
	oneLiner: 'Every duck you\'ve met. Every remix you\'ve received.',
	story: 'Your friends list, your loaded .duck files, your shared remixes — all in one place. Pick one, re-adopt it, remix it, share it onward.',
	duckyIntro: 'Look at all the ducks you know.',
	hardware: [],
	pairMode: false,
	dimension: 'pet',
	dimensions: ['pet', 'story'],
	estMinutes: 10,
	petReads: true,
	remixPrompts: [
		'Open every friend\'s card — remember when you met.',
		'Load 3 different .duck files from a folder.',
		'Send your favourite onward to someone new.'
	]
};

export default meta;
