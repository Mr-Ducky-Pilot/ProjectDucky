<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	let ax = $state(0);
	let ay = $state(0);

	const bx = $derived(2 - Math.max(-2, Math.min(2, Math.round(ax * 3))));
	const by = $derived(2 - Math.max(-2, Math.min(2, Math.round(ay * 3))));
	const bits = $derived(
		Array.from({ length: 25 }, (_, i) => i === by * 5 + bx)
	);

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = await connection.streamSensor('accel', ([x, y]) => {
					ax = x;
					ay = y;
				});
			} catch {
				/* not connected */
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
	<LedMatrix {bits} size={220} color="#4cc1ff" />
	<p class="max-w-xs text-center text-sm text-(--color-night-soft)">
		Tilt your duck. The bubble drifts the opposite way — exactly like a real spirit level.
	</p>
</div>
