<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

count = 0

while True:
    sound = microphone.sound_level()

    if sound > ___(150):
        count = count + ___(1)
        display.scroll(str(count))
        sleep(___(500))`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		<strong>Your mission:</strong> Fill in the three blanks so the chip counts claps.
		The first blank controls how loud before it counts. The second controls how much to add.
		The third is how long to pause after each count (in milliseconds).
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Clap near the chip. The number scrolls across the LEDs each time it hears a loud sound.
	</div>

	<YourTurn challenges={[
		'Change the threshold so it only counts loud claps, not quiet ones.',
		'Change the increment so it counts by 2 each time.',
		'Try setting the sleep to 200 — what changes?'
	]} />
</div>
