import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '07-whisper-or-shout',
	level: 0,
	order: 7,
	title: 'Whisper or Shout',
	emoji: '🎤',
	oneLiner: 'A tiny VU meter on the chip that listens to the room.',
	story: 'There is a tiny microphone on the back of the chip. The bars climb when there is sound — your voice, claps, music, a creaky door.',
	duckyIntro: 'Whisper. Now shout. Now clap. The bars react in real time.',
	hardware: ['mic', 'led-matrix'],
	pairMode: false,
	preset: 'whisper',
	dimension: 'music',
	estMinutes: 3,
	remixPrompts: [
		'How quiet can you be and still move the meter?',
		'Try clapping in a rhythm — see the pattern.'
	]
};

export default meta;
