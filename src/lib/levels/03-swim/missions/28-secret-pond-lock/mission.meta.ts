import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '28-secret-pond-lock',
	level: 3,
	order: 28,
	title: 'Secret Pond Lock',
	emoji: '🔐',
	oneLiner: 'Build a binary passcode lock — A presses 0, B presses 1. Match the combo to unlock.',
	story: "Every pond needs a guard. You decide the combination (a sequence of 0s and 1s), then build the code that collects button presses, checks them against your secret, and unlocks or rejects. The display tells you what's happening.",
	duckyIntro: 'You set the secret. You write the check. Can someone else crack your pond?',
	hardware: ['buttons', 'accel', 'led-matrix'],
	pairMode: false,
	estMinutes: 15,
	remixPrompts: [
		'Add a wrong-entry counter and lock the board for 5 seconds after 3 wrong guesses.',
		'Make a shake gesture reset the entry list (so you can start over without reflashing).',
		'Add a "master override" — holding both A and B together always unlocks regardless of entry.'
	]
};

export default meta;
