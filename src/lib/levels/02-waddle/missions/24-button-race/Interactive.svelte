<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

WIN = ___(10)
a_score = 0
b_score = 0

while True:
    if button_a.was_pressed():   # True for one loop, right after A is pressed
        a_score = a_score + 1
        display.show("A")
        if a_score >= WIN:
            display.scroll("___(A wins!)")
            a_score = 0
            b_score = 0

    if button_b.was_pressed():
        b_score = b_score + 1
        display.show("B")
        if b_score >= WIN:
            display.scroll("___(B wins!)")
            a_score = 0
            b_score = 0

    sleep(50)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		<strong>Your mission:</strong> Set the <code>WIN</code> target (how many presses to win),
		and write victory messages for player A and player B.
		Keep messages short — they scroll across the LEDs!
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Two players, one chip. Player A presses button A,
		player B presses button B. The screen flashes each press so you can keep count. First to WIN presses gets the trophy message.
	</div>

	<YourTurn challenges={[
		'Set WIN to 5 for a quick game, then 20 for a longer race.',
		'Write a funny victory message longer than 10 characters.',
		'After a win, add display.show(Image.HAPPY) before the scroll so the face flashes first.'
	]} />
</div>
