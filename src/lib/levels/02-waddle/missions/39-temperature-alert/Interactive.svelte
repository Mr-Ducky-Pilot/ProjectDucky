<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

HIGH = ___(30)

while True:
    t = temperature()
    if t > HIGH:
        display.scroll("___(TOO HOT)")
        display.show(Image.NO)
        sleep(500)
    else:
        display.show(Image.YES)
    sleep(1000)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Pick a temperature threshold (in °C) and a warning message. Press your finger
		on the back of the chip to warm it up past your threshold.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Cup your hands around the chip — does the alarm fire?',
			'Drop the threshold to 25 — alarm gets way more sensitive.',
			'Try "TOO COLD" with t < 20 instead.'
		]}
	/>
</div>
