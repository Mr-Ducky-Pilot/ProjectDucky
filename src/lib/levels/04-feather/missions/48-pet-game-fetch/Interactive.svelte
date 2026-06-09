<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

pos_x = 2.0
SPEED = ___(0.2)
fetches = 0
last_dir = 0

while True:
    target_x = 2 + accelerometer.get_x() / 350
    target_x = max(0, min(4, target_x))
    pos_x += (target_x - pos_x) * SPEED

    # detect crossing centre (fetch counter)
    dir_now = 1 if pos_x > 2.5 else (-1 if pos_x < 1.5 else last_dir)
    if dir_now != last_dir and dir_now != 0:
        fetches += 1
    last_dir = dir_now

    grid = [['0'] * 5 for _ in range(5)]
    grid[2][int(pos_x)] = '9'
    if fetches % 5 == 4:
        # tired face every 5 fetches
        grid[0] = list('00000')
        grid[4] = list('01110')
    display.show(Image(':'.join(''.join(r) for r in grid)))
    sleep(80)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Set <strong>SPEED</strong> — how fast the dot eases toward your tilt. Low values (0.05) = lazy duck. High (0.5) = hyper duck.
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="Play fetch"
		challenges={[
			'Tilt back and forth — count the fetches.',
			'Try SPEED=0.05. Watch the lag.',
			'Try SPEED=0.5. Watch the snap.'
		]}
	/>
</div>
