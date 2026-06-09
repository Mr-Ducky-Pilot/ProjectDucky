import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '02-heartbeat',
	level: 0,
	order: 2,
	title: 'Heartbeat',
	emoji: '💓',
	oneLiner: 'A pulsing heart that never stops. Your first loop, no code.',
	story: 'Ducky has a heart shape that grows and shrinks forever. Sync up with it — try matching the rhythm with your hand.',
	duckyIntro: 'Watch the heart pulse. Then hit Send and your duck will pulse too.',
	hardware: ['led-matrix'],
	pairMode: false,
	preset: 'heartbeat',
	dimension: 'art',
	estMinutes: 2,
	remixPrompts: ['Try clapping along.', 'Can two ducks beat in sync?']
};

export default meta;
