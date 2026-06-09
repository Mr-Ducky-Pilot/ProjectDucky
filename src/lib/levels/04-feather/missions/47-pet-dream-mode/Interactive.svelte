<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let dreamMode = $state($pet.personality.dreamMode);
	let idleSec = $state(30);

	$effect(() => {
		updatePersonality({ dreamMode });
	});

	const code = $derived(`from microbit import *

last_move = running_time()
phase = 0
IDLE_MS = ${idleSec * 1000}

while True:
    g = accelerometer.get_strength()
    if abs(g - 1024) > 200:
        last_move = running_time()

    idle_for = running_time() - last_move

    if idle_for > IDLE_MS:
        # Dream animation: drifting Z's
        phase = (phase + 1) % 5
        rows = ['00000'] * 5
        rows[phase] = '00099'
        display.show(Image(':'.join(rows)))
        sleep(300)
    else:
        display.show(Image.HAPPY)
        sleep(100)`);
</script>

<div class="flex flex-col gap-5">
	<label class="flex items-center gap-3 rounded-2xl bg-egg-cream p-4 shadow-soft">
		<input type="checkbox" bind:checked={dreamMode} class="size-5" />
		<span class="font-display font-bold">Enable dream mode</span>
	</label>

	<label>
		<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Sleep after</span>
		<input type="range" min="5" max="120" bind:value={idleSec} class="mt-1 w-full" />
		<span class="text-sm font-mono">{idleSec} seconds</span>
	</label>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="See it dream"
		challenges={[
			'Set it on a table. Wait. Watch it sleep.',
			'Tap it gently — it wakes immediately.',
			'Try a 5-second idle — super sleepy duck.'
		]}
	/>
</div>
