import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '58-mood-garden',
	level: 5,
	order: 58,
	title: 'Mood Garden',
	emoji: '🌱',
	oneLiner: 'An open sandbox for feelings — colour, sound, radio, and a running log.',
	story: 'Everything from this whole journey, in one blank file: the RGB LED, built-in sounds, the LED matrix, radio, and your saved pet. Grow it into whatever helps you notice how you feel — a mood diary, a check-in ritual, a broadcast to friends.',
	duckyIntro: 'No more guard rails. Build a feeling-tracker only you would build.',
	hardware: ['led-matrix', 'rgb-led', 'speaker', 'radio', 'buttons'],
	pairMode: false,
	dimension: 'wellbeing',
	dimensions: ['wellbeing', 'pet'],
	estMinutes: 20,
	petReads: true,
	remixPrompts: [
		'Log every mood change with print(\'<L D \' + name + \' \' + str(running_time()) + \'>\') and watch the pattern in the Board Output.',
		'Build a "check-in" ritual: press A once a day, pick a mood, and have Ducky remember your streak.',
		'Broadcast your current mood over radio every 10 seconds so a friend\'s duck always shows how you\'re doing.'
	]
};

export default meta;
