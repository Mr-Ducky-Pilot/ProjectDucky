import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '05-cold-hands',
	level: 0,
	order: 5,
	title: 'Cold Hands',
	emoji: '🌡️',
	oneLiner: 'Cup the chip. Watch the temperature climb in real time.',
	story: 'There’s a thermometer baked into the chip. Hold it tightly and warm it up — see how fast the number changes.',
	duckyIntro: 'Wrap your hands around the chip and try to warm it past 30°C.',
	hardware: ['temp'],
	pairMode: false,
	hexPath: '/hex/L0-05-cold-hands.hex',
	hexVariant: 'static',
	estMinutes: 3,
	remixPrompts: [
		'Cup it for 30 seconds. Now stick it in the fridge for one minute. Compare.',
		'Two ducks: do they read the same temperature?'
	]
};

export default meta;
