<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import BreathTrainer from '$lib/components/BreathTrainer.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

IN = ___(4)
HOLD = ___(7)
OUT = ___(8)

def ring(size):
    grid = [[0] * 5 for _ in range(5)]
    for y in range(5):
        for x in range(5):
            d = max(abs(x - 2), abs(y - 2))
            if d <= size - 1:
                grid[y][x] = 9
    display.show(Image(":".join("".join(str(c) for c in row) for row in grid)))

while True:
    for size in range(1, 6):
        ring(size)
        sleep(IN * 1000 // 5)
    sleep(HOLD * 1000)
    for size in range(5, 0, -1):
        ring(size)
        sleep(OUT * 1000 // 5)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Fill the breathing timings (in seconds). Default: 4 in, 7 hold, 8 out. Tweak them and feel the difference.
	</div>

	<BreathTrainer />

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Try the preview above for one minute first.',
			'Flash with 4-7-8, then re-flash with 5-5-5. Which feels calmer?',
			'Use Breath Buddy when you\'re actually stressed. Note what happens.'
		]}
	/>
</div>
