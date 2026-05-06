<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	// BIG_HEART   = "01010:11111:11111:01110:00100"
	// SMALL_HEART = "00000:01110:01110:00100:00000"
	const BIG = '0101011111111110111000100'.split('').map((c) => c === '1');
	const SMALL = '0000001110011100010000000'.split('').map((c) => c === '1');

	let big = $state(true);
	$effect(() => {
		const id = setInterval(() => (big = !big), 600);
		return () => clearInterval(id);
	});
</script>

<div class="flex flex-col items-center gap-4">
	<LedMatrix bits={big ? BIG : SMALL} size={220} color="#ff7a6b" />
	<p class="max-w-xs text-center text-sm text-(--color-night-soft)">
		Place your hand on your chest. Feel your own heart. Now look at Ducky's.
		Whose is faster?
	</p>
</div>
