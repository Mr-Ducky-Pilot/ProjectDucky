<script lang="ts">
	type Props = {
		level: number; // 0..255
		bars?: number;
	};

	let { level, bars = 14 }: Props = $props();

	const lit = $derived(Math.round((level / 255) * bars));
	const palette = ['#7ad44b', '#7ad44b', '#7ad44b', '#7ad44b', '#7ad44b', '#7ad44b', '#7ad44b', '#7ad44b', '#ffd23a', '#ffd23a', '#ffd23a', '#ff7a6b', '#ff7a6b', '#e6463a'];
</script>

<div class="card flex w-full flex-col items-center gap-3 rounded-3xl p-5">
	<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
		Loudness
	</div>
	<div class="flex h-32 items-end gap-1">
		{#each Array(bars) as _, i}
			<div
				class="w-3 rounded-sm transition-all"
				style="
					height: {((i + 1) / bars) * 100}%;
					background: {i < lit ? (palette[i] ?? '#7ad44b') : '#eef0f5'};
					opacity: {i < lit ? 1 : 0.6};
				"
			></div>
		{/each}
	</div>
	<div class="font-mono text-sm tabular-nums text-(--color-night-soft)">
		{level.toFixed(0)} / 255
	</div>
</div>
