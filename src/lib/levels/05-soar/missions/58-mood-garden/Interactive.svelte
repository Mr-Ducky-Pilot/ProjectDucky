<script lang="ts">
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import MicrobitPreview from '$lib/components/MicrobitPreview.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const safe = (s: string) => s.replace(/"/g, '');

	const INITIAL = $derived(`# Mood Garden for ${safe($pet.name) || 'Ducky'}
from microbit import *
import music
import radio
import neopixel

NAME = "${safe($pet.name) || 'Ducky'}"

radio.on()
radio.config(channel=42)

np = neopixel.NeoPixel(pin0, 1)

MOODS = [
    ('happy',   Image.HAPPY,     (255, 190, 20), ['C5:2', 'E5:2']),
    ('calm',    Image.ASLEEP,    (30, 60, 150),  ['C4:4']),
    ('excited', Image.SURPRISED, (255, 120, 20), ['E5:1', 'G5:1', 'C6:2']),
]

idx = 0

def log_mood(name):
    print('<L D ' + name + ' ' + str(running_time()) + '>')

def show(i):
    name, img, rgb, tune = MOODS[i]
    display.show(img)
    np[0] = rgb
    np.show()
    music.play(tune, wait=False)
    log_mood(name)

show(idx)

while True:
    if button_a.was_pressed():
        idx = (idx - 1) % len(MOODS)
        show(idx)
    if button_b.was_pressed():
        idx = (idx + 1) % len(MOODS)
        show(idx)
    if pin_logo.is_touched():
        radio.send(MOODS[idx][0])
        sleep(400)
    sleep(50)`);

	let code = $state(INITIAL);

	$effect(() => {
		code = INITIAL;
	});
</script>

<div class="flex flex-col gap-5">
	<p class="text-xs text-(--color-night-soft)">
		💡 Uses a Grove RGB LED on pin 0 for the colour glow — everything else works without it.
	</p>

	<div class="grid gap-4 md:grid-cols-[1fr_auto]">
		<FreePythonEditor initial={INITIAL} bind:code />
		<div class="md:w-64"><MicrobitPreview {code} /></div>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<div class="rounded-2xl bg-egg-cream p-4 shadow-soft">
		<h3 class="mb-2 font-display font-bold text-night-ink">Share your remix</h3>
		<QrShareCard variant="remix" remix={{ missionId: '58-mood-garden', code, notes: 'My mood garden' }} title="Share this remix" />
	</div>

	<YourTurn
		title="Grow it"
		challenges={[
			'Add a fourth mood with your own colour, sound, and face.',
			'Watch the Board Output for the <L D ...> lines — that\'s your mood history, one entry per change.',
			'Touch the logo to broadcast your current mood to a friend\'s duck over radio.'
		]}
	/>
</div>
