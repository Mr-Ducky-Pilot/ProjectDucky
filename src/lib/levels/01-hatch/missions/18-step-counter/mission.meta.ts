import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '18-step-counter',
	level: 1,
	order: 18,
	title: 'Step Counter',
	emoji: '👟',
	oneLiner: 'Clip the chip to your shoe. Count your steps on the LEDs.',
	story: "Every step you take sends a spike through the accelerometer. The browser counts those spikes and shows your progress — just like the fitness tracker in your pocket.",
	duckyIntro: "Walk around with me! Every step sends a tiny jolt that I'll count.",
	hardware: ['accel', 'led-matrix'],
	pairMode: false,
	estMinutes: 6,
	remixPrompts: [
		'Try counting jumps instead — the spike will be much bigger.',
		'Attach it to your wrist: does arm swing count as steps?',
		'Set a goal of 50 steps and race a friend.'
	]
};

export default meta;
