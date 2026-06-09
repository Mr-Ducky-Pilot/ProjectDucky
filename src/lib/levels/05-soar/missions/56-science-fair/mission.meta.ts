import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '56-science-fair',
	level: 5,
	order: 56,
	title: 'Science Fair',
	emoji: '🔬',
	oneLiner: 'Log 5+ minutes of any sensor. Export the CSV. Make a real graph.',
	story: 'This is the long-form data logger: pick a sensor, set a duration, let it run. Browser captures everything. Export as CSV, open in any spreadsheet.',
	duckyIntro: 'Real science needs real data. Let\'s collect some.',
	hardware: ['temp', 'light', 'accel', 'mic'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 30,
	remixPrompts: [
		'Leave Ducky logging temperature overnight in your bedroom.',
		'Log light during a TV scene change — watch the graph.',
		'Log accelerometer during a walk to school.'
	]
};

export default meta;
