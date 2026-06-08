<script lang="ts">
	import MissionCard from '$lib/components/MissionCard.svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import FlashButton from '$lib/components/FlashButton.svelte';
	import { connection } from '$lib/stores/connection';
	import dialogue from '$lib/data/dialogue.json';

	let { data } = $props();
	const conn = connection;

	const intro = $derived(
		(dialogue as Record<string, string>)[`level.${data.level.id}.intro`] ??
			"Pick anything. There's no order."
	);

	const isDuckyLevel = $derived(data.level.id === 0 || data.level.id === 1);
	const duckyReady = $derived($conn.lastFlashedFirmware === 'ducky-os' && $conn.status === 'connected');

	async function handleFlashed() {
		if (data.level.id === 1) {
			try {
				await connection.send({ type: 'oled-text', lines: ['Level 1 - Hatch', 'Pick a mission!'] });
			} catch {
				// non-fatal: OLED might not be connected
			}
		}
	}
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
							✅ Ducky is ready — pick a mission!
						</p>
						<p class="mt-1 text-sm text-(--color-night-soft)">
							Switching missions is instant — no re-flashing needed.
							Ducky also works standalone: use A/B to browse activities, tap the logo to activate.
						</p>
					{:else}
						<p class="font-display font-extrabold text-(--color-night-ink)">
							Flash Ducky once to get started
						</p>
						<p class="mt-1 text-sm text-(--color-night-soft)">
							One flash loads all {data.level.id === 0 ? 'Level 0' : 'Level 1'} activities.
							After that, switching missions is instant. Ducky also works standalone without the computer.
						</p>
					{/if}
				</div>
				{#if !duckyReady}
					<div class="shrink-0">
						<FlashButton label="Flash Ducky" flashedLabel="Ducky is ready!" onFlashed={handleFlashed} />
					</div>
				{/if}
			</div>
		{/if}

		{#if data.missions.length === 0}
			<p class="mt-10 text-center text-(--color-night-soft)">No missions yet — coming soon!</p>
		{:else}
			<div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.missions as mission (mission.id)}
					<MissionCard {mission} />
				{/each}
			</div>
		{/if}
	</div>
</section>
