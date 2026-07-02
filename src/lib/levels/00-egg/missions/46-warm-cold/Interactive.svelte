<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';
	import { streamAmbientTemp } from '$lib/data/ambientTemp';
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	let cpuTemp = $state(21);
	let ambientTemp = $state<number | null>(null);
	let ambientAvailable = $state(false);

	// Prefer the real Grove sensor when it's connected; otherwise the chip's
	// own CPU-proxy reading (what this mission always used before).
	const temp = $derived(ambientAvailable && ambientTemp !== null ? ambientTemp : cpuTemp);

	const lit = $derived(Math.max(0, Math.min(5, Math.floor((temp - 18) / 3) + 1)));
	const bits = $derived(Array.from({ length: 25 }, (_, i) => 4 - Math.floor(i / 5) < lit));
	const label = $derived(temp < 22 ? 'cool' : temp < 28 ? 'warm' : 'hot!');
	const color = $derived(temp < 22 ? '#4cc1ff' : temp < 28 ? '#ffd23a' : '#ff7a6b');

	onMount(() => {
		let offCpu: (() => void) | null = null;
		let offAmbient: (() => void) | null = null;

		async function subscribe() {
			try {
				offCpu?.();
				offCpu = null;
				offCpu = await connection.streamSensor('temp', ([v]) => (cpuTemp = v));
			} catch {
				/* preview only */
			}
			try {
				offAmbient?.();
				offAmbient = null;
				offAmbient = await streamAmbientTemp(
					(v) => (ambientTemp = v),
					(available) => (ambientAvailable = available)
				);
			} catch {
				/* preview only */
			}
		}
		void subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => {
			offCpu?.();
			offAmbient?.();
			offReady();
		};
	});
</script>

<div class="flex flex-col items-center gap-4">
	<LedMatrix {bits} size={220} {color} />
	<p class="font-display text-3xl font-extrabold text-night-ink">{Math.round(temp * 10) / 10}°C — {label}</p>
	<input type="range" min="10" max="40" bind:value={cpuTemp} disabled={ambientAvailable} class="w-56" />

	{#if ambientAvailable}
		<div class="rounded-2xl bg-(--color-leaf-green)/10 px-4 py-2 text-center text-sm">
			<p class="font-bold text-(--color-leaf-deep)">✓ Using the real Grove Temperature Sensor</p>
			<p class="text-xs text-(--color-night-soft)">
				The chip's own guess right now is {cpuTemp}°C — see how close it gets?
			</p>
		</div>
	{:else}
		<div class="max-w-xs rounded-2xl bg-(--color-mist) px-4 py-2 text-center text-sm text-(--color-night-soft)">
			<p>Connect your duck for real readings, or drag the slider for a preview.</p>
			<p class="mt-1 text-xs">
				💡 Have a Grove Temperature Sensor? Clip it to pin 1 — Ducky will automatically use it instead of guessing from its own CPU.
			</p>
		</div>
	{/if}
</div>
