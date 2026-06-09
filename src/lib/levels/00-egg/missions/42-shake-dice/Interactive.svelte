<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	const DICE = [
		'00000:00000:00100:00000:00000',
		'00000:01000:00000:00010:00000',
		'10000:00000:00100:00000:00001',
		'00000:10001:00000:10001:00000',
		'00000:10001:00100:10001:00000',
		'00000:10101:00000:10101:00000'
	];

	let face = $state(0);
	let history = $state<number[]>([]);

	function roll() {
		face = Math.floor(Math.random() * 6) + 1;
		history = [...history.slice(-19), face];
	}

	const bits = $derived(
		face ? DICE[face - 1].replace(/:/g, '').split('').map((c) => c === '1') : new Array(25).fill(false)
	);
	const tallies = $derived(
		[1, 2, 3, 4, 5, 6].map((n) => history.filter((h) => h === n).length)
	);
</script>

<div class="flex flex-col items-center gap-4">
	<LedMatrix {bits} size={220} color="#ffd23a" />
	<div class="font-display text-2xl font-extrabold text-night-ink">
		{face ? `You rolled ${face}` : 'Shake to roll'}
	</div>
	<button
		class="rounded-full bg-night-ink px-5 py-2 font-display text-sm font-bold text-white"
		onclick={roll}
	>
		Roll
	</button>
	{#if history.length > 0}
		<div class="flex gap-2 text-xs text-night-soft">
			{#each tallies as t, i}
				<span class="rounded-full bg-mist px-2 py-1">
					{i + 1}: <strong>{t}</strong>
				</span>
			{/each}
		</div>
	{/if}
</div>
