import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '38-loudness-painter',
	level: 2,
	order: 38,
	title: 'Loudness Painter',
	emoji: '🎤',
	oneLiner: 'The louder you are, the brighter Ducky paints.',
	story: 'Microphone level becomes a brightness — every sound you make adds a glowing dot.',
	duckyIntro: 'Hum, talk, sing. I\'ll paint with your voice.',
	hardware: ['mic', 'led-matrix'],
	pairMode: false,
	dimension: 'music',
	dimensions: ['music', 'art'],
	estMinutes: 9,
	remixPrompts: [
		'Sing one quiet note then one loud — see the contrast.',
		'Try whispering to leave a faint pattern.',
		'Play music near it — does the rhythm show?'
	]
};

export default meta;
