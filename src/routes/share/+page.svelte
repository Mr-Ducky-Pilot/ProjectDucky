<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import DuckShareLoader from '$lib/components/DuckShareLoader.svelte';
	import { decodeShare, type DuckShare } from '$lib/share/duckfile';
	import { importPet, addFriend } from '$lib/stores/pet';

	let share = $state<DuckShare | null>(null);
	let loading = $state(true);
	let adopted = $state(false);
	let added = $state(false);

	async function load(hash: string) {
		loading = true;
		const result = await decodeShare(hash);
		share = result;
		loading = false;
	}

	function adopt() {
		if (!share) return;
		importPet(share.pet);
		adopted = true;
		setTimeout(() => goto('/pet'), 900);
	}

	function meet() {
		if (!share) return;
		const p = share.pet;
		addFriend({
			callSign: p.personality.callSign,
			name: p.name || 'Mystery duck',
			color: p.color,
			pattern: p.pattern,
			metInMission: 'share-link'
		});
		added = true;
	}

	onMount(() => {
		const hash = location.hash.slice(1);
		if (hash) void load(hash);
		else loading = false;
	});
</script>

<svelte:head>
	<title>Adopt a duck · Ducky</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-10">
	<a href="/" class="text-sm text-night-soft underline">← Back home</a>
	<h1 class="mt-4 font-display text-3xl font-extrabold text-night-ink">Someone sent you a duck</h1>

	{#if loading}
		<p class="mt-6 text-night-soft">Unwrapping…</p>
	{:else if share}
		<div class="mt-6 grid gap-6 md:grid-cols-[auto_1fr]">
			<div class="rounded-3xl bg-egg-cream p-6 shadow-soft text-center">
				<PetAvatar pet={share.pet} mood="excited" size={180} />
				<p class="mt-3 font-display text-xl font-bold text-night-ink">
					{share.pet.name || 'Unnamed duck'}
				</p>
				<p class="text-xs uppercase tracking-wider text-night-soft">
					Call sign · {share.pet.personality.callSign}
				</p>
			</div>

			<div class="space-y-3">
				<p class="text-night-ink">
					{#if share.type === 'remix'}
						This duck comes with a remix of <code>{share.remix.missionId}</code>.
					{:else}
						This is a pet ready to be adopted.
					{/if}
				</p>
				<ul class="text-sm text-night-soft">
					<li>Pattern: {share.pet.pattern}</li>
					<li>Accessory: {share.pet.accessory}</li>
					<li>Friends made: {share.pet.friends.length}</li>
					<li>Levels completed: {share.pet.unlocks.levelsCompleted.length}</li>
				</ul>

				<div class="flex flex-wrap gap-3 pt-2">
					<button
						class="rounded-full bg-night-ink px-5 py-3 font-display font-bold text-white"
						onclick={adopt}
						disabled={adopted}
					>
						{adopted ? 'Adopted! Redirecting…' : 'Adopt as my pet'}
					</button>
					<button
						class="rounded-full bg-duck-yellow px-5 py-3 font-display font-bold text-night-ink"
						onclick={meet}
						disabled={added}
					>
						{added ? 'Added to friends ✓' : 'Just add to friends'}
					</button>
				</div>

				<p class="pt-2 text-xs text-night-soft">
					Adopt = replace your saved pet. Add to friends = keep yours, remember this one.
				</p>
			</div>
		</div>
	{:else}
		<p class="mt-6 text-night-soft">No share link found. Drop a .duck file:</p>
		<div class="mt-4">
			<DuckShareLoader
				hint="Drop a .duck file to preview it"
				onLoaded={(s) => {
					share = s;
				}}
			/>
		</div>
	{/if}
</div>
