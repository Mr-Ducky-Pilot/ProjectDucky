import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '14-light-theremin',
	level: 1,
	order: 14,
	title: 'Light Theremin',
	emoji: '🎼',
	oneLiner: 'Wave your hand over the chip. The pitch follows your shadow.',
	story: 'A theremin is a real instrument you play without touching it. Yours uses light: brighter = higher note, darker = lower.',
	duckyIntro: 'Hover your hand over the chip and slowly move it up and down.',
	hardware: ['light', 'speaker'],
	pairMode: false,
	hexVariant: 'universal',
	estMinutes: 4,
	remixPrompts: [
		'Try a torch — fast pitch changes!',
		'Pick the pentatonic scale — every wobble sounds nice.'
	]
};

export default meta;
