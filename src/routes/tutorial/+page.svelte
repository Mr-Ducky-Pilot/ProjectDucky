<script lang="ts">
	import { TUTORIAL_STOPS, tutorialKey } from '$lib/data/tutorial';
	import { getMission } from '$lib/missions/registry';
	import { progress, isCompleted } from '$lib/stores/progress';
	import { DIMENSION_COLOR, DIMENSION_EMOJI } from '$lib/missions/types';

	const stops = TUTORIAL_STOPS.map((s) => getMission(s.level, s.id)).filter((m) => !!m);

	const doneCount = $derived(
		stops.filter((m) => isCompleted($progress, m.level, m.id)).length
	);

	const firstUnfinished = $derived.by(() => {
		const idx = stops.findIndex((m) => !isCompleted($progress, m.level, m.id));
		return idx >= 0 ? stops[idx] : stops[0];
	});
</script>

<section class="px-5 py-8 sm:py-12">
	<div class="mx-auto max-w-2xl">
		<header>
			<span class="rounded-full bg-(--color-duck-yellow)/25 px-3 py-1 text-xs font-bold text-(--color-night-ink)">
				⚡ ~20 minutes · one duck · no pairing
			</span>
			<h1 class="mt-3 text-3xl sm:text-4xl">Quick Tour</h1>
			<p class="mt-2 text-(--color-night-soft)">
				15 hand-picked stops across every level — touch, sound, motion, a game, your pet, and a
				peek at real code. The fastest way to see what Ducky can do.
			</p>
		</header>

		<div class="mt-6 flex items-center gap-4">
			<a href="/mission/{firstUnfinished.level}/{firstUnfinished.id}?tutorial=1" class="pop-btn pop-btn--yellow no-underline">
				{doneCount === 0 ? 'Start the tour →' : doneCount < stops.length ? 'Continue the tour →' : 'Replay the tour →'}
			</a>
			<span class="text-sm font-bold text-(--color-night-soft)">{doneCount}/{stops.length} done</span>
		</div>

		<ol class="mt-8 flex flex-col gap-3">
			{#each stops as mission, i}
				{@const done = isCompleted($progress, mission.level, mission.id)}
				{@const dim = mission.dimension ?? 'mechanics'}
				<li>
					<a
						href="/mission/{mission.level}/{mission.id}?tutorial=1"
						class="card group flex items-center gap-4 rounded-2xl p-4 no-underline transition-transform hover:-translate-y-0.5"
					>
						<span
							class="grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold"
							class:bg-(--color-leaf-green)={done}
							class:text-white={done}
							class:bg-(--color-mist)={!done}
							class:text-(--color-night-soft)={!done}
						>
							{done ? '✓' : i + 1}
						</span>
						<span class="grid size-11 shrink-0 place-items-center rounded-xl bg-(--color-egg-cream-2) text-2xl">
							{mission.emoji}
						</span>
						<span class="min-w-0 flex-1">
							<span class="flex items-center gap-2">
								<span class="font-display font-bold text-night-ink">{mission.title}</span>
								<span
									class="rounded-full px-2 py-0.5 text-[10px] font-bold"
									style="background: {DIMENSION_COLOR[dim]}26; color: {DIMENSION_COLOR[dim]};"
								>
									{DIMENSION_EMOJI[dim]} L{mission.level}
								</span>
							</span>
							<span class="block truncate text-sm text-(--color-night-soft)">{mission.oneLiner}</span>
						</span>
						<span class="shrink-0 text-xs text-(--color-night-soft)">~{mission.estMinutes}m</span>
					</a>
				</li>
			{/each}
		</ol>

		<p class="mt-8 text-center text-sm text-(--color-night-soft)">
			Want the whole curriculum? <a href="/journey" class="font-bold text-(--color-pond-deep) hover:underline">See all 6 levels →</a>
		</p>
	</div>
</section>
