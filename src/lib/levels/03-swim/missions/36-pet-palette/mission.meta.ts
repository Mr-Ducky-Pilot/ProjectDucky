import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '36-pet-palette',
	level: 3,
	order: 36,
	title: 'Pet Palette',
	emoji: '🎨',
	oneLiner: 'Pick your duck\'s colors and pattern. They show up everywhere.',
	story: 'Choose primary, secondary, and pattern. Every page in this app now shows your duck the way you picked.',
	duckyIntro: 'Dress me up! What\'s my style?',
	hardware: ['led-matrix'],
	pairMode: false,
	dimension: 'art',
	dimensions: ['art', 'pet'],
	estMinutes: 6,
	petWrites: ['color', 'pattern'],
	remixPrompts: [
		'Match a sports team\'s colors.',
		'Pick the most unexpected combo you can.',
		'Take a screenshot of your duck — share it.'
	]
};

export default meta;
