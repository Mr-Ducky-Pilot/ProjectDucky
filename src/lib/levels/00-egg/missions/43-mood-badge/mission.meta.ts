import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '43-mood-badge',
	level: 0,
	order: 43,
	title: 'Mood Badge',
	emoji: '🎭',
	oneLiner: 'Press A or B to show how you feel — wear your duck like a pin.',
	story: 'Happy, sad, sleepy, silly — pick whichever fits today. Your friends will see and know without you saying a word.',
	duckyIntro: 'How do you feel right now? Press A or B to tell me.',
	hardware: ['buttons', 'led-matrix', 'oled'],
	pairMode: false,
	preset: 'mood-badge',
	dimension: 'wellbeing',
	dimensions: ['story', 'wellbeing'],
	estMinutes: 4,
	remixPrompts: [
		'Set Ducky to match your mood every hour for a day.',
		'Show a friend your badge — can they guess what each face means?',
		'Decide together with a friend: which face means what?'
	]
};

export default meta;
