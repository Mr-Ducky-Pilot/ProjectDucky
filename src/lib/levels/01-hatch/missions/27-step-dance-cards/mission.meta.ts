import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '27-step-dance-cards',
	level: 1,
	order: 27,
	title: 'Dance Cards',
	emoji: '💃',
	oneLiner: 'Choreography on screen, beat on the speaker, stomps from your feet.',
	story: 'Browser shows the next move. Duck plays the beat. Your job is to actually move — Ducky detects stomps with the accelerometer.',
	duckyIntro: 'Get up. Follow my cards. I\'ll count your steps.',
	hardware: ['accel', 'speaker', 'led-matrix'],
	pairMode: false,
	dimension: 'movement',
	estMinutes: 10,
	remixPrompts: [
		'Beat 50 stomps without missing the rhythm.',
		'Add a friend, hold one duck each, mirror each other\'s moves.',
		'Choreograph your own 8-card routine.'
	]
};

export default meta;
