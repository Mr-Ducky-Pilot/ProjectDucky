import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '40-jump-counter',
	level: 2,
	order: 40,
	title: 'Jump Counter',
	emoji: '🤸',
	oneLiner: 'Strap Ducky to your shoelace, jump in place — it counts.',
	story: 'Every jump spikes the Z-axis accelerometer. Your code looks for the spike, increments a counter, scrolls the total.',
	duckyIntro: 'I\'m your tiny coach. Jump until I hit your target.',
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	dimension: 'movement',
	estMinutes: 8,
	remixPrompts: [
		'Hit 30 jumps without missing the rhythm.',
		'Make the threshold easier — count tiptoe bounces.',
		'Have your duck cheer at every 10.'
	]
};

export default meta;
