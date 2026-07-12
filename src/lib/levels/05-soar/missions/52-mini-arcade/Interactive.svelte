<script lang="ts">
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import MicrobitPreview from '$lib/components/MicrobitPreview.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const INITIAL = `from microbit import *
import music

# 5x5 maze. 1 = wall, 0 = open
WALLS = [
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,0,1,0,1],
    [0,1,0,0,0],
    [0,0,0,1,0],
]
WIN_X = 4
WIN_Y = 4

x, y = 0, 0
score = 0

while True:
    # Draw
    grid = [row[:] for row in WALLS]
    grid[WIN_Y][WIN_X] = 4
    grid[y][x] = 9
    rows = [''.join(str(c) for c in r) for r in grid]
    display.show(Image(':'.join(rows)))

    # Move
    ax = accelerometer.get_x()
    ay = accelerometer.get_y()
    nx, ny = x, y
    if ax >  400: nx = min(4, x + 1)
    elif ax < -400: nx = max(0, x - 1)
    if ay >  400: ny = min(4, y + 1)
    elif ay < -400: ny = max(0, y - 1)

    if WALLS[ny][nx] == 0:
        x, y = nx, ny

    if x == WIN_X and y == WIN_Y:
        music.play(['C5:4','E5:4','G5:4'])
        display.scroll("WIN!")
        score += 1
        x, y = 0, 0
    sleep(200)`;

	let code = $state(INITIAL);
</script>

<div class="flex flex-col gap-5">
	<div class="grid gap-4 md:grid-cols-[1fr_auto]">
		<FreePythonEditor initial={INITIAL} bind:code />
		<div class="md:w-64"><MicrobitPreview {code} /></div>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<QrShareCard variant="remix" remix={{ missionId: '52-mini-arcade', code }} title="Share your maze" />

	<YourTurn
		title="Build on it"
		challenges={[
			'Change the maze layout.',
			'Add a timer.',
			'Use a button to reset the maze.'
		]}
	/>
</div>
