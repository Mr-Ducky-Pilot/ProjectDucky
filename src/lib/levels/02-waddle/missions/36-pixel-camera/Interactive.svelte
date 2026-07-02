<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

frames = ___([])   # an empty list — frames.append() will add snapshots to it

def snap():          # def creates a reusable block, run later by calling snap()
    row = []
    for y in range(5):
        for x in range(5):
            row.append(display.get_pixel(x, y))
    return row        # sends this value back to whoever called snap()

def show(row):
    for y in range(5):
        for x in range(5):
            display.set_pixel(x, y, row[y * 5 + x])

# starting design — change it later if you want
display.show(Image.HEART)

while True:
    if button_a.was_pressed():
        frames.append(___(snap()))
    if button_b.was_pressed():
        for f in frames:         # loop over every saved frame, in order
            show(f)
            sleep(___(300))
    sleep(50)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Three blanks: <strong>start the list empty</strong>, <strong>append the snapped
		frame</strong>, and <strong>set the playback speed in milliseconds</strong>.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Press A four times after drawing different shapes, then B.',
			'Change the playback to 100ms — flipbook!',
			'Can you tell a story in 6 frames?'
		]}
	/>
</div>
