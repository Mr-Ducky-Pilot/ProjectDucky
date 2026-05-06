<script lang="ts">
	type Props = {
		c: number;
		min?: number;
		max?: number;
	};

	let { c, min = 10, max = 40 }: Props = $props();

	const pct = $derived(Math.max(0, Math.min(1, (c - min) / (max - min))));
	const color = $derived(c < 18 ? '#4cc1ff' : c > 30 ? '#ff7a6b' : '#ffd23a');
</script>

<div class="card flex items-center gap-4 rounded-3xl p-5">
	<div class="relative flex h-44 w-8 flex-col-reverse overflow-hidden rounded-full bg-(--color-mist)">
		<div
			class="w-full rounded-full transition-all duration-300"
			style="height: {pct * 100}%; background: {color};"
		></div>
		<div
			class="absolute -bottom-3 left-1/2 size-10 -translate-x-1/2 rounded-full"
			style="background: {color};"
		></div>
	</div>
	<div>
		<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Temperature
		</div>
		<div class="font-mono text-3xl font-extrabold tabular-nums">{c.toFixed(1)}°C</div>
		<div class="mt-1 text-sm text-(--color-night-soft)">
			{#if c < 18}Brrr — chilly{:else if c > 30}Toasty!{:else}Just right{/if}
		</div>
	</div>
</div>
