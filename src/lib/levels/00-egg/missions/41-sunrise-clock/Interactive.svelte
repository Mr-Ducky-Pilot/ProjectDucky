<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	let light = $state(80);
	const lit = $derived(Math.max(0, Math.min(5, Math.floor(light / 50))));
	const bits = $derived(
		Array.from({ length: 25 }, (_, i) => 4 - Math.floor(i / 5) < lit)
	);

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = await connection.streamSensor('light', ([v]) => (light = v));
			} catch {
				/* not connected; show preview only */
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
	<LedMatrix {bits} size={220} color="#ffd23a" />
	<div class="flex items-center gap-3 text-sm text-(--color-night-soft)">
		<span>🌑 dark</span>
		<input type="range" min="0" max="255" bind:value={light} class="w-40" />
		<span>☀️ bright</span>
	</div>
	<p class="max-w-xs text-center text-sm text-(--color-night-soft)">
		Drag for a preview, or hold your hand over the chip to control it for real.
	</p>
</div>
