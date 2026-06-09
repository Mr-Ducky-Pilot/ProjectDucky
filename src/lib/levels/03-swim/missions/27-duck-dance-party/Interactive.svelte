<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
import music
import random

def log(msg):
    print('<L ' + str(msg) + '>')

def dance_a():
    log("dance_a")
    ___ml(show a pattern and play a sound — e.g. display.show(Image.HEART) then music.play(music.JUMP_UP))

def dance_b():
    log("dance_b")
    ___ml(show something different — try Image.YES, Image.ARROW_E, or make up your own)

def dance_shake():
    log("dance_shake")
    ___ml(go wild — combine display, music, and sleep() calls)

while True:
    if button_a.was_pressed():
        dance_a()
    if button_b.was_pressed():
        dance_b()
    if accelerometer.was_gesture("shake"):
        dance_shake()
    sleep(100)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Fill in the body of each dance function — what the duck does when A is pressed, B is pressed, or it's shaken. Each move is yours to design. Use <code>display.show()</code>, <code>music.play()</code>, and <code>sleep()</code> to build the routine.
		<br /><br />
		<span class="text-(--color-night-soft)">Write each line of your code starting at the <em>left edge</em> of the textarea — indentation is handled automatically.</span>
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Choreography Log" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Press A or B, or shake the board. Each move runs the function you wrote. The Choreography Log above shows which move was triggered each time.
	</div>

	<YourTurn challenges={[
		'Add a 4th move triggered by logo touch: use pin_logo.is_touched() in the while loop.',
		'Make your shake move play all 3 dances in sequence with short sleeps between.',
		'Add random.choice([dance_a, dance_b, dance_shake])() and call it from a new logo-touch handler — surprise every time!'
	]} />
</div>
