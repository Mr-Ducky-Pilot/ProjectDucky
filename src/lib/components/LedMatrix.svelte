<script lang="ts">
	type Props = {
		bits: boolean[]; // 25 entries (5×5 row-major)
		size?: number; // total side length of the lit area (excl. padding)
		color?: string;
		glow?: boolean;
	};

	let { bits, size = 200, color = '#ffd23a', glow = true }: Props = $props();

	// Lay out as a 5x5 grid. Cell + gap math:
	//   gap   = cell * 0.18
	//   total = 5*cell + 4*gap = cell * (5 + 4*0.18) = cell * 5.72
	// So cell = size / 5.72 keeps the lit area equal to `size`.
	const cell = $derived(size / 5.72);
	const gap = $derived(cell * 0.18);
</script>

<div
	class="inline-grid w-fit max-w-full rounded-2xl bg-(--color-night-ink) p-3 shadow-[var(--shadow-soft)]"
	style="grid-template-columns: repeat(5, {cell}px); gap: {gap}px;"
	role="img"
	aria-label="5 by 5 LED matrix"
>
	{#each Array(25) as _, i}
		<div
			class="rounded-md transition-all duration-150"
			style="
				width: {cell}px;
				height: {cell}px;
				background: {bits[i] ? color : '#3a3f55'};
				box-shadow: {bits[i] && glow ? `0 0 ${cell * 0.5}px ${color}` : 'none'};
				opacity: {bits[i] ? 1 : 0.35};
			"
		></div>
	{/each}
</div>
