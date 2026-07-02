<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import { pet, isNamed } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const name = $derived(isNamed($pet) ? $pet.name : 'Ducky');

	const TEMPLATE = $derived(`from microbit import *

NAME = "${name}"
GREETING = "___(Hi I am)"

while True:
    if button_b.was_pressed():
        display.scroll(GREETING + " " + NAME)   # + joins strings together, end to end
    sleep(50)`);

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="flex items-center gap-4 rounded-2xl bg-egg-cream p-4 shadow-soft">
		<PetAvatar size={80} mood="excited" />
		<div>
			<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Your duck</p>
			<p class="font-display text-xl font-extrabold text-night-ink">
				{isNamed($pet) ? $pet.name : 'Reach Level 3 to give it a name'}
			</p>
		</div>
	</div>

	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Type a greeting your duck will say before its name. The name is filled in for you from your saved pet.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Press B — your duck scrolls its own name.',
			'Edit the greeting, re-flash. Watch how fast that loop is.',
			'Give it to a friend: do they know whose duck it is?'
		]}
	/>
</div>
