<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let enabled = $state($pet.personality.grumpyEnabled);
	let loudThresh = $state(150);
	let upperLimit = $state(70);

	$effect(() => {
		updatePersonality({ grumpyEnabled: enabled });
	});

	const code = $derived(`from microbit import *

grumpy = 0
state = 'calm'
LOUD = ${loudThresh}
UPPER = ${upperLimit}
LOWER = ${Math.max(10, upperLimit - 40)}

while True:
    try: v = microphone.sound_level()
    except: v = 0
    if v > LOUD: grumpy = min(100, grumpy + 3)
    else:        grumpy = max(0,   grumpy - 1)

    if state == 'calm' and grumpy > UPPER:
        state = 'grumpy'
    elif state == 'grumpy' and grumpy < LOWER:
        state = 'calm'

    if state == 'grumpy':
        display.show(Image.ANGRY)
    else:
        display.show(Image.HAPPY)
    sleep(100)`);
</script>

<div class="flex flex-col gap-5">
	<label class="flex items-center gap-3 rounded-2xl bg-egg-cream p-4 shadow-soft">
		<input type="checkbox" bind:checked={enabled} class="size-5" />
		<span class="font-display font-bold">Enable grumpy mode</span>
	</label>

	<div class="grid gap-4 md:grid-cols-2">
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Loud threshold</span>
			<input type="range" min="50" max="250" bind:value={loudThresh} class="mt-1 w-full" />
			<span class="text-sm font-mono">{loudThresh}</span>
		</label>
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Patience (higher = chiller)</span>
			<input type="range" min="30" max="95" bind:value={upperLimit} class="mt-1 w-full" />
			<span class="text-sm font-mono">{upperLimit}/100</span>
		</label>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="Test the limits"
		challenges={[
			'Yell at your duck. Time how long until it gets grumpy.',
			'Stay silent — watch the recovery.',
			'Set patience to 30 — very sensitive duck.'
		]}
	/>
</div>
