<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality, type GestureName } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const GESTURES: GestureName[] = ['shake', 'tilt-l', 'tilt-r'];
	const TRICKS = ['dance', 'roll', 'sparkle', 'sing'];

	let gesture = $state<GestureName>($pet.personality.trick.gesture || 'shake');
	let trick = $state($pet.personality.trick.preset || TRICKS[0]);

	$effect(() => {
		updatePersonality({ trick: { gesture, preset: trick } });
	});

	const trickBody = $derived(
		trick === 'dance'
			? `    for f in (Image.HAPPY, Image.SURPRISED, Image.YES): display.show(f); sleep(150)`
			: trick === 'roll'
				? `    for f in (Image.ARROW_E, Image.ARROW_S, Image.ARROW_W, Image.ARROW_N): display.show(f); sleep(120)`
				: trick === 'sparkle'
					? `    for _ in range(6): display.show(Image('${"99999".repeat(5)}'.split('')[0])); sleep(80); display.clear(); sleep(80)`
					: `    import music; music.play(['C5:2','E5:2','G5:4'])`
	);

	const code = $derived(`from microbit import *

GESTURE = '${gesture}'

def detect():
    if accelerometer.get_strength() > 1800: return 'shake'
    x = accelerometer.get_x()
    if x < -500: return 'tilt-l'
    if x >  500: return 'tilt-r'
    return None

def do_trick():
${trickBody}

last_t = 0
display.show(Image.HEART)

while True:
    if detect() == GESTURE and running_time() - last_t > 800:
        last_t = running_time()
        do_trick()
    sleep(50)`);
</script>

<div class="flex flex-col gap-5">
	<div class="grid gap-4 md:grid-cols-2">
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">When I…</span>
			<select class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display" bind:value={gesture}>
				{#each GESTURES as g}<option value={g}>{g}</option>{/each}
			</select>
		</label>
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">My duck does the…</span>
			<select class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display" bind:value={trick}>
				{#each TRICKS as t}<option value={t}>{t}</option>{/each}
			</select>
		</label>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="Perform!"
		challenges={[
			'Trigger the gesture — does the trick fire?',
			'Try every gesture+trick combination.',
			'Two ducks, same trick — sync them up.'
		]}
	/>
</div>
