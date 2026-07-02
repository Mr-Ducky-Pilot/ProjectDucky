<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
import radio
import music
import neopixel

radio.on()
radio.config(channel=7)

np = neopixel.NeoPixel(pin0, 1)

FEELINGS = [
    ('happy',   Image.HAPPY,     (255, 190, 20)),
    ('sad',     Image.SAD,       (30, 60, 150)),
    ('excited', Image.SURPRISED, (255, 120, 20)),
    ('calm',    Image.ASLEEP,    (___(20, 20, 80))),
    ('silly',   Image.SILLY,     (200, 60, 220)),
]

idx = 0

def log(msg):
    print('<L ' + str(msg) + '>')

def show_feeling(name, img, rgb):
    ___ml(show img on the display, then set the neopixel: np[0] = rgb and np.show())

show_feeling(*FEELINGS[idx])

while True:
    if button_a.was_pressed():
        idx = (idx + 1) % len(FEELINGS)
        show_feeling(*FEELINGS[idx])

    if button_b.was_pressed():
        name, img, rgb = FEELINGS[idx]
        radio.send(name)
        log("sent:" + name)
        music.pitch(900, 100, wait=True)

    msg = radio.receive()
    if msg is not None:
        for name, img, rgb in FEELINGS:
            if name == msg:
                show_feeling(name, img, rgb)
                log("received:" + name)
                music.pitch(500, 150, wait=True)
                break

    sleep(50)`;

	let code = $state('');
	let allFilled = $state(false);

	const mlSuggestions = {
		1: `display.show(img)\nnp[0] = rgb\nnp.show()`
	};
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Pick a colour for "calm" (three numbers, 0–255 each). Then write
		<code>show_feeling()</code> — it should show the image and set the RGB LED to match.
	</div>

	<div class="flex items-start gap-3 rounded-xl border-2 border-(--color-duck-yellow)/40 bg-(--color-duck-yellow)/5 p-4 text-sm">
		<span class="text-xl">💛</span>
		<div>
			<p class="font-bold text-(--color-night-ink)">Two ducks, two hearts</p>
			<p class="text-(--color-night-soft)">Flash the same code to both boards. Press A to cycle your feeling, press B to send it. The other duck lights up and glows the matching colour the moment it receives your feeling — no words needed.</p>
			<p class="mt-1 text-(--color-night-soft)">💡 Each duck needs a Grove RGB LED clipped to pin 0 to actually glow — the face and radio message work without it.</p>
		</div>
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled {mlSuggestions} />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Beacon Log" />

	<YourTurn
		title="Try this"
		challenges={[
			'Send five different feelings in a row — did your friend guess right each time from colour alone?',
			'Agree beforehand: does orange mean "excited" or "worried" for you both? Compare notes after.',
			'Take turns being the sender for a full minute each — who sent the most feelings?'
		]}
	/>
</div>
