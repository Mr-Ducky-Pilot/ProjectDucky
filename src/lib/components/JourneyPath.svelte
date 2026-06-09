<script lang="ts">
	import { onMount } from 'svelte';
	import PetAvatar from './PetAvatar.svelte';
	import JourneyEgg from './JourneyEgg.svelte';
	import { LEVELS } from '$lib/data/journey';
	import { progress } from '$lib/stores/progress';
	import { ALL_MISSIONS } from '$lib/missions/registry';

	type Props = { showDuck?: boolean };
	let { showDuck = true }: Props = $props();

	const totalsPerLevel = $derived.by(() => {
		const totals: Record<number, number> = {};
		for (const m of ALL_MISSIONS) totals[m.level] = (totals[m.level] ?? 0) + 1;
		return totals;
	});

	const completedPerLevel = $derived.by(() => {
		const counts: Record<number, number> = {};
		for (const key of $progress.completed) {
			const lvl = parseInt(key.split('/')[0], 10);
			if (!Number.isNaN(lvl)) counts[lvl] = (counts[lvl] ?? 0) + 1;
		}
		return counts;
	});

	// Position of the walking duck: count completed eggs (a level is "passed"
	// only when all its missions are done), plus a partial bump for in-progress.
	const duckPosition = $derived.by(() => {
		let pos = 0;
		for (const l of LEVELS) {
			const total = totalsPerLevel[l.id] ?? 0;
			const done = completedPerLevel[l.id] ?? 0;
			if (total > 0 && done >= total) pos += 1;
			else if (total > 0) {
				pos += done / total;
				break;
			} else break;
		}
		return Math.min(pos, LEVELS.length - 0.01);
	});
</script>

<div class="relative">
	<!-- snaking SVG path behind the eggs -->
	<svg
		class="pointer-events-none absolute left-0 top-0 h-full w-full"
		viewBox="0 0 320 1080"
		preserveAspectRatio="none"
		aria-hidden="true"
	>
		<path
			d="M 60 30 C 200 90, 280 120, 220 180 S 50 280, 130 350 S 280 460, 200 540 S 40 660, 140 740 S 280 860, 180 940"
			fill="none"
			stroke="rgba(28,31,46,0.12)"
			stroke-width="6"
			stroke-linecap="round"
			stroke-dasharray="2 14"
		/>
	</svg>

	<ol class="relative flex flex-col gap-5">
		{#each LEVELS as level, i}
			<li class="relative">
				<JourneyEgg
					emoji={level.emoji}
					title={level.title}
					blurb={level.tagline}
					color={level.color}
					href={level.available ? `/level/${level.id}` : '/journey'}
					locked={!level.available}
					index={i}
				/>
				{#if totalsPerLevel[level.id]}
					<span
						class="absolute right-3 top-3 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold tracking-wide text-night-soft"
					>
						{completedPerLevel[level.id] ?? 0}/{totalsPerLevel[level.id]}
					</span>
				{/if}
			</li>
		{/each}
	</ol>

	{#if showDuck}
		<div
			class="pointer-events-none absolute -right-2 z-10 transition-all duration-700 ease-out"
			style="top: calc({(duckPosition / Math.max(LEVELS.length - 1, 1)) * 100}% - 40px);"
			aria-hidden="true"
		>
			<PetAvatar mood="excited" size={86} />
		</div>
	{/if}
</div>
