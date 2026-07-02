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
import utime

radio.on()
radio.config(channel=7)

WIN = ___(25)
my_score = 0
their_score = 0
last_broadcast = utime.ticks_ms()

def log(msg):
    print('<L ' + str(msg) + '>')

def show_scores():
    ___ml(show my score as a bright bar on the left (cols 0-1) and their score as a dim bar on the right (cols 3-4), scaled to WIN, bottom-to-top)

while True:
    if button_a.was_pressed():
        my_score += 1
        log("me:" + str(my_score) + ":them:" + str(their_score))

    msg = radio.receive()
    if msg and msg.startswith("score:"):
        ___ml(parse their score from msg (format "score:N") and update their_score)

    now = utime.ticks_ms()
    if utime.ticks_diff(now, last_broadcast) >= 1000:
        ___ml(send my_score in "score:N" format over radio, update last_broadcast to now)

    if my_score >= WIN:
        ___ml(I won! scroll a victory message and break)
        break
    elif their_score >= WIN:
        display.scroll("You lose!")
        break

    show_scores()
    sleep(50)`;

	let code = $state('');
	let allFilled = $state(false);

	const mlSuggestions = {
		1: `my_lit = min(5, int((my_score / WIN) * 5))
their_lit = min(5, int((their_score / WIN) * 5))
for row in range(5):
    b = 9 if (4 - row) < my_lit else 0
    display.set_pixel(0, row, b)
    display.set_pixel(1, row, b)
    b2 = 4 if (4 - row) < their_lit else 0
    display.set_pixel(3, row, b2)
    display.set_pixel(4, row, b2)`,
		2: `their_score = int(msg.split(":")[1])`,
		3: `radio.send("score:" + str(my_score))\nlast_broadcast = now`,
		4: `display.scroll("You win!")`
	};
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Write the two-bar scoreboard function, the receive handler that parses opponent scores, the broadcast that sends yours every second, and the win celebration.
	</div>

	<div class="rounded-xl bg-(--color-mist) p-3 text-sm text-(--color-night-soft)">
		💡 Use <code>utime.ticks_diff(now, last_broadcast) &gt;= 1000</code> for a 1-second interval.
		Use <code>display.set_pixel(col, row, brightness)</code> to light individual LEDs.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled {mlSuggestions} />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Score Feed" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Flash the same code to both boards. Press A as fast as you can. The bars grow bottom-to-top — yours on the left (bright), theirs on the right (dim). First to {25} wins!
	</div>

	<YourTurn challenges={[
		'Add a 3-second countdown before the while loop — both boards show "3", "2", "1", "GO!" using display.scroll().',
		'Add button B as a reset: send "reset" over radio and set both scores to 0 when received.',
		'After winning, send "you lose" over radio — write a receive handler that shows it on the other board.'
	]} />
</div>
