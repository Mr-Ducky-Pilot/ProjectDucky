<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';

	let x = $state(2);
	let y = $state(2);
	let ax = $state(0);
	let ay = $state(0);

	$effect(() => {
		const id = setInterval(() => {
			const dx = Math.max(-1, Math.min(1, Math.round(ax * 3)));
			const dy = Math.max(-1, Math.min(1, Math.round(ay * 3)));
			x = Math.max(0, Math.min(4, x + dx));
			y = Math.max(0, Math.min(4, y + dy));
		}, 220);
		return () => clearInterval(id);
	});

	const bits = $derived(
		Array.from({ length: 25 }, (_, i) => {
			const cx = i % 5;
			const cy = Math.floor(i / 5);
			return cx === x && cy === y;
		})
	);

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = await connection.streamSensor('accel', ([gx, gy]) => {
					ax = gx;
					ay = gy;
				});
			} catch {
				/* no board, allow mouse-driven drift */
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
	<div class="flex gap-2">
		<button class="rounded bg-mist px-3 py-1" onclick={() => (x = Math.max(0, x - 1))}>←</button>
		<button class="rounded bg-mist px-3 py-1" onclick={() => (y = Math.max(0, y - 1))}>↑</button>
		<button class="rounded bg-mist px-3 py-1" onclick={() => (y = Math.min(4, y + 1))}>↓</button>
		<button class="rounded bg-mist px-3 py-1" onclick={() => (x = Math.min(4, x + 1))}>→</button>
	</div>
</div>
