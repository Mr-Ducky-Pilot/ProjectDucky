import type { MissionMeta } from '$lib/missions/types';

const meta: MissionMeta = {
	id: '29-pond-call',
	level: 3,
	order: 29,
	title: 'Pond Call',
	emoji: '📡',
	oneLiner: 'Send your first radio message. Write the send and receive handlers.',
	story: "Your duck found a friend across the pond. Press A to wave. Write what happens when a wave arrives back. This is how every radio, wifi, and Bluetooth device on the planet works — send, receive, respond.",
	duckyIntro: 'One button. One send. One receive. The simplest possible radio app.',
	hardware: ['buttons', 'led-matrix', 'radio'],
	pairMode: true,
	estMinutes: 12,
	remixPrompts: [
		'Send a counter that increments each wave — the receiver can display the count.',
		'On receive, automatically send back an acknowledgement: radio.send("ack").',
		'Add a second message type: button B sends "bye" and the receiver shows a wave goodbye.'
	]
};

export default meta;
