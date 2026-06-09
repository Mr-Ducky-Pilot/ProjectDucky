import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '47-pet-dream-mode',
	level: 4,
	order: 47,
	title: 'Dream Mode',
	emoji: '💤',
	oneLiner: 'After 30s of stillness, your duck drifts into a sleep animation.',
	story: 'Idle detection + a soft dreaming visual. Move it and it wakes. Leave it, it sleeps.',
	duckyIntro: 'When you forget about me, I\'ll dream.',
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'art',
	dimensions: ['pet', 'wellbeing'],
	estMinutes: 8,
	petWrites: ['personality.dreamMode'],
	petReads: true,
	remixPrompts: [
		'Tune the idle window — 10 seconds? 60?',
		'Change the dream animation.',
		'See how long you can keep your duck awake.'
	]
};

export default meta;
