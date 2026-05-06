<script lang="ts">
	import Thermometer from '$lib/components/Thermometer.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let c = $state(22);

	onMount(() => {
		let off: (() => void) | null = null;
		connection.streamSensor('temp', ([nc]) => (c = nc)).then((u) => {
			off = u;
		});
		return () => off?.();
	});
</script>

<div class="flex justify-center">
	<Thermometer {c} />
</div>
