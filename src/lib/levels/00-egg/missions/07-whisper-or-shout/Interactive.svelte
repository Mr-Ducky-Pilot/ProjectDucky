<script lang="ts">
	import VolumeMeter from '$lib/components/VolumeMeter.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let level = $state(50);

	onMount(() => {
		let off: (() => void) | null = null;
		connection.streamSensor('mic', ([v]) => (level = v)).then((u) => {
			off = u;
		});
		return () => off?.();
	});

	// Mirror as a 5-row matrix bargraph
	const bars = $derived(Math.round((level / 255) * 5));
	const matrixBits = $derived.by(() => {
		const arr = Array<boolean>(25).fill(false);
		for (let r = 0; r < bars; r++) {
			const row = 4 - r;
			for (let c = 0; c < 5; c++) arr[row * 5 + c] = true;
		}
		return arr;
	});
</script>

<div class="grid items-stretch gap-5 sm:grid-cols-2">
	<div class="flex min-w-0 justify-center">
		<VolumeMeter {level} />
	</div>
	<div class="flex min-w-0 items-center justify-center">
		<LedMatrix bits={matrixBits} size={180} color="#7ad44b" />
	</div>
</div>
