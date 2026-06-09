import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '36-pixel-camera',
	level: 2,
	order: 36,
	title: 'Pixel Camera',
	emoji: '📸',
	oneLiner: 'Press A to capture an LED frame. Press B to play them all back.',
	story: 'Move your duck around — every press of A "snaps" the current matrix state. Press B to play your filmstrip.',
	duckyIntro: 'I\'m a camera with 25 pixels and no lens. Capture some art.',
	hardware: ['buttons', 'led-matrix'],
	pairMode: false,
	dimension: 'art',
	estMinutes: 10,
	remixPrompts: [
		'Animate a stick figure walking, frame by frame.',
		'Capture 8 frames and play them back fast — make a flipbook.',
		'Add a 3rd button: clear all frames.'
	]
};

export default meta;
