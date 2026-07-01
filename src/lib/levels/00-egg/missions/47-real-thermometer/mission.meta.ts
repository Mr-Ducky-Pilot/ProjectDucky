import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '47-real-thermometer',
	level: 0,
	order: 47,
	title: 'Real Thermometer',
	emoji: '🌡️',
	oneLiner: 'A second, more honest thermometer — wired in from outside the chip.',
	story: 'Remember Warm or Cold? admitting the chip was cheating a little, reading its own CPU instead of the room? This time there\'s a real thermistor clipped onto the board, sitting in the air, not glued to a hot circuit. Watch the two numbers disagree.',
	duckyIntro: 'I have a real thermometer now. Let\'s see how wrong my old guess was.',
	hardware: ['temp', 'ambient-temp', 'led-matrix'],
	pairMode: false,
	preset: 'ambient-temp',
	dimension: 'science',
	estMinutes: 4,
	remixPrompts: [
		'Breathe on the real sensor, then on the chip itself — which reacts faster?',
		'Hold both near a window on a cold day — how far apart do the two numbers get?',
		'Leave Ducky running for 10 minutes without touching it — does the CPU reading drift up as the chip warms itself?'
	]
};

export default meta;
