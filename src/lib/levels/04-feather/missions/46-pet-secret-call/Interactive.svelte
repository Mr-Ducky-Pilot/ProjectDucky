<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let callSign = $state($pet.personality.callSign);

	$effect(() => {
		updatePersonality({ callSign: callSign.toUpperCase().slice(0, 6) });
	});

	function regenerate() {
		const letters = 'BCDFGHJKLMNPQRSTVWXYZ';
		let s = '';
		for (let i = 0; i < 6; i++) s += letters[Math.floor(Math.random() * letters.length)];
		callSign = s;
	}

	const code = $derived(`from microbit import *
import radio

CALL = '${callSign.toUpperCase().slice(0, 6)}'

radio.on()
radio.config(channel=42)
display.show(Image.YES)

while True:
    if button_a.was_pressed():
        radio.send('PING|' + CALL)
        display.show(Image.ARROW_E)
        sleep(200)
        display.show(Image.YES)
    msg = radio.receive()
    if msg and msg.startswith('PING|'):
        their_call = msg[5:]
        if their_call == CALL:
            display.show(Image.HEART)
            sleep(500)
        else:
            display.show(Image.NO)
            sleep(200)
        display.show(Image.YES)
    sleep(50)`);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-2xl bg-egg-cream p-5 shadow-soft text-center">
		<p class="text-xs font-bold uppercase tracking-widest text-night-soft">My call sign</p>
		<input
			class="mt-2 w-full max-w-xs mx-auto rounded-md border-2 border-mist bg-white px-3 py-3 text-center font-mono text-2xl uppercase tracking-widest"
			maxlength="6"
			bind:value={callSign}
		/>
		<button class="mt-2 text-sm text-night-soft underline" onclick={regenerate}>
			generate new
		</button>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="Try with a friend"
		challenges={[
			'Press A. Watch the broadcast arrow.',
			'Friend\'s duck sends — yours shows NO (not for you).',
			'Both pick the same call sign — both light up.'
		]}
	/>
</div>
