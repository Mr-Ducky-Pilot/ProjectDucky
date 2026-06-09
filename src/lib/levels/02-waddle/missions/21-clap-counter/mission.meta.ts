import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '21-clap-counter',
	level: 2,
	order: 21,
	title: 'Clap Counter',
	emoji: '🎤',
	oneLiner: 'Fill in the blanks to count claps with the microphone.',
	story: 'Variables are like sticky notes — the chip can read them, change them, and remember them. Fill in three blanks and your chip will count every loud sound it hears.',
	duckyIntro: 'Three blanks, one mission: fill them in and watch the counter go!',
	hardware: ['mic', 'led-matrix'],
	pairMode: false,
	dimension: 'mechanics',
	estMinutes: 10,
	remixPrompts: [
		'Change the threshold so it only counts shouts, not claps.',
		'Make it count by 2 each time instead of 1.',
		'Can you reset the counter when it reaches 10?',
		'OLED bonus: from ssd1327 import probe as op; oled=op() — then show the count as big_text on the Grove display each time it changes.'
	]
};

export default meta;
