<script lang="ts">
	import PetStatSheet from '$lib/components/PetStatSheet.svelte';
	import PetEditor from '$lib/components/PetEditor.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import DuckShareLoader from '$lib/components/DuckShareLoader.svelte';
	import { pet, isNamed, resetPet, importPet } from '$lib/stores/pet';

	let editing = $state(false);

	function startOver() {
		if (confirm('Reset your duck back to a blank duckling? Your friends list will be wiped too.')) {
			resetPet();
		}
	}
</script>

<svelte:head>
	<title>My pet · Ducky</title>
</svelte:head>

<section class="mx-auto max-w-4xl px-5 py-10">
	<a href="/journey" class="text-sm text-night-soft underline">← The journey</a>

	<header class="mt-4 flex items-end justify-between gap-4">
		<div>
			<h1 class="font-display text-3xl font-extrabold text-night-ink">My duck</h1>
			<p class="text-night-soft">
				{#if isNamed($pet)}
					This is {$pet.name}. Programmed by you.
				{:else}
					Reach Level 3 to give your duck a name and colour.
				{/if}
			</p>
		</div>
		<button
			class="rounded-full bg-duck-yellow px-4 py-2 font-display font-bold text-night-ink"
			onclick={() => (editing = !editing)}
		>
			{editing ? 'Done' : 'Customise'}
		</button>
	</header>

	<div class="mt-6">
		{#if editing}
			<PetEditor />
		{:else}
			<PetStatSheet />
		{/if}
	</div>

	{#if isNamed($pet)}
		<div class="mt-10 grid gap-6 md:grid-cols-2">
			<QrShareCard />
			<DuckShareLoader
				hint="Adopt a duck from a friend"
				onLoaded={(s) => {
					if (confirm(`Replace your duck with ${s.pet.name || 'this duck'}?`)) importPet(s.pet);
				}}
			/>
		</div>

		<div class="mt-10 flex justify-end">
			<button class="text-sm text-night-soft underline" onclick={startOver}>Start over</button>
		</div>
	{/if}
</section>
