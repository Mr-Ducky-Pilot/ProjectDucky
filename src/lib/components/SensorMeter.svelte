<script lang="ts">
	type Props = {
		value: number;
		min?: number;
		max?: number;
		label: string;
		unit?: string;
		color?: string;
	};

	let { value, min = 0, max = 100, label, unit = '', color = '#4cc1ff' }: Props = $props();

	const pct = $derived(Math.max(0, Math.min(1, (value - min) / (max - min))) * 100);
</script>

<div class="card flex w-full flex-col gap-2 rounded-2xl p-4">
	<div class="flex items-baseline justify-between">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			{label}
		</span>
		<span class="font-mono text-lg font-bold tabular-nums">
			{value.toFixed(1)}{unit}
		</span>
	</div>
	<div class="h-3 w-full overflow-hidden rounded-full bg-(--color-mist)">
		<div
			class="h-full rounded-full transition-[width] duration-100"
			style="width: {pct}%; background: {color};"
		></div>
	</div>
</div>
