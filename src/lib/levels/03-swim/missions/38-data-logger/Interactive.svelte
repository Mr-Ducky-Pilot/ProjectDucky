<script lang="ts">
	import { onMount } from 'svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import DataGraph from '$lib/components/DataGraph.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

DURATION = 30   # seconds
SAMPLE_MS = ___(200)

def log(t, v):
    print('<L D ' + str(t) + ' ' + str(v) + '>')

display.show(Image.YES)
start = running_time()

while running_time() - start < DURATION * 1000:
    t = running_time() - start
    ___ml(read a sensor — try display.read_light_level() or temperature() or accelerometer.get_x())
    sleep(SAMPLE_MS)

display.show(Image.HEART)`;

	let code = $state('');
	let allFilled = $state(false);
	let samples = $state<{ t: number; v: number }[]>([]);

	onMount(() => {
		return connection.onEvent((e) => {
			if (e.type === 'log' && e.text.startsWith('D ')) {
				const [, t, v] = e.text.split(' ');
				samples = [...samples, { t: Number(t), v: Number(v) }];
			}
		});
	});

	function clear() {
		samples = [];
	}
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Set the sample interval (in ms — smaller = more samples) and fill the function body with
		a single line that reads your chosen sensor and calls <code>log(t, value)</code>.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<div class="flex items-center justify-between">
		<h3 class="font-display text-lg font-bold text-night-ink">Live graph</h3>
		<button class="rounded-full bg-mist px-3 py-1 text-sm font-bold" onclick={clear}>Clear</button>
	</div>
	<div class="rounded-2xl bg-egg-cream p-4 shadow-soft">
		<DataGraph {samples} unit="" color="#7ad44b" />
	</div>

	<YourTurn
		title="After flashing"
		challenges={[
			'Log light for 30s. Cover/uncover the chip. See the dips.',
			'Try a temperature run while warming the chip with your hand.',
			'Log accelerometer X — walk in a circle holding it flat.'
		]}
	/>
</div>
