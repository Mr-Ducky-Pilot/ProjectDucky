<script lang="ts">
	import DuckShareLoader from '$lib/components/DuckShareLoader.svelte';
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { DuckShare } from '$lib/share/duckfile';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let loaded = $state<DuckShare | null>(null);
	let code = $state('# load a .duck file above');
	let notes = $state('');

	function onLoaded(s: DuckShare) {
		loaded = s;
		if (s.type === 'remix') {
			code = s.remix.code;
		} else {
			code = `# Pet: ${s.pet.name}\n# Loaded from a .duck file — write your remix here.\nfrom microbit import *\ndisplay.scroll("${s.pet.name.replace(/"/g, '')}")\n`;
		}
	}
</script>

<div class="flex flex-col gap-5">
	{#if !loaded}
		<DuckShareLoader hint="Drop a friend's .duck file" onLoaded={onLoaded} />
	{:else}
		<div class="flex items-center gap-4 rounded-3xl bg-egg-cream p-4 shadow-soft">
			<PetAvatar size={100} mood="curious" pet={loaded.pet} />
			<div>
				<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Loaded</p>
				<p class="font-display text-xl font-extrabold text-night-ink">{loaded.pet.name}</p>
				<p class="text-sm text-night-soft">{loaded.type}</p>
			</div>
			<button class="ml-auto rounded-full bg-mist px-3 py-1 text-sm" onclick={() => (loaded = null)}>
				Load another
			</button>
		</div>

		<FreePythonEditor initial={code} bind:code />

		<label class="block">
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Remix notes</span>
			<input
				class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2"
				placeholder="What did you change?"
				bind:value={notes}
			/>
		</label>

		<FlashCodeButton {code} onFlashed={complete} />

		<QrShareCard variant="remix" remix={{ missionId: '51-pet-remix', code, notes }} title="Send the remix back" />
	{/if}

	<YourTurn
		title="Try this"
		challenges={[
			'Load, then change ONLY the LED face.',
			'Pass the same .duck through 4 people\'s hands.',
			'Track who remixed what — make a family tree.'
		]}
	/>
</div>
