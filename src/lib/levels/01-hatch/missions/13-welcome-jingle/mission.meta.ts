import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '13-welcome-jingle',
	level: 1,
	order: 13,
	title: 'Welcome Jingle',
	emoji: '🎹',
	oneLiner: 'Tap a tune in the browser. Ducky plays it back.',
	story: 'A piano in your laptop, a speaker on your chip. Tap a melody — Ducky records it, then plays the whole thing on loop.',
	duckyIntro: 'Tap notes to make a tune. Then hit Play and I’ll perform.',
	hardware: ['speaker'],
	pairMode: false,
	dimension: 'music',
	estMinutes: 6,
	remixPrompts: [
		'Try Twinkle Twinkle: C C G G A A G',
		'A jingle that loops as your morning alarm.'
	]
};

export default meta;
