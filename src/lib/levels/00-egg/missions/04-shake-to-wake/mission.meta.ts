import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '04-shake-to-wake',
	level: 0,
	order: 4,
	title: 'Shake It',
	emoji: '🤸',
	oneLiner: 'Wave the chip in the air. Watch it get dizzy.',
	story: 'There is a tiny motion-sensor inside Ducky. Shake the board and it’ll giggle, dizzy spin, then settle.',
	duckyIntro: 'Pick the chip up. Wiggle it. The graph is your motion in 3D!',
	hardware: ['accel', 'speaker', 'led-matrix'],
	pairMode: false,
	hexPath: '/hex/L0-04-shake.hex',
	hexVariant: 'static',
	estMinutes: 2,
	remixPrompts: ['Try really gentle shakes vs really hard ones.', 'Can you balance Ducky perfectly still?']
};

export default meta;
