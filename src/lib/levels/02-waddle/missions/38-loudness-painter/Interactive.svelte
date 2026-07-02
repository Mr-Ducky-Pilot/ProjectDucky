<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
from random import randint

SCALE = ___(25)
FADE  = ___(1)

while True:
    sound = microphone.sound_level()
    b = min(9, sound // SCALE)   # // rounds down after dividing; min() caps it at 9
    # paint a random pixel at brightness b
    x = randint(0, 4)
    y = randint(0, 4)
    display.set_pixel(x, y, b)
    # let the rest fade
    for fy in range(5):
        for fx in range(5):
            cur = display.get_pixel(fx, fy)
            if cur > 0:
                display.set_pixel(fx, fy, cur - FADE)
    sleep(60)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Two blanks: <strong>SCALE</strong> (divides the mic reading — bigger means
		quieter sounds paint dimmer) and <strong>FADE</strong> (how fast the painting
		drifts back to black).
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Whisper near Ducky. Does it paint?',
			'Clap loudly — does the screen flood?',
			'Tune SCALE until normal talking paints about half.'
		]}
	/>
</div>
