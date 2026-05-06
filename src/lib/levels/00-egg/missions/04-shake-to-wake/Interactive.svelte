<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let x = $state(0);
	let y = $state(0);
	let z = $state(0.95);

	onMount(() => {
		let off: (() => void) | null = null;
		connection
			.streamSensor('accel', ([nx, ny, nz]) => {
				x = nx;
				y = ny;
				z = nz;
			})
			.then((u) => {
				off = u;
			});
		return () => off?.();
	});

	const magnitude = $derived(Math.sqrt(x * x + y * y + z * z));
</script>

<div class="grid w-full gap-3 sm:grid-cols-2">
	<SensorMeter label="left/right" value={x} min={-2} max={2} unit="g" color="#4cc1ff" />
	<SensorMeter label="forward/back" value={y} min={-2} max={2} unit="g" color="#7ad44b" />
	<SensorMeter label="up/down" value={z} min={-2} max={2} unit="g" color="#ff7a6b" />
	<SensorMeter label="overall motion" value={magnitude} min={0} max={3} unit="g" color="#ffd23a" />
</div>
<p class="mt-3 text-center text-sm text-(--color-night-soft)">
	Your duck is sitting on the desk → up/down ≈ 1.0. Pick it up and shake!
</p>
