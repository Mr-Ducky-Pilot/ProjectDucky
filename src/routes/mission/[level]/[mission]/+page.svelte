<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import ConceptCard from '$lib/components/ConceptCard.svelte';
	import FlashButton from '$lib/components/FlashButton.svelte';
	import CodeCard from '$lib/components/CodeCard.svelte';
	import { markVisited, markCompleted } from '$lib/stores/progress';
	import { setMood } from '$lib/stores/ducky';
	import { connection } from '$lib/stores/connection';
	import type { Component } from 'svelte';

	let { data } = $props();
	const mission = $derived(data.mission);
	const nextMission = $derived(data.nextMission);
	const prevMission = $derived(data.prevMission);

	let Interactive = $state<Component | null>(null);

	$effect(() => {
		setMood('curious');
		markVisited(mission.level, mission.id);
		if (mission.interactive) {
			void mission.interactive().then((m) => (Interactive = m.default));
		} else {
			Interactive = null;
		}
		// Stop the active preset when navigating to a new mission
		return () => {
			void connection.send({ type: 'quit' }).catch(() => {});
		};
	});

	// Board button B = next mission, A = previous mission
	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type !== 'button' || e.phase !== 'down') return;
			if (e.button === 'B' && data.nextMission) {
				const m = data.nextMission;
				void goto(`/mission/${m.level}/${m.id}`);
			}
			if (e.button === 'A' && data.prevMission) {
				const m = data.prevMission;
				void goto(`/mission/${m.level}/${m.id}`);
			}
		});
		return off;
	});

	function complete() {
		markCompleted(mission.level, mission.id);
	}
</script>

<section class="px-5 py-6 sm:py-10">
	<div class="mx-auto max-w-5xl">
		<div class="flex items-center gap-4">
			<a
				href="/level/{mission.level}"
				class="text-sm font-bold text-(--color-pond-deep) no-underline hover:underline"
			>
				← Level {mission.level}
			</a>
			{#if prevMission}
				<a
					href="/mission/{prevMission.level}/{prevMission.id}"
					class="text-sm text-(--color-night-soft) no-underline hover:text-(--color-pond-deep)"
					title={prevMission.title}
				>
					‹ {prevMission.emoji}
				</a>
			{/if}
			{#if nextMission}
				<a
					href="/mission/{nextMission.level}/{nextMission.id}"
					class="text-sm text-(--color-night-soft) no-underline hover:text-(--color-pond-deep)"
					title={nextMission.title}
				>
					{nextMission.emoji} ›
				</a>
			{/if}
		</div>

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
						<span class="rounded-full bg-(--color-pond-blue)/15 px-2 py-1 text-(--color-pond-deep)">
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

		<!-- Main content + concept sidebar -->
		<div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
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
					<div
						class="rounded-2xl bg-(--color-mist) p-5 text-center text-sm text-(--color-night-soft)"
					>
						No interactive companion for this mission — just play with the kit and tap below when
						you're done.
					</div>
				{/if}

				<div class="flex flex-wrap items-center gap-3">
					{#if mission.preset}
						<FlashButton preset={mission.preset} onFlashed={complete} />
					{:else if mission.level === 1}
						<FlashButton label="Start Ducky" flashedLabel="Ducky is ready!" />
					{/if}
					{#if nextMission}
						<a
							href="/mission/{nextMission.level}/{nextMission.id}"
							onclick={complete}
							class="pop-btn pop-btn--ghost no-underline"
						>
							Next: {nextMission.title} →
						</a>
					{:else}
						<button type="button" onclick={complete} class="pop-btn pop-btn--ghost">
							Done ✓
						</button>
					{/if}
				</div>

				{#if mission.remixPrompts && mission.remixPrompts.length > 0}
					<div class="rounded-2xl bg-(--color-pond-blue)/10 p-4">
						<div
							class="mb-1 text-xs font-extrabold tracking-widest text-(--color-pond-deep) uppercase"
						>
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

		{#if mission.codeMarkdown}
			<div class="mt-6">
				<div class="mb-3 flex items-center gap-2">
					<span class="text-lg">🔍</span>
					<h2 class="font-display text-xl font-extrabold">How it works</h2>
				</div>
				<CodeCard markdown={mission.codeMarkdown} />
			</div>
		{/if}
	</div>
</section>
