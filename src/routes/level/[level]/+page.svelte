<script lang="ts">
	import MissionCard from '$lib/components/MissionCard.svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import FlashButton from '$lib/components/FlashButton.svelte';
	import LevelComplete from '$lib/components/LevelComplete.svelte';
	import { connection } from '$lib/stores/connection';
	import { progress, isCompleted } from '$lib/stores/progress';
	import { pet, petLabel, markLevelCompleted } from '$lib/stores/pet';
	import { goto } from '$app/navigation';
	import dialogue from '$lib/data/dialogue.json';
	import {
		DIMENSION_COLOR,
		DIMENSION_LABEL,
		DIMENSION_EMOJI,
		type Dimension
	} from '$lib/missions/types';

	let { data } = $props();
	const conn = connection;

	let activeFilter = $state<Dimension | null>(null);
	let showComplete = $state(false);
	let firedComplete = false;

	const availableDimensions = $derived.by(() => {
		const s = new Set<Dimension>();
		for (const m of data.missions) s.add((m.dimension ?? 'mechanics') as Dimension);
		return [...s];
	});

	const filteredMissions = $derived(
		activeFilter
			? data.missions.filter((m) => (m.dimension ?? 'mechanics') === activeFilter)
			: data.missions
	);

	const nextIncomplete = $derived(
		data.missions.find((m) => !isCompleted($progress, m.level, m.id))
	);

	$effect(() => {
		if (data.missions.length === 0) return;
		const allDone = data.missions.every((m) => isCompleted($progress, m.level, m.id));
		if (allDone && !firedComplete) {
			firedComplete = true;
			markLevelCompleted(data.level.id);
			showComplete = true;
		}
	});

	const intro = $derived(
		(dialogue as Record<string, string>)[`level.${data.level.id}.intro`] ??
			"Pick anything. There's no order."
	);

	const isDuckyLevel = $derived(data.level.id === 0 || data.level.id === 1);
	// L1 shares one hex — ready once 'l1' is flashed. L0 has per-preset firmware; just check connected.
	const duckyReady = $derived(
		$conn.status === 'connected' &&
		(data.level.id === 1
			? $conn.lastFlashedFirmware === 'l1'
			: $conn.lastFlashedFirmware !== null)
	);

</script>

<section class="px-5 py-8 sm:py-12">
	<div class="mx-auto max-w-5xl">
		<a href="/journey" class="text-sm font-bold text-(--color-pond-deep) no-underline hover:underline">
			← Back to journey
		</a>

		<header
			class="mt-3 flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:p-8"
			style="background: {data.level.color};"
		>
			<div
				class="grid size-20 shrink-0 place-items-center rounded-full bg-white text-4xl shadow-[var(--shadow-soft)]"
			>
				{data.level.emoji}
			</div>
			<div class="flex-1">
				<span class="text-xs font-extrabold tracking-widest text-(--color-night-soft) uppercase">
					Level {data.level.id}
				</span>
				<h1 class="text-3xl sm:text-4xl">{data.level.title}</h1>
				<p class="mt-1 text-(--color-night-soft)">{data.level.blurb}</p>
			</div>
		</header>

		<div class="mt-6 flex items-center gap-3">
			<Ducky mood="excited" size={72} />
			<SpeechBubble text={intro} typing={false} side="left" tone="cheer" />
		</div>

		{#if isDuckyLevel}
			<div
				class="mt-6 flex flex-col gap-3 rounded-2xl border-2 p-5 sm:flex-row sm:items-center sm:gap-5"
				style={duckyReady
					? 'border-color: color-mix(in srgb, var(--color-leaf-green) 60%, transparent); background: color-mix(in srgb, var(--color-leaf-green) 5%, transparent);'
					: 'border-color: color-mix(in srgb, var(--color-duck-yellow) 50%, transparent); background: color-mix(in srgb, var(--color-duck-yellow) 5%, transparent);'}
			>
				<div class="flex-1">
					{#if duckyReady}
						<p class="font-display font-extrabold" style="color: var(--color-leaf-deep)">
							✅ {$petLabel} is connected — pick a mission!
						</p>
						<p class="mt-1 text-sm text-(--color-night-soft)">
							{#if data.level.id === 1}
								Switching missions is instant — no re-flashing needed.
							{:else}
								Each mission flashes its own activity. Revisiting the same mission is instant.
							{/if}
						</p>
					{:else}
						<p class="font-display font-extrabold text-(--color-night-ink)">
							{#if data.level.id === 1}
								Flash {$petLabel} once to get started
							{:else}
								Connect {$petLabel} to get started
							{/if}
						</p>
						<p class="mt-1 text-sm text-(--color-night-soft)">
							{#if data.level.id === 1}
								One flash loads all Level 1 activities. After that, switching missions is instant.
							{:else}
								Pick any mission — it will flash {$petLabel} with that activity automatically.
							{/if}
						</p>
					{/if}
				</div>
				{#if !duckyReady}
					<div class="shrink-0">
						{#if data.level.id === 1}
							<FlashButton label="Flash {$petLabel}" flashedLabel="{$petLabel} is ready!" />
						{:else}
							<button
								type="button"
								onclick={() => connection.connect()}
								class="pop-btn pop-btn--yellow"
							>
								Connect {$petLabel}
							</button>
						{/if}
					</div>
				{/if}
			</div>
		{/if}

		{#if nextIncomplete}
			<a
				href="/mission/{nextIncomplete.level}/{nextIncomplete.id}"
				class="mt-6 flex items-center gap-3 rounded-2xl bg-night-ink p-4 text-white shadow-soft transition hover:-translate-y-0.5"
			>
				<span class="text-2xl">{nextIncomplete.emoji}</span>
				<div class="flex-1">
					<p class="text-[11px] font-bold uppercase tracking-wider text-duck-yellow">Up next</p>
					<p class="font-display font-extrabold">{nextIncomplete.title}</p>
				</div>
				<span class="font-display font-extrabold">→</span>
			</a>
		{/if}

		{#if data.missions.length === 0}
			<p class="mt-10 text-center text-(--color-night-soft)">No missions yet — coming soon!</p>
		{:else}
			{#if availableDimensions.length > 1}
				<div class="mt-6 flex flex-wrap items-center gap-2">
					<button
						class="rounded-full px-3 py-1.5 text-xs font-bold"
						class:bg-night-ink={activeFilter === null}
						class:text-white={activeFilter === null}
						class:bg-mist={activeFilter !== null}
						class:text-night-soft={activeFilter !== null}
						onclick={() => (activeFilter = null)}
					>
						All
					</button>
					{#each availableDimensions as d}
						<button
							class="rounded-full px-3 py-1.5 text-xs font-bold"
							style={activeFilter === d
								? `background: ${DIMENSION_COLOR[d]}; color: white;`
								: `background: ${DIMENSION_COLOR[d]}1f; color: ${DIMENSION_COLOR[d]};`}
							onclick={() => (activeFilter = activeFilter === d ? null : d)}
						>
							{DIMENSION_EMOJI[d]} {DIMENSION_LABEL[d]}
						</button>
					{/each}
				</div>
			{/if}

			<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredMissions as mission (mission.id)}
					<MissionCard {mission} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<LevelComplete
	level={data.level.id}
	bind:open={showComplete}
	onNext={() => goto(`/level/${data.level.id + 1}`)}
/>
