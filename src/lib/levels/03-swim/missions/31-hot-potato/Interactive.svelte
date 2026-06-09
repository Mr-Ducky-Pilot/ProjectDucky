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

radio.on()
radio.config(channel=7)

has_potato = ___(True)
MAX_TICKS = ___(30)
countdown = MAX_TICKS

def log(msg):
    print('<L ' + str(msg) + '>')

def show_countdown(c, total):
    ___ml(show a bargraph of lit rows — more rows when c is close to total, fewer as countdown drops)

def explode():
    ___ml(boom! show something dramatic, play a sound, maybe scroll "BOOM!")

log("start:holding" if has_potato else "start:safe")

while True:
    if has_potato:
        if countdown <= 0:
            explode()
            break
        show_countdown(countdown, MAX_TICKS)
        countdown -= 1
        log("countdown:" + str(countdown))

        if button_b.was_pressed():
            ___ml(send "potato" over radio, set has_potato = False, show a safe face)

    msg = radio.receive()
    if msg == "potato":
        has_potato = True
        countdown = MAX_TICKS
        log("got:potato")
        display.show(Image.ARROW_W)

    sleep(200)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Write the countdown bargraph function (maps the timer to LED rows), the explode sequence (what losing looks like), and the pass logic (button B passes the potato by radio).
	</div>

	<div class="grid grid-cols-2 gap-3 text-sm">
		<div class="rounded-xl bg-(--color-mist) p-3">
			<p class="font-bold text-(--color-night-ink)">Board A — starts with potato</p>
			<p class="text-(--color-night-soft)">Set <code>has_potato = True</code></p>
		</div>
		<div class="rounded-xl bg-(--color-mist) p-3">
			<p class="font-bold text-(--color-night-ink)">Board B — starts safe</p>
			<p class="text-(--color-night-soft)">Set <code>has_potato = False</code></p>
		</div>
	</div>

	<div class="rounded-xl bg-(--color-sunset-coral)/10 p-3 text-sm text-(--color-night-soft)">
		💡 <code>MAX_TICKS × 0.2s</code> = total seconds. 30 ticks = 6 seconds. Try 50 for a longer game.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Game Events" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Flash the same code twice — set <code>has_potato</code> to True for one board, False for the other. The holder sees the countdown bargraph shrinking. Press B to pass before it hits zero!
	</div>

	<YourTurn challenges={[
		'Make the countdown shrink faster each pass: decrement by 2 after the first pass, 3 after the second.',
		'Add tension: play music.pitch(400 + countdown * 30, 50) inside show_countdown so the beeps get faster.',
		'Track wins: add a rounds_won counter and display.scroll it when explode() is called.'
	]} />
</div>
