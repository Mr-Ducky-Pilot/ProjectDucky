<script lang="ts">
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
	<!-- Center spine: left edge of the badge column on mobile, dead center at md+ -->
	<div
		class="absolute top-4 bottom-4 left-8 w-0.5 -translate-x-1/2 md:left-1/2"
		style="background-image: linear-gradient(to bottom, rgb(31 35 51 / 0.14) 0 10px, transparent 10px 18px); background-size: 2px 18px;"
		aria-hidden="true"
	></div>

	<ol class="relative flex flex-col gap-10 md:gap-6">
		{#each LEVELS as level, i}
			<li class="relative">
				<JourneyEgg
					emoji={level.emoji}
					title={level.title}
					tagline={level.tagline}
					philosophy={level.philosophy}
					color={level.color}
					href={level.available ? `/level/${level.id}` : '/journey'}
					locked={!level.available}
					index={i}
					align={i % 2 === 0 ? 'right' : 'left'}
					done={completedPerLevel[level.id] ?? 0}
					total={totalsPerLevel[level.id] ?? 0}
				/>
			</li>
		{/each}
	</ol>

	{#if showDuck}
		<div
			class="pointer-events-none absolute left-8 z-20 transition-all duration-700 ease-out md:left-1/2"
			style="top: calc({(duckPosition / Math.max(LEVELS.length - 1, 1)) * 100}% - 40px); transform: translateX(calc(-50% + 2.75rem));"
			aria-hidden="true"
		>
			<PetAvatar mood="excited" size={64} />
		</div>
	{/if}
</div>
