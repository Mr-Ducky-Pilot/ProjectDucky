import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '37-pet-signature-sound',
	level: 3,
	order: 37,
	title: 'Signature Sound',
	emoji: '🎵',
	oneLiner: 'Compose a four-note jingle. Your duck plays it on every greeting.',
	story: 'Like NBC\'s three-note "G-E-C" or Netflix\'s "ta-dum" — every duck deserves its own opener. Pick four notes and lock them in.',
	duckyIntro: 'When I wake up, what should I sing?',
	hardware: ['speaker'],
	pairMode: false,
	dimension: 'music',
	dimensions: ['music', 'pet'],
	estMinutes: 8,
	petWrites: ['personality.greeting.tone'],
	remixPrompts: [
		'Try to copy a TV show\'s opener.',
		'Make it ascending. Then descending. Which feels happier?',
		'Two ducks, two signatures — can a friend hear yours from across the room?'
	]
};

export default meta;
