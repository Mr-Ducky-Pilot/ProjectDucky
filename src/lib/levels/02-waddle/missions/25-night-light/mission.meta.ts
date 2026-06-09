import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '25-night-light',
	level: 2,
	order: 25,
	title: 'Night Light',
	emoji: '💡',
	oneLiner: 'Gets dark? Flash the LEDs and play a tune. A real device.',
	story: 'This is a real night-light alarm. When the room goes dark, the chip flashes and plays music. You choose when it triggers, how many flashes, and which tune. Three blanks, real hardware.',
	duckyIntro: 'A proper gadget — you write it, you flash it, it works!',
	hardware: ['light', 'led-matrix', 'speaker'],
	pairMode: false,
	estMinutes: 12,
	remixPrompts: [
		'Try different tunes: ENTERTAINER, NYAN, or ODE.',
		'Flash faster by changing sleep(200) to sleep(100).',
		'Add display.scroll("DARK!") before the for loop.',
		'OLED bonus: from ssd1327 import probe as op; oled=op() — show the current light level as a big number on the Grove display so you can calibrate your dark threshold.'
	]
};

export default meta;
