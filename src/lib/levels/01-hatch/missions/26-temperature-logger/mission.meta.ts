import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '26-temperature-logger',
	level: 1,
	order: 26,
	title: 'Temperature Logger',
	emoji: '📈',
	oneLiner: 'Record a live temperature graph and save it as a PNG.',
	story: 'Real scientists collect data over time. Plug Ducky in, leave it on a windowsill for an hour, then save the graph.',
	duckyIntro: 'I\'m a tiny weather station. Let\'s draw a graph together.',
	hardware: ['temp'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 15,
	remixPrompts: [
		'Open the freezer, hold Ducky inside for 30 seconds. What does the graph look like?',
		'Leave Ducky logging for 30 minutes in different rooms. Compare.',
		'Send the PNG to a parent — explain what you measured.'
	]
};

export default meta;
