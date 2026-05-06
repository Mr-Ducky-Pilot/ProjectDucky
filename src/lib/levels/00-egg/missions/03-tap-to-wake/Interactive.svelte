<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let bits = $state<boolean[]>(Array(25).fill(false));
	let hits = $state(0);

	const FRAMES = [
		'0000000000001000000000000',
		'0000000111001110011100000',
		'0111011111111111111110111',
		'1111111111111111111111111'
	].map((s) => s.split('').map((c) => c === '1'));

	function ripple() {
		hits++;
		let i = 0;
		bits = FRAMES[0];
		const id = setInterval(() => {
			i++;
			if (i >= FRAMES.length) {
				clearInterval(id);
				bits = Array(25).fill(false);
			} else {
				bits = FRAMES[i];
			}
		}, 90);
	}

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type === 'button' && e.phase === 'down') ripple();
		});
		return off;
	});
</script>

<div class="flex flex-col items-center gap-5">
	<LedMatrix {bits} size={220} color="#4cc1ff" />

	<div class="flex gap-3">
		<button type="button" onclick={ripple} class="pop-btn pop-btn--blue size-16 rounded-full text-xl">
			A
		</button>
		<button type="button" onclick={ripple} class="pop-btn pop-btn--coral size-16 rounded-full text-xl">
			B
		</button>
	</div>
	<p class="text-sm text-(--color-night-soft)">Tap count: <strong>{hits}</strong></p>
</div>
