import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '53-sensor-symphony',
	level: 5,
	order: 53,
	title: 'Sensor Symphony',
	emoji: '🎼',
	oneLiner: 'Three sensors become three instruments. Conduct your duck.',
	story: 'Light controls pitch. Tilt controls rhythm. Mic controls volume. Move your hand near the chip and music happens.',
	duckyIntro: 'I\'m an orchestra. You\'re the conductor.',
	hardware: ['light', 'accel', 'mic', 'speaker'],
	pairMode: false,
	dimension: 'music',
	dimensions: ['music', 'science'],
	estMinutes: 25,
	remixPrompts: [
		'Swap which sensor controls what.',
		'Make a duet — two ducks playing different parts.',
		'Record a 30-second improvisation.'
	]
};

export default meta;
