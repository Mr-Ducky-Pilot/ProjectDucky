<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
import random

answers = [
    "___(yes)",
    "___(no)",
    "___(maybe)",
    "___(ask later)"
]

while True:
    if accelerometer.was_gesture('shake'):
        display.show(Image.SURPRISED)
        sleep(400)
        display.scroll(random.choice(answers))
    sleep(50)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Fill in <strong>four answers</strong>. They can be classic ("yes", "definitely"), funny ("ask again louder"), or chaotic — your call.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Ask 5 questions in a row. Did the same answer repeat?',
			'Edit the code: add a 5th answer that\'s an in-joke.',
			'Show it to a friend. See if they trust it.'
		]}
	/>
</div>
