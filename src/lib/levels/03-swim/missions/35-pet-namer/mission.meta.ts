import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '35-pet-namer',
	level: 3,
	order: 35,
	title: 'Name Your Duck',
	emoji: '🦆',
	oneLiner: 'Adopt your duck. Give it a name. Make it real.',
	story: 'Every great pet has a name. Type one — Ducky scrolls it across the LEDs and remembers it forever. From now on, every mission knows whose duck this is.',
	duckyIntro: 'I\'ve been waiting for one. Pick a good name for me.',
	hardware: ['led-matrix'],
	pairMode: false,
	dimension: 'pet',
	estMinutes: 5,
	petWrites: ['name'],
	remixPrompts: [
		'Choose a name with personality — not just "Ducky".',
		'Press a button on the chip: see the name scroll.',
		'Try changing the name and re-flashing.'
	]
};

export default meta;
