<script lang="ts">
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import DuckShareLoader from '$lib/components/DuckShareLoader.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, importPet, markLevelCompleted } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	function visitGallery() {
		markLevelCompleted(5);
		complete();
	}
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-3xl bg-egg-cream p-5 shadow-soft text-center">
		<h2 class="font-display text-2xl font-extrabold text-night-ink">The Gallery</h2>
		<p class="mt-1 text-sm text-night-soft">
			You have {$pet.friends.length} friend{$pet.friends.length === 1 ? '' : 's'}.
		</p>
		<a
			href="/gallery"
			class="mt-4 inline-block rounded-full bg-night-ink px-5 py-3 font-display font-bold text-white"
			onclick={visitGallery}
		>
			Open the gallery →
		</a>
	</div>

	<div>
		<h3 class="mb-2 font-display font-bold text-night-ink">Latest friends</h3>
		{#if $pet.friends.length === 0}
			<p class="text-sm text-night-soft">None yet — play L3 mission 40 with a friend.</p>
		{:else}
			<ul class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
				{#each $pet.friends.slice(-8) as f (f.callSign)}
					<li class="rounded-2xl bg-white p-3 text-center shadow-soft">
						<PetAvatar
							mood="idle"
							size={80}
							pet={{ name: f.name, color: f.color, pattern: f.pattern, accessory: 'none' }}
						/>
						<p class="mt-1 truncate font-display text-sm font-bold text-night-ink">{f.name}</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<DuckShareLoader
		hint="Adopt another duck"
		onLoaded={(s) => {
			if (confirm(`Replace your duck with ${s.pet.name || 'this one'}?`)) importPet(s.pet);
		}}
	/>

	<YourTurn
		title="Keep collecting"
		challenges={[
			'Meet 5 different ducks (mission 40 with friends).',
			'Adopt one. Then re-adopt your own.',
			'Re-share your favourite via the QR card.'
		]}
	/>
</div>
