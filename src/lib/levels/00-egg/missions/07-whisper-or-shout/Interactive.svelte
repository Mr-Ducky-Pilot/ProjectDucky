<script lang="ts">
	import VolumeMeter from '$lib/components/VolumeMeter.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let level = $state(0);
	let hasData = $state(false);

	onMount(() => {
		let off: (() => void) | null = null;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor('mic', ([v]) => {
					level = v;
					hasData = true;
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => { off?.(); offReady(); };
	});

	// Mirror as a 5-row bargraph on the virtual matrix
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

<div class="flex flex-col gap-4">
	<div class="grid items-stretch gap-5 sm:grid-cols-2">
		<div class="flex min-w-0 justify-center">
			<VolumeMeter {level} />
		</div>
		<div class="flex min-w-0 flex-col items-center justify-center gap-2">
			<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Board LEDs mirror this
			</p>
			<LedMatrix bits={matrixBits} size={180} color="#7ad44b" />
		</div>
	</div>

	{#if !hasData}
		<p class="text-center text-xs text-(--color-night-soft)">
			Flash Ducky first — then the bars will react to your voice in real time.
		</p>
	{:else}
		<p class="text-center text-xs text-(--color-night-soft)">
			Try: whisper → clap → shout. Watch both the bars and the real LEDs react!
		</p>
	{/if}
</div>
