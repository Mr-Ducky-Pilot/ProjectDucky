import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '22-mood-machine',
	level: 2,
	order: 22,
	title: 'Mood Machine',
	emoji: '😊',
	oneLiner: 'The chip reads its own temperature and shows how it feels.',
	story: 'Chips run warmer when they work harder. Fill in two temperature thresholds and your chip will judge its own mood — happy if warm, sad if cold, surprised in between.',
	duckyIntro: 'Hot, cold, or just right? Fill in the thresholds and see!',
	hardware: ['temp', 'led-matrix'],
	pairMode: false,
	estMinutes: 10,
	remixPrompts: [
		'Change the faces to ANGRY, ASLEEP, or CONFUSED.',
		'Add a fourth face for "freezing" (below 15°C).',
		'Print the actual temperature number instead of a face.',
		'OLED bonus: from ssd1327 import probe as op; oled=op() — show the mood word ("HAPPY", "COLD") in big_text on the Grove display instead of just the LED face.'
	]
};

export default meta;
