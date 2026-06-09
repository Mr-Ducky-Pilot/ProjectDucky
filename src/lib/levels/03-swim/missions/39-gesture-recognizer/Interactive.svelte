<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

def log(msg):
    print('<L ' + str(msg) + '>')

def detect():
    x = accelerometer.get_x()
    g = accelerometer.get_strength()
    ___ml(return "shake" if g > 1800; return "tilt-l" if x < -500; return "tilt-r" if x > 500; else return None)

last_t = 0
while True:
    g = detect()
    if g and running_time() - last_t > 400:
        last_t = running_time()
        log(g)
        if g == "shake":
            display.show(Image.YES)
        elif g == "tilt-l":
            display.show(Image.ARROW_W)
        elif g == "tilt-r":
            display.show(Image.ARROW_E)
        sleep(300)
        display.clear()
    sleep(20)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Fill the body of <code>detect()</code> with the classifier rules — check shake
		first (highest threshold wins), then tilt left, then tilt right. Return the
		gesture name as a string, or <code>None</code>.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Gesture log" />

	<YourTurn
		title="After flashing"
		challenges={[
			'Try all three. Does the log show the right name?',
			'Add a 4th gesture (flip) using accelerometer.get_z() < -800.',
			'Lower the shake threshold to 1400 — does it false-trigger?'
		]}
	/>
</div>
