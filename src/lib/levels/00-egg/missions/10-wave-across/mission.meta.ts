import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '10-wave-across',
	level: 0,
	order: 10,
	title: 'Wave Across',
	emoji: '👋',
	oneLiner: 'Two ducks. One presses A. The other waves. From across the room.',
	story: 'Both micro:bits speak to each other over a tiny radio. No wires. No internet. Just air.',
	duckyIntro: 'Press A on the chip in your hand — and watch your friend’s screen wave back.',
	hardware: ['radio', 'led-matrix', 'buttons'],
	pairMode: true,
	preset: 'wave-across',
	estMinutes: 5,
	remixPrompts: [
		'How far apart can the two chips get before the wave stops?',
		'Try walking around with one — does it still hear?'
	]
};

export default meta;
