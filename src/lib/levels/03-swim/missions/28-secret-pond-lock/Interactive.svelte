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

COMBO = [___(0), ___(1), ___(0)]
entry = []

def show_locked():
    display.show(___(Image.ANGRY))

def unlock():
    display.show(Image.HAPPY)
    log("unlocked")

def reject():
    display.show(Image.NO)
    sleep(500)
    display.clear()
    log("locked")

show_locked()

while True:
    if button_a.was_pressed():
        ___ml(append 0 to entry and show '0' on the display)

    if button_b.was_pressed():
        ___ml(append 1 to entry and show '1' on the display)

    if len(entry) == len(COMBO):
        ___ml(if entry matches COMBO call unlock() else call reject(), then reset entry to [])

    sleep(100)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission:</strong> Choose your combination (the three <code>COMBO</code> values are 0s or 1s), pick a locked face, and write the three logic blocks: collecting A presses, collecting B presses, and checking the full entry against the combo.
		<br /><br />
		<span class="text-(--color-night-soft)">Write each code block starting at the left edge — indentation inside <code>if</code> blocks is added automatically.</span>
	</div>

	<div class="grid grid-cols-3 gap-2 text-center text-xs text-(--color-night-soft)">
		<div class="rounded-lg bg-(--color-mist) p-2">
			<div class="font-mono text-lg font-bold text-(--color-night-ink)">A</div>
			<div>= 0</div>
		</div>
		<div class="rounded-lg bg-(--color-mist) p-2">
			<div class="font-mono text-lg font-bold text-(--color-night-ink)">B</div>
			<div>= 1</div>
		</div>
		<div class="rounded-lg bg-(--color-mist) p-2">
			<div class="font-mono text-lg font-bold text-(--color-night-ink)">COMBO</div>
			<div>your secret</div>
		</div>
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Lock Events" filter={(t) => t === 'unlocked' || t === 'locked'} />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> The display shows your locked face. Press A for 0, B for 1 to enter digits.
		When you've entered as many digits as your combo, it checks — happy face for correct, NO for wrong.
	</div>

	<YourTurn challenges={[
		'Add a wrong-entry counter — lock the board (sleep 5000) after 3 wrong guesses.',
		'Make shake reset entry to [] so the person trying to guess can start over.',
		'HARD: Change COMBO to length 4 and update show_locked() to scroll a "🔒" symbol.'
	]} />
</div>
