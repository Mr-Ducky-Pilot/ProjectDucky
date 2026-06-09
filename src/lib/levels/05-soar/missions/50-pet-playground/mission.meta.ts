import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '50-pet-playground',
	level: 5,
	order: 50,
	title: 'Playground',
	emoji: '🏞️',
	oneLiner: 'A blank slate. Your pet config preloaded. Write whatever you want.',
	story: 'You\'re free. The template is just a starting point — name, callsign, signature already baked in. Change anything. Flash, see what happens.',
	duckyIntro: 'No more guard rails. Build something only you would build.',
	hardware: ['led-matrix', 'speaker', 'accel', 'buttons', 'logo-touch'],
	pairMode: false,
	dimension: 'mechanics',
	dimensions: ['pet', 'mechanics'],
	estMinutes: 30,
	petReads: true,
	remixPrompts: [
		'Build a step counter that scrolls every 50 steps.',
		'Make a guessing game where you press A or B to guess high/low.',
		'Save your code as a .duck file — see Pet Remix mission.'
	]
};

export default meta;
