import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '32-morse-messenger',
	level: 3,
	order: 32,
	title: 'Morse Messenger',
	emoji: '🔵',
	oneLiner: 'Tap dots and dashes to encode letters. Send them over radio. Decode on arrival.',
	story: "Before texts, sailors used Morse code — short and long signals to spell words. Short press A = dot. Long press A = dash. Press B to send the encoded letter over radio. The receiver scrolls the decoded letter. You build the dictionary.",
	duckyIntro: 'Write the alphabet in dots and dashes. Then talk without saying a word.',
	hardware: ['buttons', 'led-matrix', 'speaker', 'radio'],
	pairMode: true,
	dimension: 'mechanics',
	estMinutes: 25,
	remixPrompts: [
		'Add letters G–Z to your MORSE dictionary (look them up online and add each one).',
		'Play dot/dash sounds: music.pitch(1000, 100) for dot and music.pitch(500, 300) for dash as you tap.',
		'Send a whole word by encoding each letter and sending them one by one with a short pause between — wrap this in a send_word(word) function.'
	]
};

export default meta;
