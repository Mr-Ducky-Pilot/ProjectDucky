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

MY_SECRET = ___(5)
radio.on()
radio.config(channel=7)

def log(msg):
    print('<L ' + str(msg) + '>')

def celebrate():
    ___ml(you matched — show something exciting and play a sound)

def reject():
    display.show(Image.NO)
    sleep(500)
    display.clear()

log("ready:" + str(MY_SECRET))

while True:
    if button_a.was_pressed():
        radio.send(str(MY_SECRET))
        display.show(Image.ARROW_E)
        log("sent:" + str(MY_SECRET))

    msg = radio.receive()
    if msg is not None:
        received = int(msg)
        log("got:" + str(received))
        ___ml(if received equals MY_SECRET call celebrate(), otherwise call reject())

    sleep(100)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Pick your secret number (1–8). Design the <code>celebrate()</code> function — what does matching look like? Then write the match check that calls <code>celebrate()</code> or <code>reject()</code> based on the received number.
	</div>

	<div class="flex items-start gap-3 rounded-xl border-2 border-(--color-duck-yellow)/40 bg-(--color-duck-yellow)/5 p-4 text-sm">
		<span class="text-xl">🤝</span>
		<div>
			<p class="font-bold text-(--color-night-ink)">Both boards need the same secret to celebrate</p>
			<p class="text-(--color-night-soft)">Flash the same code to both boards. Decide together what <code>MY_SECRET</code> should be — if you pick different numbers, neither side will celebrate. Press A on each board to broadcast: the match check fires <code>celebrate()</code> only when the numbers line up. Try changing one board's secret and watch what happens.</p>
			<p class="mt-1 text-(--color-night-soft)">💡 For a guessing game, see YourTurn challenge #2 — randomise <code>MY_SECRET</code> on shake and keep tapping A until both boards agree by chance.</p>
		</div>
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Handshake Log" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Both boards sit idle. Press A to broadcast your secret. The Board Output logs every send and receive. When the secrets match — both boards celebrate simultaneously.
	</div>

	<YourTurn challenges={[
		'Add a counter: count attempts and display.scroll(str(attempts)) after a match.',
		'Add shake to randomise MY_SECRET each round (import random; MY_SECRET = random.randint(1,8) on gesture).',
		'Extend the celebrate() to include display.scroll("MATCH!") so the boards show visible text confirmation.'
	]} />
</div>
