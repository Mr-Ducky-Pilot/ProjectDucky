import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '45-pet-grumpy-meter',
	level: 4,
	order: 45,
	title: 'Grumpy Meter',
	emoji: '😤',
	oneLiner: 'Loud noises slowly make your duck grumpy. Quiet calms it down.',
	story: 'Your first **state machine**. The duck holds a "grumpiness" number that creeps up under loud sound and drops in quiet. Cross a line and the face changes.',
	duckyIntro: 'Be kind to me — I get grumpy if you\'re too loud.',
	hardware: ['mic', 'led-matrix'],
	pairMode: false,
	dimension: 'wellbeing',
	dimensions: ['pet', 'wellbeing'],
	estMinutes: 10,
	petWrites: ['personality.grumpyEnabled'],
	petReads: true,
	remixPrompts: [
		'Yell at your duck. Watch it become grumpy.',
		'Stay quiet 30s. Watch it recover.',
		'Tune the thresholds. Make it sensitive or chilled.'
	]
};

export default meta;
