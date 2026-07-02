<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

x = ___(2)     # starting column, 0-4
y = ___(2)     # starting row, 0-4

while True:
    display.clear()
    display.set_pixel(x, y, 9)   # (column, row, brightness 0-9)

    if button_a.was_pressed():
        x = x - 1
        if x < 0:                # went past the left edge — wrap to the right
            x = 4

    if button_b.was_pressed():
        x = x + 1
        if x > ___(4):           # went past the right edge — wrap to the left
            x = 0

    sleep(100)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		<strong>Your mission:</strong> Set the starting X and Y position (both 0–4, where 0 is top-left).
		Then set the right edge wrap value (4 means column 4, the rightmost).
		Button A moves left, button B moves right.
	</div>

	<div class="grid grid-cols-5 gap-1 place-self-center">
		{#each Array(25) as _, i}
			{@const col = i % 5}
			{@const row = Math.floor(i / 5)}
			<div
				class="size-8 rounded-sm text-center text-xs font-mono leading-8"
				class:bg-(--color-duck-yellow)={col === 2 && row === 2}
				class:text-(--color-night-ink)={col === 2 && row === 2}
				class:bg-(--color-mist)={!(col === 2 && row === 2)}
				class:text-(--color-night-soft)={!(col === 2 && row === 2)}
			>{col},{row}</div>
		{/each}
	</div>
	<p class="text-center text-xs text-(--color-night-soft)">The default starting dot (2,2) is shown in yellow above.</p>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Press A to move the dot left, B to move right.
		When it reaches the edge it wraps to the other side. The dot stays in row Y — try changing Y to move it to a different row.
	</div>

	<YourTurn challenges={[
		'Start the dot at (0, 4) — the bottom-left corner.',
		'Change starting y to 0, 1, 3, or 4 and flash again — what changes?',
		'Remove the display.clear() line and flash — what happens to the trail?'
	]} />
</div>
