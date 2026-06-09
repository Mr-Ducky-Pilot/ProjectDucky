import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '06-hide-and-peek',
	level: 0,
	order: 6,
	title: 'Hide & Peek',
	emoji: '🙈',
	oneLiner: 'Cover the chip with your hand. Watch it get sad. Uncover. It cheers up.',
	story: 'The micro:bit can sense how bright the room is — by using its own LEDs as detectors!',
	duckyIntro: 'Cover the chip with your hand. Watch the bar shrink.',
	hardware: ['light', 'led-matrix'],
	pairMode: false,
	preset: 'hide-peek',
	dimension: 'science',
	estMinutes: 2,
	remixPrompts: [
		'Take Ducky into the dark with you. Pillow fort?',
		'Shine a phone torch at it.'
	]
};

export default meta;
