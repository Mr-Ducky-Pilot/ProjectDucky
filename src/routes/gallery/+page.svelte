<script lang="ts">
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import DuckShareLoader from '$lib/components/DuckShareLoader.svelte';
	import { pet, importPet, addFriend } from '$lib/stores/pet';
	import type { DuckShare } from '$lib/share/duckfile';

	function relativeDate(t: number) {
		const diff = Date.now() - t;
		const day = 24 * 60 * 60 * 1000;
		if (diff < day) return 'today';
		if (diff < 2 * day) return 'yesterday';
		return Math.floor(diff / day) + ' days ago';
	}

	function adopt(share: DuckShare) {
		if (confirm(`Replace your duck with ${share.pet.name || 'this one'}?`)) importPet(share.pet);
	}

	function meet(share: DuckShare) {
		addFriend({
			callSign: share.pet.personality.callSign,
			name: share.pet.name || 'Mystery',
			color: share.pet.color,
			pattern: share.pet.pattern,
			metInMission: 'gallery'
		});
	}
</script>

<svelte:head>
	<title>Gallery · Ducky</title>
</svelte:head>

<section class="mx-auto max-w-5xl px-5 py-10">
	<a href="/journey" class="text-sm text-night-soft underline">← The journey</a>

	<header class="mt-4 flex items-end justify-between gap-4">
		<div>
			<h1 class="font-display text-3xl font-extrabold text-night-ink">Gallery</h1>
			<p class="text-night-soft">Every duck you've met or loaded. Adopt one, or just say hi.</p>
		</div>
		<a href="/pet" class="rounded-full bg-duck-yellow px-4 py-2 font-display font-bold text-night-ink">
			My duck
		</a>
	</header>

	<h2 class="mt-10 mb-3 font-display text-xl font-bold text-night-ink">Friends ({$pet.friends.length})</h2>
	{#if $pet.friends.length === 0}
		<p class="text-sm text-night-soft">
			No friends yet — play L3 mission <code>40-radio-pet-meet</code> with another board.
		</p>
	{:else}
		<ul class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each $pet.friends as f (f.callSign)}
				<li class="rounded-3xl bg-egg-cream p-4 text-center shadow-soft">
					<PetAvatar mood="idle" size={120} pet={{ name: f.name, color: f.color, pattern: f.pattern, accessory: 'none' }} />
					<p class="mt-2 font-display text-lg font-bold text-night-ink">{f.name}</p>
					<p class="text-[11px] uppercase tracking-wider text-night-soft">{f.callSign}</p>
					<p class="mt-1 text-xs text-night-soft">
						Met {relativeDate(f.metAt)} · {f.metInMission}
					</p>
				</li>
			{/each}
		</ul>
	{/if}

	<h2 class="mt-10 mb-3 font-display text-xl font-bold text-night-ink">Adopt a duck</h2>
	<DuckShareLoader
		hint="Drop a friend's .duck file"
		onLoaded={(s) => {
			meet(s);
			if (confirm(`Adopt ${s.pet.name} as your own duck? (Click cancel to just add as friend.)`)) {
				adopt(s);
			}
		}}
	/>
</section>
