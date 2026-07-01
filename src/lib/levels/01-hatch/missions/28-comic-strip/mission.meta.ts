import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '28-comic-strip',
	level: 1,
	order: 28,
	title: 'Comic Strip',
	emoji: '📖',
	oneLiner: 'Four panels, four feelings. Tell a tiny story.',
	story: 'Draw 4 LED frames and write a caption for each. Hit play — Ducky shows the strip on the matrix, panel by panel.',
	duckyIntro: 'Storytellers used to need a printing press. You need me.',
	hardware: ['led-matrix'],
	pairMode: false,
	dimension: 'story',
	dimensions: ['art', 'story'],
	estMinutes: 12,
	remixPrompts: [
		'Tell the story of your day in four panels.',
		'Swap with a friend, predict each other\'s endings.',
		'Make a strip with no captions. Can the panels alone tell the story?'
	]
};

export default meta;
