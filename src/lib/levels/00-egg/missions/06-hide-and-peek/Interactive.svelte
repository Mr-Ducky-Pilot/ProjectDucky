<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let lux = $state(140);

	onMount(() => {
		let off: (() => void) | null = null;
		connection.streamSensor('light', ([v]) => (lux = v)).then((u) => {
			off = u;
		});
		return () => off?.();
	});

	const mood = $derived(lux < 60 ? 'sleepy' : lux > 200 ? 'excited' : 'curious');
</script>

<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-6">
	<div class="flex flex-1 items-center justify-center rounded-3xl p-4"
		style="background: linear-gradient(180deg, hsl({Math.min(60, lux / 4)}, 80%, 92%), white);"
	>
		<Ducky {mood} size={140} />
	</div>
	<div class="flex flex-1 flex-col gap-3">
		<SensorMeter value={lux} min={0} max={255} label="Light level" color="#ffd23a" />
		<p class="text-sm text-(--color-night-soft)">
			{#if lux < 60}It's dark in there!{:else if lux > 200}Whoa, bright!{:else}Cosy ambient.{/if}
		</p>
	</div>
</div>
