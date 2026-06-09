<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	let temp = $state(21);

	const lit = $derived(Math.max(0, Math.min(5, Math.floor((temp - 18) / 3) + 1)));
	const bits = $derived(Array.from({ length: 25 }, (_, i) => 4 - Math.floor(i / 5) < lit));
	const label = $derived(temp < 22 ? 'cool' : temp < 28 ? 'warm' : 'hot!');
	const color = $derived(temp < 22 ? '#4cc1ff' : temp < 28 ? '#ffd23a' : '#ff7a6b');

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = await connection.streamSensor('temp', ([v]) => (temp = v));
			} catch {
				/* preview only */
			}
		}
		void subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => {
			off?.();
			offReady();
		};
	});
</script>

<div class="flex flex-col items-center gap-4">
	<LedMatrix {bits} size={220} {color} />
	<p class="font-display text-3xl font-extrabold text-night-ink">{temp}°C — {label}</p>
	<input type="range" min="10" max="40" bind:value={temp} class="w-56" />
	<p class="max-w-xs text-center text-sm text-(--color-night-soft)">
		Connect your duck for real readings, or drag the slider for a preview.
	</p>
</div>
