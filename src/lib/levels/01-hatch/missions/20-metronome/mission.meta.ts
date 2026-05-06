import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '20-metronome',
	level: 1,
	order: 20,
	title: 'Metronome',
	emoji: '🥁',
	oneLiner: 'Set the BPM. The chip keeps perfect time for you.',
	story: 'Slide the BPM, hit play, and the chip beats exactly on time — every time. Tap the button to set the tempo by feel. All music runs on a shared clock.',
	duckyIntro: 'Set your tempo and hit play. I\'ll keep the beat — you keep the rhythm!',
	hardware: ['led-matrix', 'speaker'],
	pairMode: false,
	estMinutes: 5,
	remixPrompts: [
		'Play a song and try to match its BPM by tapping.',
		'Set BPM to 60 and count "one two three four" on each beat — that\'s one bar of music.',
		'Try 180 BPM — can you tap along?'
	]
};

export default meta;
