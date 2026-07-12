<script lang="ts">
	import { onMount } from 'svelte';
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import MicrobitPreview from '$lib/components/MicrobitPreview.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import DataGraph from '$lib/components/DataGraph.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let sensor = $state<'temp' | 'light' | 'accel' | 'mic'>('light');
	let durationMin = $state(5);

	const INITIAL = $derived(`from microbit import *

SAMPLE_MS = 500
DURATION_MS = ${durationMin} * 60 * 1000
SENSOR = "${sensor}"

def read():
    if SENSOR == 'temp': return temperature()
    if SENSOR == 'light': return display.read_light_level()
    if SENSOR == 'accel': return accelerometer.get_strength()
    try:
        return microphone.sound_level()
    except:
        return 0

display.show(Image.YES)
start = running_time()
while running_time() - start < DURATION_MS:
    t = running_time() - start
    print('<L D ' + SENSOR + ' ' + str(t) + ' ' + str(read()) + '>')
    sleep(SAMPLE_MS)
display.show(Image.HEART)`);

	let code = $state(INITIAL);
	$effect(() => {
		code = INITIAL;
	});

	let samples = $state<{ t: number; v: number; sensor: string }[]>([]);

	onMount(() => {
		return connection.onEvent((e) => {
			if (e.type === 'log' && e.text.startsWith('D ')) {
				const [, sName, t, v] = e.text.split(' ');
				samples = [...samples, { t: Number(t), v: Number(v), sensor: sName }];
			}
		});
	});

	function clear() {
		samples = [];
	}

	function exportCsv() {
		const csv = 'time_ms,sensor,value\n' + samples.map((s) => `${s.t},${s.sensor},${s.v}`).join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${sensor}-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
</script>

<div class="flex flex-col gap-5">
	<div class="grid gap-4 md:grid-cols-2">
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Sensor</span>
			<select class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display" bind:value={sensor}>
				<option value="temp">Temperature</option>
				<option value="light">Light</option>
				<option value="accel">Accel strength</option>
				<option value="mic">Microphone</option>
			</select>
		</label>
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Duration (min)</span>
			<input type="range" min="1" max="60" bind:value={durationMin} class="mt-1 w-full" />
			<span class="text-sm font-mono">{durationMin} min</span>
		</label>
	</div>

	<div class="grid gap-4 md:grid-cols-[1fr_auto]">
		<FreePythonEditor initial={INITIAL} bind:code />
		<div class="md:w-64"><MicrobitPreview {code} /></div>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<div class="flex items-center justify-between">
		<h3 class="font-display text-lg font-bold text-night-ink">Live graph ({samples.length} samples)</h3>
		<div class="flex gap-2">
			<button class="rounded-full bg-mist px-3 py-1 text-sm" onclick={clear}>Clear</button>
			<button class="rounded-full bg-duck-yellow px-3 py-1 text-sm font-bold" disabled={samples.length === 0} onclick={exportCsv}>
				Export CSV
			</button>
		</div>
	</div>
	<div class="rounded-2xl bg-egg-cream p-4 shadow-soft">
		<DataGraph {samples} color="#4cc1ff" />
	</div>

	<YourTurn
		title="Run an experiment"
		challenges={[
			'Log temperature for 30+ min. Look for a pattern.',
			'Open the CSV in a spreadsheet. Make a chart.',
			'Compare two different rooms.'
		]}
	/>
</div>
