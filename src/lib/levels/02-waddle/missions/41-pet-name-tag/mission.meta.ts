import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '41-pet-name-tag',
	level: 2,
	order: 41,
	title: 'Pet Name Tag',
	emoji: '🏷️',
	oneLiner: 'Scroll your duck\'s name across the LEDs, on a button press.',
	story: 'A name tag like the ones at conferences — except yours has 25 LEDs and the wearer is a duck.',
	duckyIntro: 'Press B and I\'ll introduce myself.',
	hardware: ['buttons', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'pet',
	estMinutes: 6,
	petReads: true,
	remixPrompts: [
		'Add a fun fact about your duck after the name.',
		'Play a sound after the scroll — your duck\'s signature.',
		'Try two ducks side by side: introduce in turn.'
	]
};

export default meta;
