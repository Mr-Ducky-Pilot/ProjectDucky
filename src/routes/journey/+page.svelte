<script lang="ts">
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import JourneyPath from '$lib/components/JourneyPath.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import { pet, isNamed } from '$lib/stores/pet';
	import { DIMENSION_LABEL, DIMENSION_COLOR, DIMENSION_EMOJI, type Dimension } from '$lib/missions/types';
	import { ALL_MISSIONS } from '$lib/missions/registry';
	import { progress } from '$lib/stores/progress';
	import dialogue from '$lib/data/dialogue.json';

	const dims: Dimension[] = ['art', 'music', 'science', 'wellbeing', 'movement', 'story', 'pet', 'mechanics'];

	const dimensionCounts = $derived.by(() => {
		const out: Record<Dimension, { total: number; done: number }> = Object.fromEntries(
			dims.map((d) => [d, { total: 0, done: 0 }])
		) as Record<Dimension, { total: number; done: number }>;
		for (const m of ALL_MISSIONS) {
			const d = (m.dimension ?? 'mechanics') as Dimension;
			out[d].total += 1;
			if ($progress.completed.includes(`${m.level}/${m.id}`)) out[d].done += 1;
		}
		return out;
	});
</script>

<section class="px-5 py-8 sm:py-12">
	<div class="mx-auto max-w-5xl">
		<div class="mx-auto max-w-3xl">
			<header class="flex items-end justify-between gap-4 sm:items-center">
				<div>
					<h1 class="text-3xl sm:text-4xl">The Journey</h1>
					<p class="mt-1 text-(--color-night-soft)">Six little eggs. Pick whichever feels fun.</p>
				</div>
				<div class="hidden sm:block">
					<SpeechBubble text={dialogue['journey.welcome']} typing={false} side="right" tone="hint" />
				</div>
			</header>

			<!-- Pet introduction card -->
			<a
				href="/pet"
				class="mt-6 flex items-center gap-4 rounded-3xl bg-egg-cream p-4 shadow-soft transition hover:-translate-y-0.5 hover:bg-white"
			>
				<PetAvatar size={84} mood={isNamed($pet) ? 'excited' : 'curious'} />
				<div>
					{#if isNamed($pet)}
						<p class="text-xs font-bold uppercase tracking-widest text-(--color-night-soft)">Your duck</p>
						<p class="font-display text-xl font-extrabold text-night-ink">{$pet.name}</p>
						<p class="text-sm text-(--color-night-soft)">
							{$pet.friends.length} friend{$pet.friends.length === 1 ? '' : 's'} ·
							{$pet.unlocks.levelsCompleted.length} level{$pet.unlocks.levelsCompleted.length === 1 ? '' : 's'} done
						</p>
					{:else}
						<p class="text-xs font-bold uppercase tracking-widest text-(--color-night-soft)">No name yet</p>
						<p class="font-display text-xl font-extrabold text-night-ink">Adopt your duck →</p>
						<p class="text-sm text-(--color-night-soft)">Reach Level 3 to name it.</p>
					{/if}
				</div>
			</a>
		</div>

		<div class="mt-10">
			<JourneyPath />
		</div>

		<div class="mx-auto mt-12 max-w-3xl">
			<h2 class="mb-3 font-display text-lg font-bold text-night-ink">What have you explored?</h2>
			<div class="flex flex-wrap gap-2">
				{#each dims as d}
					{@const c = dimensionCounts[d]}
					<span
						class="rounded-full px-3 py-1.5 text-xs font-semibold"
						style="background: {DIMENSION_COLOR[d]}26; color: {DIMENSION_COLOR[d]};"
					>
						{DIMENSION_EMOJI[d]} {DIMENSION_LABEL[d]} · {c.done}/{c.total}
					</span>
				{/each}
			</div>
		</div>
	</div>
</section>
