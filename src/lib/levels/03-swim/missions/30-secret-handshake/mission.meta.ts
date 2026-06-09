import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '30-secret-handshake',
	level: 3,
	order: 30,
	title: 'Secret Handshake',
	emoji: '🤝',
	oneLiner: 'Each duck picks a secret number. Press A to handshake — only matching ducks celebrate.',
	story: "Two ducks, one secret each. Press A to broadcast your number. If the number you receive matches yours — you've found your partner duck! Write the matching logic and design what happens when you connect.",
	duckyIntro: 'Pick your secret. Write the match check. Find your duck.',
	hardware: ['buttons', 'led-matrix', 'speaker', 'radio'],
	pairMode: true,
	estMinutes: 15,
	remixPrompts: [
		'Track how many attempts it took to match — display.scroll(str(attempts)) at the end.',
		'Add shake to change your secret without reflashing: MY_SECRET = random.randint(1, 8) on shake.',
		'Make both boards play the same tune on match — they both have the same celebrate() code, so it syncs!'
	]
};

export default meta;
