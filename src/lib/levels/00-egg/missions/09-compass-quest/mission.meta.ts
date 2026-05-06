import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '09-compass-quest',
	level: 0,
	order: 9,
	title: 'Compass Quest',
	emoji: '🧭',
	oneLiner: 'Spin the chip slowly. Find magnetic north.',
	story: 'There’s a magnet sensor inside Ducky. Slowly rotate it on a flat surface and the needle on screen will follow.',
	duckyIntro: 'Place the chip flat. Spin it slowly until it points north.',
	hardware: ['compass'],
	pairMode: false,
	preset: 'compass-quest',
	estMinutes: 4,
	remixPrompts: [
		'Hold a magnet near the chip. Watch it lie!',
		'Walk around the room — does the needle stay true?'
	]
};

export default meta;
