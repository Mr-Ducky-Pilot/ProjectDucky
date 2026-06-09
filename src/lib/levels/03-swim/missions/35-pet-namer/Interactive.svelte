<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, setPetName, isNamed, unlockDimension } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let nameInput = $state($pet.name);

	$effect(() => {
		nameInput = $pet.name;
	});

	function save() {
		setPetName(nameInput);
		unlockDimension('pet');
	}

	const safeName = $derived((isNamed($pet) ? $pet.name : 'Ducky').replace(/"/g, ''));

	const code = $derived(`from microbit import *

NAME = "${safeName}"

def log(msg):
    print('<L ' + str(msg) + '>')

display.scroll("Hi I am " + NAME)
log("named " + NAME)

while True:
    if button_a.was_pressed():
        display.scroll(NAME)
    sleep(50)`);

	function onFlashed() {
		save();
		complete();
	}
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col items-center gap-3 rounded-3xl bg-egg-cream p-5 shadow-soft">
		<PetAvatar size={140} mood={isNamed($pet) ? 'excited' : 'curious'} />
		{#if isNamed($pet)}
			<p class="font-display text-2xl font-extrabold text-night-ink">{$pet.name}</p>
		{/if}
	</div>

	<label class="block">
		<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Name your duck</span>
		<input
			class="mt-1 w-full rounded-md border-2 border-mist bg-white px-3 py-3 font-display text-xl"
			maxlength="20"
			placeholder="Quackers, Sir Honks, Bubbles..."
			bind:value={nameInput}
			oninput={save}
		/>
	</label>

	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Once you've picked a name, flash the code — your duck will scroll it across the LEDs and remember it forever.
	</div>

	<FlashCodeButton {code} disabled={!isNamed($pet)} onFlashed={onFlashed} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Press A on the chip — does it scroll your name?',
			'Change the name above, re-flash — instant update.',
			'Visit the My Pet page to see your new duck.'
		]}
	/>
</div>
