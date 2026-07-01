import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '21-flight-radar',
	level: 1,
	order: 21,
	title: 'Flight Radar',
	emoji: '🛩️',
	oneLiner: 'Watch real aeroplanes fly overhead — live data from the sky.',
	story: 'Every commercial airliner broadcasts its position every second using ADS-B radio. Ducky listens in and paints a live radar showing all the real planes near a chosen airport.',
	duckyIntro: "Did you know there are thousands of planes in the air right now? Let's track them!",
	hardware: ['led-matrix'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 10,
	remixPrompts: [
		'Filter to only show planes above 30,000 ft — how many are cruising versus landing?',
		"Find the fastest plane on the radar — what's its speed in knots?",
		'Switch airports and compare — which one has the most traffic right now?'
	]
};

export default meta;
