<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
import music

while True:
    light = display.read_light_level()

    if light < ___(100):
        for i in range(___(3)):
            display.show(Image.ALL_LEDS)
            sleep(200)
            display.clear()
            sleep(200)
        music.play(music.___(DADADADUM))

    sleep(500)`;

	let code = $state('');
	let allFilled = $state(false);

	const tunes = ['DADADADUM', 'ENTERTAINER', 'NYAN', 'ODE', 'BIRTHDAY', 'RINGTONE'];
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		<strong>Your mission:</strong> Choose the darkness threshold (0–255, lower = darker),
		the flash count, and a tune name. Cover the light sensor on the chip to test it.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<div class="flex flex-wrap gap-2 text-xs">
		<span class="font-bold text-(--color-night-soft)">Available tunes:</span>
		{#each tunes as tune}
			<code class="rounded bg-(--color-night-ink) px-1.5 py-0.5 text-(--color-duck-yellow)">{tune}</code>
		{/each}
	</div>

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Cover the light sensor (the small transparent window near the bottom of the chip) with your finger. The LEDs should flash and music play. Uncover it to stop.
	</div>

	<YourTurn challenges={[
		'Test the trigger: cover the sensor slowly. At what level does it activate?',
		'Change the flash count to 10 — does it feel more urgent?',
		'Try NYAN or ENTERTAINER as the tune.'
	]} />
</div>
