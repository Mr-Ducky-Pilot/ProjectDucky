import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '43-pet-favorite-thing',
	level: 4,
	order: 43,
	title: 'Favourite Thing',
	emoji: '💖',
	oneLiner: 'Pick what makes your duck happy — and what it does when it gets it.',
	story: 'A single trigger → a single celebration. Bright light, warm hands, loud noise — your duck has a quirk all its own.',
	duckyIntro: 'What do I love most? You decide.',
	hardware: ['light', 'temp', 'mic', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'pet',
	dimensions: ['pet', 'story'],
	estMinutes: 7,
	petWrites: ['personality.favoriteThing'],
	petReads: true,
	remixPrompts: [
		'Pick a quirky favourite (cold? quiet?).',
		'Make the celebration big — full screen + sound.',
		'Hand to a friend, see if they guess the trigger.'
	]
};

export default meta;
