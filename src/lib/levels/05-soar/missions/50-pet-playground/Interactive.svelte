<script lang="ts">
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const safe = (s: string) => s.replace(/"/g, '');

	const INITIAL = $derived(`# Playground for ${safe($pet.name) || 'Ducky'}
from microbit import *
import music
import radio

NAME = "${safe($pet.name) || 'Ducky'}"
CALL = "${$pet.personality.callSign}"

radio.on()
radio.config(channel=42)

display.scroll("Hi " + NAME)

while True:
    if button_a.was_pressed():
        display.show(Image.HEART)
        music.play(['C5:2','E5:2','G5:4'])
        sleep(400)
        display.show(Image.HAPPY)
    if button_b.was_pressed():
        radio.send('PING|' + CALL)
        display.show(Image.ARROW_E)
        sleep(300)
        display.show(Image.HAPPY)
    sleep(50)`);

	let code = $state(INITIAL);

	$effect(() => {
		code = INITIAL;
	});
</script>

<div class="flex flex-col gap-5">
	<FreePythonEditor initial={INITIAL} bind:code />

	<FlashCodeButton {code} onFlashed={complete} />

	<div class="rounded-2xl bg-egg-cream p-4 shadow-soft">
		<h3 class="mb-2 font-display font-bold text-night-ink">Share your remix</h3>
		<QrShareCard variant="remix" remix={{ missionId: '50-pet-playground', code, notes: 'My playground experiment' }} title="Share this remix" />
	</div>

	<YourTurn
		title="Try this"
		challenges={[
			'Make A play a different tune than the template.',
			'Make shake do something surprising.',
			'Use radio to send messages between two boards.'
		]}
	/>
</div>
