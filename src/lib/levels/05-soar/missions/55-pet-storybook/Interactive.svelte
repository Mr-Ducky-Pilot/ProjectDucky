<script lang="ts">
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const safe = (s: string) => s.replace(/"/g, '');
	const name = $derived(safe($pet.name) || 'Ducky');

	const INITIAL = $derived(`from microbit import *
import music

NAME = "${name}"

# Each scene: (image, caption, music_notes, hold_ms)
SCENES = [
    (Image.HAPPY,     "Once upon",   ['C4:4'],            1500),
    (Image.HEART,     "a duck",      ['E4:4','G4:4'],     1500),
    (Image.ARROW_E,   "set off...",  ['G4:2','A4:2'],     1500),
    (Image.SURPRISED, "and met",     ['B4:4'],            1500),
    (Image.YES,       "a friend.",   ['C5:4','E5:4'],     1500),
    (Image.HAPPY,     "The end.",    ['G5:8'],            2000),
]

while True:
    if button_a.was_pressed():
        for img, caption, tune, ms in SCENES:
            display.show(img)
            music.play(tune)
            sleep(ms)
        display.scroll(NAME + " - fin")
    sleep(50)`);

	let code = $state(INITIAL);
	$effect(() => {
		code = INITIAL;
	});
</script>

<div class="flex flex-col gap-5">
	<FreePythonEditor initial={INITIAL} bind:code />

	<FlashCodeButton {code} onFlashed={complete} />

	<QrShareCard variant="remix" remix={{ missionId: '55-pet-storybook', code }} title="Share your story" />

	<YourTurn
		title="Tell a story"
		challenges={[
			'Replace the captions with words from your day.',
			'Add 2 more scenes — make it 8 total.',
			'Try halving all the sleeps. Then doubling. Which feels right?'
		]}
	/>
</div>
