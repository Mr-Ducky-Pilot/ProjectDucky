import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '32-morse-messenger',
	level: 3,
	order: 32,
	title: 'Morse Messenger',
	emoji: '🔵',
	oneLiner: 'Tap dots and dashes to encode letters. Send them over radio. Decode on arrival.',
	story: "Before texts, sailors used Morse code — short and long signals to spell words. Short press A = dot, long press A = dash — each one flashes the RGB LED and plays a tone. Press B to send the encoded letter over radio. The receiver scrolls the decoded letter and flashes green. You build the dictionary.",
	duckyIntro: 'Write the alphabet in dots and dashes. Then talk without saying a word.',
	hardware: ['buttons', 'led-matrix', 'rgb-led', 'speaker', 'radio'],
	pairMode: true,
	dimension: 'mechanics',
	estMinutes: 25,
	remixPrompts: [
		'Add letters G–Z to your MORSE dictionary (look them up online and add each one).',
		'Swap the dot/dash RGB colours for your own scheme.',
		'Send a whole word by encoding each letter and sending them one by one with a short pause between — wrap this in a send_word(word) function.'
	]
};

export default meta;
