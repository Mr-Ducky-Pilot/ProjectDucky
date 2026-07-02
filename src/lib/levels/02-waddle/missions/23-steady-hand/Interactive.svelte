<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

best = 0
streak = 0

while True:
    x = accelerometer.get_x()
    y = accelerometer.get_y()
    wobble = abs(x) + abs(y)     # abs() strips the minus sign — direction doesn't matter here

    if wobble < ___(300):
        streak = streak + 1
        if streak > best:        # an if can live inside another if
            best = streak
        display.show(Image.HAPPY)
    else:
        streak = 0
        display.show(Image.SAD)

    sleep(___(100))`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		<strong>Your mission:</strong> Fill in the wobble limit and the sleep time.
		Wobble is the total movement in milligrams (mg) — lower numbers make it harder.
		Sleep controls how often the chip checks (shorter = more updates).
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Hold the chip as still as possible.
		Happy face = steady. Sad face = too much movement.
		The streak counts how many loops you've been steady in a row.
	</div>

	<YourTurn challenges={[
		'Start with wobble limit 500 (easy). Can you hold it steady for 20 loops?',
		'Lower the wobble limit to 150 — now how hard is it?',
		'Change the sleep to 50 — the chip updates faster. Does your score change?'
	]} />
</div>
