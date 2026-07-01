<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let chipTemp = $state(0);
	let ambientTemp = $state(0);
	let hasChipData = $state(false);
	let hasAmbientData = $state(false);

	onMount(() => {
		let offChip: (() => void) | null = null;
		let offAmbient: (() => void) | null = null;

		async function subscribe() {
			try {
				offChip?.(); offChip = null;
				offAmbient?.(); offAmbient = null;
				offChip = await connection.streamSensor('temp', ([v]) => {
					chipTemp = v;
					hasChipData = true;
				});
				offAmbient = await connection.streamSensor('ambient-temp', ([v]) => {
					ambientTemp = v;
					hasAmbientData = true;
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => { offChip?.(); offAmbient?.(); offReady(); };
	});

	const diff = $derived(Math.abs(chipTemp - ambientTemp));
</script>

<div class="flex flex-col gap-4">
	<div class="grid gap-4 sm:grid-cols-2">
		<SensorMeter value={chipTemp} min={10} max={40} label="Chip (old guess)" unit="°C" color="#ff9b1a" />
		<SensorMeter value={ambientTemp} min={10} max={40} label="Real thermometer" unit="°C" color="#4cc1ff" />
	</div>

	{#if hasChipData && hasAmbientData}
		<div class="rounded-2xl bg-(--color-mist) p-3 text-center">
			<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Difference</p>
			<p class="font-mono text-2xl font-extrabold">{diff.toFixed(1)}°C</p>
		</div>
	{:else}
		<p class="text-center text-xs text-(--color-night-soft)">
			Flash Ducky first — then both numbers update live.
		</p>
	{/if}
</div>
