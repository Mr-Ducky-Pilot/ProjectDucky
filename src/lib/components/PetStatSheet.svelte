<script lang="ts">
	import PetAvatar from './PetAvatar.svelte';
	import { pet, isNamed } from '$lib/stores/pet';
	import { DIMENSION_LABEL, DIMENSION_COLOR, DIMENSION_EMOJI, type Dimension } from '$lib/missions/types';

	const dims: Dimension[] = ['art', 'music', 'science', 'wellbeing', 'movement', 'story', 'pet', 'mechanics'];

	const unlocked = $derived(dims.filter((d) => $pet.unlocks.dimensions[d]));
	const statCount = $derived(Object.keys($pet.stats).length);
</script>

<div class="grid gap-6 md:grid-cols-[auto_1fr]">
	<div class="flex flex-col items-center rounded-3xl bg-egg-cream p-6 shadow-soft">
		<PetAvatar size={200} mood={isNamed($pet) ? 'excited' : 'curious'} />
		<p class="mt-3 font-display text-2xl font-extrabold text-night-ink">
			{isNamed($pet) ? $pet.name : 'No name yet'}
		</p>
		<p class="text-xs uppercase tracking-wider text-night-soft">
			Call sign · {$pet.personality.callSign}
		</p>
	</div>

	<div class="space-y-4">
		<div class="rounded-2xl bg-white p-4 shadow-soft">
			<h3 class="mb-2 font-display text-base font-bold text-night-ink">Look</h3>
			<p class="text-sm text-night-soft">
				Pattern: <strong>{$pet.pattern}</strong> · Accessory: <strong>{$pet.accessory}</strong>
			</p>
			<div class="mt-2 flex gap-2">
				<span class="size-6 rounded-full border border-mist" style="background: {$pet.color.primary};" title="primary"></span>
				<span class="size-6 rounded-full border border-mist" style="background: {$pet.color.secondary};" title="secondary"></span>
				<span class="size-6 rounded-full border border-mist" style="background: {$pet.color.bill};" title="bill"></span>
			</div>
		</div>

		<div class="rounded-2xl bg-white p-4 shadow-soft">
			<h3 class="mb-2 font-display text-base font-bold text-night-ink">Personality</h3>
			<ul class="text-sm text-night-soft">
				<li>Greeting tone: <code>{$pet.personality.greeting.tone}</code></li>
				<li>Favorite: {$pet.personality.favoriteThing ?? '—'}</li>
				<li>Trick: {$pet.personality.trick.gesture ?? '—'} → {$pet.personality.trick.preset}</li>
				<li>Mood rules: {$pet.personality.moodRules.length}</li>
				<li>Dream mode: {$pet.personality.dreamMode ? 'on' : 'off'}</li>
			</ul>
		</div>

		<div class="rounded-2xl bg-white p-4 shadow-soft">
			<h3 class="mb-2 font-display text-base font-bold text-night-ink">Journey</h3>
			<p class="text-sm text-night-soft">
				Levels completed: <strong>{$pet.unlocks.levelsCompleted.length}/6</strong> ·
				Missions tracked: <strong>{statCount}</strong> · Friends: <strong>{$pet.friends.length}</strong>
			</p>
			{#if unlocked.length}
				<div class="mt-2 flex flex-wrap gap-1.5">
					{#each unlocked as d}
						<span
							class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
							style="background: {DIMENSION_COLOR[d]}26; color: {DIMENSION_COLOR[d]};"
						>
							{DIMENSION_EMOJI[d]} {DIMENSION_LABEL[d]}
						</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
