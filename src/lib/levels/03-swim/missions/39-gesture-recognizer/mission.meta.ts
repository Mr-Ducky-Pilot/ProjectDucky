import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '39-gesture-recognizer',
	level: 3,
	order: 39,
	title: 'Gesture Recognizer',
	emoji: '🤖',
	oneLiner: 'Train your duck to know three gestures: shake, tilt left, tilt right.',
	story: 'Write the if-statements that classify movement. When you shake, your duck shows ⚡. Tilt left = ←. Tilt right = →. This is gesture detection from scratch.',
	duckyIntro: 'Teach me three moves. I\'ll recognise them every time.',
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'movement',
	dimensions: ['science', 'movement'],
	estMinutes: 12,
	remixPrompts: [
		'Add a "flip" gesture (negative Z).',
		'Detect "circle" — track x and y over time.',
		'Have a friend try to fool your recogniser.'
	]
};

export default meta;
