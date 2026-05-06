<script lang="ts">
	import { onMount } from 'svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import ConceptCard from '$lib/components/ConceptCard.svelte';
	import FlashButton from '$lib/components/FlashButton.svelte';
	import { markVisited, markCompleted } from '$lib/stores/progress';
	import { setMood } from '$lib/stores/ducky';
	import type { Component } from 'svelte';

	let { data } = $props();
	const mission = $derived(data.mission);

	let Interactive = $state<Component | null>(null);

	$effect(() => {
		setMood('curious');
		markVisited(mission.level, mission.id);
		if (mission.interactive) {
			void mission.interactive().then((m) => (Interactive = m.default));
		} else {
			Interactive = null;
		}
	});

	function complete() {
		markCompleted(mission.level, mission.id);
	}
</script>

<section class="px-5 py-6 sm:py-10">
	<div class="mx-auto max-w-5xl">
		<a
			href="/level/{mission.level}"
			class="text-sm font-bold text-(--color-pond-deep) no-underline hover:underline"
		>
			← Back to level {mission.level}
		</a>

		<header class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
			<div
				class="grid size-20 shrink-0 place-items-center rounded-3xl bg-white text-4xl shadow-[var(--shadow-soft)]"
			>
				{mission.emoji}
			</div>
			<div class="flex-1">
				<div class="flex flex-wrap items-center gap-2 text-xs font-bold">
					<span class="rounded-full bg-(--color-mist) px-2 py-1 text-(--color-night-soft)">
						Level {mission.level} · #{mission.order.toString().padStart(2, '0')}
					</span>
					<span class="rounded-full bg-(--color-egg-cream-2) px-2 py-1 text-(--color-night-soft)">
						~{mission.estMinutes} min
					</span>
					{#if mission.pairMode}
						<span
							class="rounded-full bg-(--color-pond-blue)/15 px-2 py-1 text-(--color-pond-deep)"
						>
							Two ducks
						</span>
					{/if}
					{#each mission.hardware as h}
						<span class="rounded-full bg-white px-2 py-1 text-(--color-night-soft)">{h}</span>
					{/each}
				</div>
				<h1 class="mt-3 text-3xl sm:text-4xl">{mission.title}</h1>
				<p class="mt-2 max-w-2xl text-(--color-night-soft) sm:text-lg">{mission.story}</p>
			</div>
		</header>

		<div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
			<div class="card flex min-w-0 flex-col gap-5 overflow-hidden rounded-3xl p-5 sm:p-7">
				<div class="flex items-start gap-3">
					<Ducky mood="excited" size={64} />
					<SpeechBubble text={mission.duckyIntro} typing={false} side="left" tone="cheer" />
				</div>

				{#if Interactive}
					{#key mission.id}
						<Interactive {complete} {mission} />
					{/key}
				{:else}
					<div class="rounded-2xl bg-(--color-mist) p-5 text-center text-sm text-(--color-night-soft)">
						No interactive companion for this mission — just play with the kit
						and tap below when you’re done.
					</div>
				{/if}

				<div class="flex flex-wrap items-center gap-3">
					{#if mission.hexPath}
						<FlashButton hexUrl={mission.hexPath} onFlashed={complete} />
					{/if}
					<button type="button" onclick={complete} class="pop-btn pop-btn--ghost">
						Mark done
					</button>
				</div>

				{#if mission.remixPrompts && mission.remixPrompts.length > 0}
					<div class="rounded-2xl bg-(--color-pond-blue)/10 p-4">
						<div class="mb-1 text-xs font-extrabold tracking-widest text-(--color-pond-deep) uppercase">
							Remix it
						</div>
						<ul class="space-y-1 text-sm text-(--color-night-soft)">
							{#each mission.remixPrompts as p}
								<li>· {p}</li>
							{/each}
							<li>· …or anything else you imagine.</li>
						</ul>
					</div>
				{/if}
			</div>

			<aside class="lg:sticky lg:top-20 lg:self-start">
				<ConceptCard markdown={mission.conceptMarkdown} />
			</aside>
		</div>
	</div>
</section>
