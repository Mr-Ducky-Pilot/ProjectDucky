import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '27-duck-dance-party',
	level: 3,
	order: 27,
	title: 'Duck Dance Party',
	emoji: '🕺',
	oneLiner: 'Write your own dance moves as Python functions — then trigger them live.',
	story: "Functions are named sequences of actions. Give each dance move a name, write its steps, and call it on cue. Button A, button B, and a shake each trigger a different routine — you decide what they do.",
	duckyIntro: 'Three moves, all yours to design. What does a duck do when it dances?',
	hardware: ['buttons', 'accel', 'led-matrix', 'speaker'],
	pairMode: false,
	dimension: 'music',
	estMinutes: 12,
	remixPrompts: [
		'Add a 4th move triggered by a logo touch (use pin_logo.is_touched()).',
		'Make shaking 3× in quick succession chain all three moves back-to-back.',
		'Add a random move: use random.choice([dance_a, dance_b, dance_shake])() to pick one at random.'
	]
};

export default meta;
