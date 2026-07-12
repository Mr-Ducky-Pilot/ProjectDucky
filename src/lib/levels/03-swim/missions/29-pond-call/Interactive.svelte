<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import RadioPairPreview from '$lib/components/RadioPairPreview.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
import radio

radio.on()
radio.config(channel=7)

def log(msg):
    print('<L ' + str(msg) + '>')

log("ready")

while True:
    if button_a.was_pressed():
        radio.send(___(wave))
        display.show(Image.ARROW_E)
        log("sent")

    msg = radio.receive()
    if msg is not None:
        ___ml(show something on the display, pause, then clear — and log("received:" + msg))

    sleep(100)`;

	let code = $state('');
	let allFilled = $state(false);

	const mlSuggestions = {
		1: `display.show(Image.HAPPY)\nsleep(500)\ndisplay.clear()\nlog("received:" + msg)`
	};
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Decide what to send when A is pressed (a word, a number as a string, anything), and write what happens when a message arrives from another board.
	</div>

	<div class="flex items-start gap-3 rounded-xl border-2 border-(--color-duck-yellow)/40 bg-(--color-duck-yellow)/5 p-4 text-sm">
		<span class="text-xl">📡</span>
		<div>
			<p class="font-bold text-(--color-night-ink)">Two boards recommended</p>
			<p class="text-(--color-night-soft)">Flash this same code onto both boards. They're both sender and receiver at the same time. With one board, you can still see the "sent" log — the Board Output shows what's happening.</p>
		</div>
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled {mlSuggestions} />

	<RadioPairPreview {code} />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Board Output" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Press A to send. If a second board is nearby on the same channel, it receives and your handler runs. The Board Output above logs every event so you can see both directions.
	</div>

	<YourTurn challenges={[
		'Change what you send — try str(42) or "quack" instead of a single word.',
		'On receive, automatically reply: add radio.send("ack") inside the receive handler.',
		'Add button B: send a different message type and show a different reaction when received.'
	]} />
</div>
