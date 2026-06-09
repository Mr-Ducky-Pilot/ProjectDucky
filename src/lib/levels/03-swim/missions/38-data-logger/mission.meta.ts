import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '38-data-logger',
	level: 3,
	order: 38,
	title: 'Data Logger',
	emoji: '📊',
	oneLiner: 'Record 30 seconds of any sensor. Graph it back in the browser.',
	story: 'Real science means collecting data over time. Pick a sensor, set the duration, press A to start logging. Numbers stream back to the browser as a live graph.',
	duckyIntro: 'Let\'s do real science. Tell me what to measure.',
	hardware: ['light', 'temp', 'accel', 'mic'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 12,
	remixPrompts: [
		'Log light for 30s while you switch the room light on/off.',
		'Log temperature near a hot drink — watch it spike.',
		'Log accelerometer while you spin in a chair.'
	]
};

export default meta;
