import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '24-drum-pad',
	level: 1,
	order: 24,
	title: 'Drum Pad',
	emoji: '🥁',
	oneLiner: '4×4 step sequencer. Tap cells, hit play, your duck drums.',
	story: 'This is how real producers build beats — a grid of "play this here" cells. Pick a sound per row, tap when it should hit, and start the loop.',
	duckyIntro: 'You program the beat. I\'m the drum machine.',
	hardware: ['speaker', 'led-matrix'],
	pairMode: false,
	dimension: 'music',
	estMinutes: 12,
	remixPrompts: [
		'Make a rock beat — kick on 1 and 3, snare on 2 and 4.',
		'Now make a beat that\'s the OPPOSITE of rock.',
		'Loop it for a full minute. Dance.'
	]
};

export default meta;
