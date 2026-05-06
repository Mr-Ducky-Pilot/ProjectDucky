<script lang="ts">
	import CompassDial from '$lib/components/CompassDial.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let heading = $state(0);

	onMount(() => {
		let off: (() => void) | null = null;
		connection.streamSensor('compass', ([deg]) => (heading = deg)).then((u) => {
			off = u;
		});
		return () => off?.();
	});

	const direction = $derived.by(() => {
		const h = ((heading % 360) + 360) % 360;
		if (h < 22.5 || h >= 337.5) return 'North';
		if (h < 67.5) return 'North-East';
		if (h < 112.5) return 'East';
		if (h < 157.5) return 'South-East';
		if (h < 202.5) return 'South';
		if (h < 247.5) return 'South-West';
		if (h < 292.5) return 'West';
		return 'North-West';
	});
</script>

<div class="flex flex-col items-center gap-4">
	<CompassDial {heading} />
	<p class="font-display text-lg font-extrabold">Pointing: {direction}</p>
</div>
