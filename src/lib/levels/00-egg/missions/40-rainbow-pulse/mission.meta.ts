import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '40-rainbow-pulse',
	level: 0,
	order: 40,
	title: 'Rainbow Pulse',
	emoji: '🌊',
	oneLiner: 'A glow that breathes in slow waves.',
	story: 'Watch your duck inhale and exhale. Every pixel rides a sine wave — pure brightness, pure calm.',
	duckyIntro: 'Match my pulse with your breathing. In… out… in…',
	hardware: ['led-matrix'],
	pairMode: false,
	preset: 'breathe',
	dimension: 'art',
	estMinutes: 3,
	remixPrompts: [
		'Breathe along with the wave — does it slow down your heart?',
		'Stand far away — does it still feel calming?',
		'Show a friend with no explanation. What do they say?'
	]
};

export default meta;
