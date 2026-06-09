import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '39-temperature-alert',
	level: 2,
	order: 39,
	title: 'Temperature Alert',
	emoji: '🥶',
	oneLiner: 'If it gets too hot or too cold, Ducky shouts a warning.',
	story: 'Comparators are how every alarm works. Pick a threshold, pick a message — your duck becomes a tiny watchdog.',
	duckyIntro: 'Want me to bark if it gets cold? Set my limit.',
	hardware: ['temp', 'led-matrix'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 7,
	remixPrompts: [
		'Build a "freezer alarm": >5°C = trigger.',
		'Build a "fever alert": >37°C using your finger heat.',
		'Add a second threshold for cold.'
	]
};

export default meta;
