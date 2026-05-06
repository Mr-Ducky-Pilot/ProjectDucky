<script lang="ts">
	import Thermometer from '$lib/components/Thermometer.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let c = $state(22);

	onMount(() => {
		let off: (() => void) | null = null;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor('temp', ([nc]) => (c = nc));
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => { off?.(); offReady(); };
	});
</script>

<div class="flex flex-col items-center gap-4">
	<Thermometer {c} />
	<div class="max-w-xs rounded-2xl bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
		⚠️ This reads the <strong>chip's CPU temperature</strong>, not the air around you.
		Cup it tightly in both hands to warm the silicon!
	</div>
</div>
