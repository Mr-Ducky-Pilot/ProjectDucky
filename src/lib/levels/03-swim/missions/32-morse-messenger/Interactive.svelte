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

DASH_MS = ___(300)

MORSE = ___ml({'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.'} — add more letters!)

def log(msg):
    print('<L ' + str(msg) + '>')

current = ''
pressed_at = 0

while True:
    if button_a.is_pressed() and pressed_at == 0:
        pressed_at = utime.ticks_ms()
    elif not button_a.is_pressed() and pressed_at > 0:
        duration = utime.ticks_diff(utime.ticks_ms(), pressed_at)
        pressed_at = 0
        if duration >= DASH_MS:
            current += '-'
            display.show('-')
        else:
            current += '.'
            display.show('.')

    if button_b.was_pressed():
        for letter, code in MORSE.items():
            if code == current:
                radio.send(letter)
                log("sent:" + letter)
                break
        current = ''
        display.clear()

    msg = radio.receive()
    if msg:
        display.scroll(msg)
        log("received:" + msg)

    sleep(20)`;

	let code = $state('');
	let allFilled = $state(false);

	const morseChart: [string, string][] = [
		['A', '·−'], ['B', '−···'], ['C', '−·−·'], ['D', '−··'], ['E', '·'], ['F', '··−·'],
		['G', '−−·'], ['H', '····'], ['I', '··'], ['J', '·−−−'], ['K', '−·−'], ['L', '·−··'],
		['M', '−−'], ['N', '−·'], ['O', '−−−'], ['P', '·−−·'], ['Q', '−−·−'], ['R', '·−·'],
		['S', '···'], ['T', '−'], ['U', '··−'], ['V', '···−'], ['W', '·−−'], ['X', '−··−'],
		['Y', '−·−−'], ['Z', '−−··']
	];
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Write the <code>MORSE</code> dictionary (at least A–F to start) and tune the dash threshold. The rest of the logic is given — your dict is the heart of the messenger.
	</div>

	<!-- Morse reference -->
	<div class="overflow-hidden rounded-2xl bg-(--color-night-ink)">
		<div class="border-b border-white/10 px-4 py-2 text-xs text-white/40">Morse Code Reference</div>
		<div class="grid grid-cols-4 gap-x-2 gap-y-1 p-4 font-mono text-xs sm:grid-cols-6">
			{#each morseChart as [letter, code]}
				<div class="flex gap-1.5">
					<span class="font-bold text-(--color-duck-yellow)">{letter}</span>
					<span class="text-white/60">{code}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="rounded-xl bg-(--color-mist) p-3 text-sm text-(--color-night-soft)">
		💡 In your code, use <code>·</code> = <code>.</code> and <code>−</code> = <code>-</code>. Example: <code>'A': '.-'</code>
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Messenger Log" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>How to use:</strong> Tap A quickly = dot. Hold A longer than {300}ms = dash. Press B to send the letter. The other board scrolls the decoded letter. The Messenger Log shows every sent/received event.
	</div>

	<YourTurn challenges={[
		'Add all 26 letters A–Z to your MORSE dictionary (use the chart above).',
		'Play sounds as you tap: music.pitch(1200, 80) for dot, music.pitch(600, 250) for dash.',
		'Write a send_word(word) function that encodes and sends each letter with a 500ms gap between.'
	]} />
</div>
