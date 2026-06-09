import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '19-sound-alarm',
	level: 1,
	order: 19,
	title: 'Sound Alarm',
	emoji: '🔔',
	oneLiner: 'Arm it. Make a noise. Watch the chip go wild.',
	story: 'Set a sound threshold, arm the alarm, and leave it on your desk. The next time someone makes a noise — clap, whisper, talk — the LED matrix flashes and the speaker screams.',
	duckyIntro: 'Arm me and keep quiet… any sound will set me off!',
	hardware: ['mic', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'science',
	estMinutes: 6,
	remixPrompts: [
		'Put it under your notebook: anyone who picks it up will be caught!',
		'Set sensitivity low — try to trigger it with a whisper.',
		'Make a clap-counter instead: just count triggers without the alarm.'
	]
};

export default meta;
