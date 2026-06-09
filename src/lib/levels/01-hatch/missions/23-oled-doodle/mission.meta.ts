import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '23-oled-doodle',
	level: 1,
	order: 23,
	title: 'OLED Doodle',
	emoji: '🖌️',
	oneLiner: 'Draw in the browser — it shows up on the big screen.',
	story: 'The Grove OLED has 9,216 dots (96×96). Use the browser as a canvas — every stroke beams over instantly.',
	duckyIntro: 'I have a bigger screen. Want to draw on it?',
	hardware: ['oled'],
	pairMode: false,
	dimension: 'art',
	estMinutes: 8,
	remixPrompts: [
		'Sketch your face. Slow down — let the pixels catch up.',
		'Trace a recognisable logo (small).',
		'Draw a thing, hand the duck to a friend, see if they guess.'
	]
};

export default meta;
