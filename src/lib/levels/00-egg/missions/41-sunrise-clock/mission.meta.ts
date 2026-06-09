import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '41-sunrise-clock',
	level: 0,
	order: 41,
	title: 'Sunrise Clock',
	emoji: '☀️',
	oneLiner: 'Your duck wakes up with the light in the room.',
	story: 'Cover Ducky with your hand — it dims. Hold it to a window — it fills. The chip is reading sunlight in real time.',
	duckyIntro: 'How bright is your room? Let me show you.',
	hardware: ['light', 'led-matrix', 'oled'],
	pairMode: false,
	preset: 'sunrise',
	dimension: 'wellbeing',
	dimensions: ['science', 'wellbeing'],
	estMinutes: 4,
	remixPrompts: [
		'Hold Ducky near a lamp, then under your shirt. What changes?',
		'Walk room to room — make a "brightness map" of your home.',
		'Race a friend: who can find the brightest spot?'
	]
};

export default meta;
