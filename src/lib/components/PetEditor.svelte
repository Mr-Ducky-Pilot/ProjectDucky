<script lang="ts">
	import PetAvatar from './PetAvatar.svelte';
	import {
		pet,
		setPetName,
		setPetColor,
		setPetPattern,
		setPetAccessory
	} from '$lib/stores/pet';
	import type { PetPattern, PetAccessory } from '$lib/stores/pet';

	type Props = { showName?: boolean };
	let { showName = true }: Props = $props();

	const patterns: PetPattern[] = ['plain', 'spots', 'stripes', 'star', 'heart'];
	const accessories: PetAccessory[] = ['none', 'bow', 'cap', 'glasses', 'crown', 'scarf'];

	const swatches = [
		{ primary: '#ffd23a', secondary: '#ffe07a', bill: '#ff9b1a' }, // classic
		{ primary: '#4cc1ff', secondary: '#a6e1ff', bill: '#ff9b1a' }, // pond blue
		{ primary: '#ff7a6b', secondary: '#ffb5b0', bill: '#ffd23a' }, // coral
		{ primary: '#7ad44b', secondary: '#bde692', bill: '#ff9b1a' }, // leaf
		{ primary: '#b18cff', secondary: '#dac4ff', bill: '#ffd23a' }, // purple
		{ primary: '#1c1f2e', secondary: '#4a4f6c', bill: '#ffd23a' }, // midnight
		{ primary: '#fff8ec', secondary: '#ffffff', bill: '#ff9b1a' }, // ghost
		{ primary: '#ff5fa2', secondary: '#ff8ec3', bill: '#ffd23a' } //  pink
	];
</script>

<div class="grid gap-6 md:grid-cols-[auto_1fr]">
	<div class="flex justify-center md:block">
		<PetAvatar size={200} mood="excited" />
	</div>

	<div class="space-y-4">
		{#if showName}
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Name</span>
				<input
					class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display text-lg"
					placeholder="Pick a name"
					maxlength="20"
					value={$pet.name}
					oninput={(e) => setPetName((e.currentTarget as HTMLInputElement).value)}
				/>
			</label>
		{/if}

		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Colour</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each swatches as s}
					<button
						class="size-9 rounded-full border-2 transition hover:scale-110"
						class:border-night-ink={$pet.color.primary === s.primary}
						class:border-mist={$pet.color.primary !== s.primary}
						style="background: linear-gradient(135deg, {s.primary} 50%, {s.secondary} 50%);"
						aria-label="Use this colour scheme"
						onclick={() => setPetColor(s)}
					></button>
				{/each}
			</div>
		</div>

		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Pattern</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each patterns as p}
					<button
						class="rounded-full px-3 py-1.5 text-sm font-semibold capitalize"
						class:bg-night-ink={$pet.pattern === p}
						class:text-white={$pet.pattern === p}
						class:bg-mist={$pet.pattern !== p}
						class:text-night-soft={$pet.pattern !== p}
						onclick={() => setPetPattern(p)}
					>
						{p}
					</button>
				{/each}
			</div>
		</div>

		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Accessory</p>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each accessories as a}
					<button
						class="rounded-full px-3 py-1.5 text-sm font-semibold capitalize"
						class:bg-night-ink={$pet.accessory === a}
						class:text-white={$pet.accessory === a}
						class:bg-mist={$pet.accessory !== a}
						class:text-night-soft={$pet.accessory !== a}
						onclick={() => setPetAccessory(a)}
					>
						{a}
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
