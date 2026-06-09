import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '40-radio-pet-meet',
	level: 3,
	order: 40,
	title: 'Pet Meet',
	emoji: '🤝',
	oneLiner: 'Two ducks, two browsers. Trade identities over radio — make friends.',
	story: 'Press "Wave hello" on your duck — it broadcasts its name and call sign. Your friend\'s duck does the same. Both browsers add each other to their My Friends page.',
	duckyIntro: 'Got a friend with a duck? Let me say hi to them.',
	hardware: ['radio', 'led-matrix'],
	pairMode: true,
	dimension: 'pet',
	dimensions: ['pet', 'story'],
	estMinutes: 12,
	petWrites: ['friends'],
	remixPrompts: [
		'Meet 3 different friends. Visit /friends and see all of them.',
		'Try with a friend in the next room — does radio still reach?',
		'Trade a pet sticker with someone after meeting their duck.'
	]
};

export default meta;
