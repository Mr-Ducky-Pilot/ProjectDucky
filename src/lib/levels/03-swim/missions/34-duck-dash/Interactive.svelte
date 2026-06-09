<script lang="ts">
	import { onMount } from 'svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import SerialMonitor from '$lib/components/SerialMonitor.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *
import radio, random, utime

radio.on()
radio.config(channel=7)

my_x, my_y = 2, 2
their_x, their_y = -1, -1
score = 0
WIN = ___(5)
drops = [[random.randint(0, 4), random.randint(0, 4)] for _ in range(___(2))]
last_tx = utime.ticks_ms()

def log(msg):
    print('<L ' + str(msg) + '>')

def move():
    global my_x, my_y
    ax = accelerometer.get_x()
    ay = accelerometer.get_y()
    ___ml(if ax > 400 move right (my_x +1, clamped to 4), if ax < -400 move left (my_x -1, clamped to 0) — same for ay and my_y)

def draw():
    display.clear()
    ___ml(set each drop at brightness 3, set opponent at brightness 6 if their_x >= 0, set my position at brightness 9)

while True:
    move()

    msg = radio.receive()
    if msg and ',' in msg:
        ___ml(split msg on ',' and update their_x and their_y as integers)

    now = utime.ticks_ms()
    if utime.ticks_diff(now, last_tx) >= 100:
        ___ml(send my position as "my_x,my_y" string over radio, update last_tx, log("pos:" + ...))

    for drop in drops[:]:
        ___ml(if [my_x, my_y] matches the drop, remove it, add a new random drop, score++, log the score, break)

    if score >= WIN:
        display.scroll("WIN! " + str(score))
        log("game:win")
        break

    draw()
    sleep(80)`;

	let code = $state('');
	let allFilled = $state(false);

	// Live game state from board logs
	type GameState = { myScore: number; myPos: [number, number] | null };
	let gameState = $state<GameState>({ myScore: 0, myPos: null });

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type !== 'log') return;
			const scoreMatch = e.text.match(/^score:(\d+)/);
			if (scoreMatch) gameState = { ...gameState, myScore: parseInt(scoreMatch[1]) };
			const posMatch = e.text.match(/^pos:(\d+),(\d+)/);
			if (posMatch) gameState = { ...gameState, myPos: [parseInt(posMatch[1]), parseInt(posMatch[2])] };
		});
		return off;
	});
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-night-ink)">
		<strong>Your mission (capstone):</strong> Write five code sections — movement with tilt, the LED renderer, the radio receive handler, the broadcast, and the drop collection logic. Each one is independent; tackle them one at a time.
	</div>

	<div class="grid grid-cols-2 gap-2 text-xs">
		<div class="rounded-lg bg-(--color-mist) p-3">
			<p class="mb-1 font-bold text-(--color-night-ink)">Game rules</p>
			<ul class="space-y-1 text-(--color-night-soft)">
				<li>🦆 Tilt to move your duck (bright dot)</li>
				<li>💧 Collect dim drops to score</li>
				<li>👥 Opponent shows as medium dot</li>
				<li>🏆 First to WIN drops wins</li>
			</ul>
		</div>
		<div class="rounded-lg bg-(--color-mist) p-3">
			<p class="mb-1 font-bold text-(--color-night-ink)">Brightness guide</p>
			<ul class="space-y-1 text-(--color-night-soft)">
				<li>9 = you (brightest)</li>
				<li>6 = opponent (medium)</li>
				<li>3 = drops (dim)</li>
				<li>0 = off</li>
			</ul>
		</div>
	</div>

	{#if gameState.myScore > 0}
		<div class="flex items-center gap-3 rounded-xl bg-(--color-leaf-green)/10 p-3">
			<span class="text-2xl">💧</span>
			<div>
				<p class="font-display font-extrabold text-(--color-leaf-green)">{gameState.myScore} drop{gameState.myScore === 1 ? '' : 's'} collected!</p>
				{#if gameState.myPos}
					<p class="text-xs text-(--color-night-soft)">Position: ({gameState.myPos[0]}, {gameState.myPos[1]})</p>
				{/if}
			</div>
		</div>
	{/if}

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<SerialMonitor title="Game Feed" />

	<div class="rounded-xl bg-(--color-mist) p-4 text-sm text-(--color-night-soft)">
		<strong>After flashing:</strong> Flash to both boards. Tilt to move — your bright dot chases the dim drops. Your opponent appears as a medium-brightness blip. The Game Feed logs every score and position event.
	</div>

	<YourTurn challenges={[
		'Add collision: if [my_x, my_y] == [their_x, their_y] after move(), score -= 1 (min 0).',
		'Speed up: reduce sleep(80) to sleep(40) once score >= WIN // 2 (halfway there).',
		'Add a button A "dash": press A to move 2 steps in the tilt direction for one frame.'
	]} />
</div>
