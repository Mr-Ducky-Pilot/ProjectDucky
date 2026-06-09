import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '24-button-race',
	level: 2,
	order: 24,
	title: 'Button Race',
	emoji: '🏁',
	oneLiner: 'Two players, two buttons. First to the target wins.',
	story: "It's a race! Player A mashes button A, player B mashes button B. First to reach the target count wins. You set the target and the victory message — then flash it and compete.",
	duckyIntro: 'Set the finish line and the winning cry. Then battle it out!',
	hardware: ['buttons', 'led-matrix'],
	pairMode: false,
	dimension: 'mechanics',
	estMinutes: 10,
	remixPrompts: [
		'Set a really high WIN number like 50 for a long race.',
		'Change the win message to something funny.',
		'Add a display.scroll at the start to count down: "3", "2", "1", "GO!"',
		'OLED bonus: from ssd1327 import probe as op; oled=op() — show both scores side-by-side on the Grove display so spectators can follow the race!'
	]
};

export default meta;
