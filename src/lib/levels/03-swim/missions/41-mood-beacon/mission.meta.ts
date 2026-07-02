import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '41-mood-beacon',
	level: 3,
	order: 41,
	title: 'Mood Beacon',
	emoji: '💛',
	oneLiner: 'Pick how you feel. Send it to a friend\'s duck without saying a word.',
	story: 'Sometimes it\'s hard to say how you\'re feeling out loud. Press A to cycle through five feelings, press B to broadcast — your friend\'s duck lights up and glows the same colour back. No talking required, just noticing and sharing.',
	duckyIntro: 'Pick a feeling. Send it. See what comes back.',
	hardware: ['buttons', 'led-matrix', 'rgb-led', 'speaker', 'radio'],
	pairMode: true,
	dimension: 'wellbeing',
	dimensions: ['wellbeing', 'story'],
	estMinutes: 12,
	remixPrompts: [
		'Add a 6th feeling of your own — pick its face, colour, and a short tune.',
		'Make the receiving duck reply automatically with its own current feeling.',
		'Keep a running count of each feeling sent — display.scroll() the most common one after 10 sends.'
	]
};

export default meta;
