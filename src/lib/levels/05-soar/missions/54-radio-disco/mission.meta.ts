import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '54-radio-disco',
	level: 5,
	order: 54,
	title: 'Radio Disco',
	emoji: '🪩',
	oneLiner: 'One DJ duck, many follower ducks. Synchronised light show.',
	story: 'Press A on the DJ — it broadcasts a "beat" packet. Every other duck on the channel flashes its matrix in sync. Get five ducks in a room.',
	duckyIntro: 'I\'m the DJ. The rest are my dance floor.',
	hardware: ['radio', 'led-matrix', 'buttons'],
	pairMode: true,
	dimension: 'music',
	dimensions: ['music', 'movement'],
	estMinutes: 25,
	remixPrompts: [
		'Make 3 different beat patterns. Cycle on each press.',
		'Have followers play tones too — synchronised sound.',
		'Try 4 ducks in a room. Time-lapse the show.'
	]
};

export default meta;
