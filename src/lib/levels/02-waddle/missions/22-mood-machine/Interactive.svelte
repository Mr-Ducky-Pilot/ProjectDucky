<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

while True:
    temp = temperature()

    if temp > ___(28):
        display.show(Image.HAPPY)
    elif temp < ___(20):
        display.show(Image.SAD)
    else:
        display.show(Image.SURPRISED)

    sleep(500)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		<strong>Your mission:</strong> Fill in two temperature thresholds (in °C).
		The first blank is "hot" — the chip shows HAPPY above it.
		The second is "cold" — SAD below it. SURPRISED in between.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> The chip reads its own CPU temperature. Try warming it in your hand — does the face change?
		Room temperature is usually 20–25°C so SURPRISED is common at first.
	</div>

	<YourTurn challenges={[
		'Change both thresholds to be very close together (e.g. 24 and 23). What happens?',
		'Replace Image.SURPRISED with Image.CONFUSED — flash and see the difference.',
		'Add a fourth condition: if temp > 35, show Image.ASTONISHED (use a second elif).'
	]} />
</div>
