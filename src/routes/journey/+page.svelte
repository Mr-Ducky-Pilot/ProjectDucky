<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import JourneyEgg from '$lib/components/JourneyEgg.svelte';
	import { LEVELS } from '$lib/data/journey';
	import dialogue from '$lib/data/dialogue.json';
</script>

<section class="px-5 py-8 sm:py-12">
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

		<div class="mt-8 flex flex-col gap-4">
			{#each LEVELS as level, i}
				<JourneyEgg
					emoji={level.emoji}
					title={level.title}
					blurb={level.tagline}
					color={level.color}
					href={level.available ? `/level/${level.id}` : '/journey'}
					locked={!level.available}
					index={i}
				/>
			{/each}
		</div>

		<div class="mt-12 flex justify-center">
			<Ducky mood="curious" size={120} />
		</div>
	</div>
</section>
