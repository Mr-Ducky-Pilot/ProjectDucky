<script lang="ts">
	import type { Mission } from '$lib/missions/types';
	import { DIMENSION_COLOR, DIMENSION_LABEL, DIMENSION_EMOJI } from '$lib/missions/types';
	import { progress, isCompleted } from '$lib/stores/progress';

	type Props = {
		mission: Mission;
	};

	let { mission }: Props = $props();
	const done = $derived(isCompleted($progress, mission.level, mission.id));
	const dim = $derived(mission.dimension ?? 'mechanics');
</script>

<a
	href="/mission/{mission.level}/{mission.id}"
	class="card group flex h-full flex-col gap-3 rounded-3xl p-5 no-underline transition-transform hover:-translate-y-1"
>
	<div class="flex items-start justify-between gap-3">
		<div class="grid size-14 place-items-center rounded-2xl bg-(--color-egg-cream-2) text-3xl">
			{mission.emoji}
		</div>
		<div class="flex items-center gap-1.5 text-xs">
			<span class="rounded-full bg-(--color-mist) px-2 py-0.5 font-bold text-(--color-night-soft)">
				#{mission.order.toString().padStart(2, '0')}
			</span>
			<span
				class="rounded-full px-2 py-0.5 font-semibold"
				style="background: {DIMENSION_COLOR[dim]}26; color: {DIMENSION_COLOR[dim]};"
				title={DIMENSION_LABEL[dim]}
			>
				{DIMENSION_EMOJI[dim]}
			</span>
			{#if mission.pairMode}
				<span
					class="rounded-full bg-(--color-pond-blue)/15 px-2 py-0.5 font-bold text-(--color-pond-deep)"
				>
					Pair
				</span>
			{/if}
			{#if done}
				<span class="rounded-full bg-(--color-leaf-green)/20 px-2 py-0.5 font-bold text-(--color-leaf-deep)">
					✓ Done
				</span>
			{/if}
		</div>
	</div>
	<h3 class="font-display text-lg leading-tight">{mission.title}</h3>
	<p class="line-clamp-2 text-sm text-(--color-night-soft)">{mission.oneLiner}</p>
	<div class="mt-auto flex items-center justify-between text-xs text-(--color-night-soft)">
		<span>~{mission.estMinutes} min</span>
		<span class="font-bold text-(--color-pond-deep) group-hover:underline">Open →</span>
	</div>
</a>
