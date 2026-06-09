import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '37-breath-buddy',
	level: 2,
	order: 37,
	title: 'Breath Buddy',
	emoji: '🌬️',
	oneLiner: 'A 4-7-8 breathing trainer. Inhale, hold, exhale — Ducky guides you.',
	story: 'This pattern is used in therapy and sleep apps. Four seconds in, seven holding, eight out. Ducky\'s LEDs expand and contract to lead you.',
	duckyIntro: 'When you feel wobbly, come back here. I\'ll breathe with you.',
	hardware: ['led-matrix'],
	pairMode: false,
	dimension: 'wellbeing',
	estMinutes: 8,
	remixPrompts: [
		'Tweak the timings to 5-5-5 (calmer). Or 4-4-4 (faster).',
		'Try it before bed for a week. Track if you sleep better.',
		'Share with a parent — breathe together.'
	]
};

export default meta;
