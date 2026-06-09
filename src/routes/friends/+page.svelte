<script lang="ts">
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import { pet } from '$lib/stores/pet';

	function relativeDate(t: number) {
		const diff = Date.now() - t;
		const day = 24 * 60 * 60 * 1000;
		if (diff < day) return 'today';
		if (diff < 2 * day) return 'yesterday';
		return Math.floor(diff / day) + ' days ago';
	}
</script>

<svelte:head>
	<title>My friends · Ducky</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-5 py-10">
	<a href="/journey" class="text-sm text-night-soft underline">← The journey</a>
	<h1 class="mt-4 font-display text-3xl font-extrabold text-night-ink">My friends</h1>
	<p class="text-night-soft">Ducks you've met through radio or shared links.</p>

	{#if $pet.friends.length === 0}
		<div class="mt-8 rounded-3xl bg-egg-cream p-8 text-center shadow-soft">
			<PetAvatar mood="curious" size={120} />
			<p class="mt-4 font-display text-lg font-bold text-night-ink">No friends yet</p>
			<p class="mt-1 text-sm text-night-soft">
				Play L3 mission <code>40-radio-pet-meet</code> with another board, or scan a friend's QR.
			</p>
		</div>
	{:else}
		<ul class="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
			{#each $pet.friends as f (f.callSign)}
				<li class="rounded-3xl bg-white p-4 shadow-soft text-center">
					<PetAvatar
						mood="idle"
						size={120}
						pet={{ name: f.name, color: f.color, pattern: f.pattern, accessory: 'none' }}
					/>
					<p class="mt-2 font-display text-lg font-bold text-night-ink">{f.name}</p>
					<p class="text-[11px] uppercase tracking-wider text-night-soft">{f.callSign}</p>
					<p class="mt-1 text-xs text-night-soft">
						Met in {f.metInMission} · {relativeDate(f.metAt)}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</section>
