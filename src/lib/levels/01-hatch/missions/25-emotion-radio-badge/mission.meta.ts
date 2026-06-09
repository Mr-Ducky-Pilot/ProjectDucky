import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '25-emotion-radio-badge',
	level: 1,
	order: 25,
	title: 'Emotion Radio',
	emoji: '💌',
	oneLiner: 'Send a feeling over radio to a friend\'s duck.',
	story: 'Pick a mood emoji. Hit broadcast. Anyone else with their duck nearby sees your feeling on their screen.',
	duckyIntro: 'Two ducks in the room? Send a feeling — see what comes back.',
	hardware: ['led-matrix', 'radio'],
	pairMode: true,
	dimension: 'story',
	dimensions: ['story', 'wellbeing'],
	estMinutes: 8,
	remixPrompts: [
		'Send a feeling, then text the same friend asking what they got. Match?',
		'Send three feelings in a row. Does the order matter?',
		'Make up your own emoji code with a friend before you start.'
	]
};

export default meta;
