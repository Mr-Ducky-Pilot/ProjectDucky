<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';
	import DataGraph from '$lib/components/DataGraph.svelte';

	type Sample = { t: number; v: number };

	let samples = $state<Sample[]>([]);
	let recording = $state(false);
	let started = 0;

	function start() {
		samples = [];
		started = Date.now();
		recording = true;
	}

	function stop() {
		recording = false;
	}

	function exportPng() {
		const canvas = document.querySelector<HTMLCanvasElement>('#temp-graph');
		if (!canvas) return;
		const url = canvas.toDataURL('image/png');
		const a = document.createElement('a');
		a.href = url;
		a.download = `temp-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = await connection.streamSensor('temp', ([v]) => {
					if (recording) samples = [...samples, { t: Date.now() - started, v }];
				});
			} catch {
				/* not connected */
			}
		}
		void subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => {
			off?.();
			offReady();
		};
	});

	const stats = $derived.by(() => {
		if (samples.length === 0) return null;
		const vs = samples.map((s) => s.v);
		return {
			min: Math.min(...vs),
			max: Math.max(...vs),
			avg: Math.round(vs.reduce((a, b) => a + b, 0) / vs.length),
			count: samples.length
		};
	});
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-3">
		{#if !recording}
			<button class="rounded-full bg-night-ink px-4 py-2 font-display font-bold text-white" onclick={start}>
				● Start logging
			</button>
		{:else}
			<button class="rounded-full bg-sunset-coral px-4 py-2 font-display font-bold text-white" onclick={stop}>
				■ Stop
			</button>
		{/if}
		{#if samples.length > 0}
			<button class="rounded-full bg-duck-yellow px-4 py-2 font-display font-bold text-night-ink" onclick={exportPng}>
				Save PNG
			</button>
		{/if}
		{#if stats}
			<span class="text-sm text-night-soft">
				{stats.count} samples · min {stats.min}°C · max {stats.max}°C · avg {stats.avg}°C
			</span>
		{/if}
	</div>

	<div class="rounded-2xl bg-egg-cream p-4 shadow-soft">
		<DataGraph
			id="temp-graph"
			samples={samples.map((s) => ({ t: s.t, v: s.v }))}
			unit="°C"
			color="#ff7a6b"
		/>
	</div>
</div>
