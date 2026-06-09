<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import YourTurn from '$lib/components/YourTurn.svelte';

	const ROWS = 4;
	const COLS = 16;
	const ROW_NAMES = ['Kick', 'Snare', 'Hat', 'Clap'];
	const ROW_NOTES = ['C3', 'F4', 'A5', 'D5'];

	let grid = $state(Array.from({ length: ROWS }, () => new Array(COLS).fill(false)));
	let step = $state(-1);
	let playing = $state(false);
	let bpm = $state(110);

	$effect(() => {
		if (!playing) return;
		const intervalMs = 60000 / bpm / 2; // 8th notes
		const id = setInterval(() => {
			step = (step + 1) % COLS;
			const tones = [];
			for (let r = 0; r < ROWS; r++) {
				if (grid[r][step]) tones.push({ note: ROW_NOTES[r], ms: 60 });
			}
			if (tones.length) {
				void connection.send({ type: 'tone', sequence: tones }).catch(() => {});
			}
			const bits = Array(25).fill(false);
			const col = Math.floor((step / COLS) * 5);
			for (let r = 0; r < 5; r++) bits[r * 5 + col] = true;
			void connection.send({ type: 'matrix', bits }).catch(() => {});
		}, intervalMs);
		return () => clearInterval(id);
	});

	function toggle(r: number, c: number) {
		grid[r][c] = !grid[r][c];
		grid = grid;
	}

	function clear() {
		grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
	}

	function preset(name: 'rock' | 'house' | 'tres') {
		clear();
		if (name === 'rock') {
			[0, 4, 8, 12].forEach((c) => (grid[0][c] = true));
			[4, 12].forEach((c) => (grid[1][c] = true));
			[0, 2, 4, 6, 8, 10, 12, 14].forEach((c) => (grid[2][c] = true));
		} else if (name === 'house') {
			[0, 4, 8, 12].forEach((c) => (grid[0][c] = true));
			[2, 6, 10, 14].forEach((c) => (grid[2][c] = true));
			[4, 12].forEach((c) => (grid[1][c] = true));
		} else {
			[0, 3, 6, 10, 12].forEach((c) => (grid[3][c] = true));
			[0, 8].forEach((c) => (grid[0][c] = true));
		}
		grid = grid;
	}
</script>

<div class="flex flex-col gap-4">
	<div class="flex flex-wrap items-center gap-3">
		<button
			class="rounded-full bg-night-ink px-4 py-2 font-display font-bold text-white"
			onclick={() => (playing = !playing)}
		>
			{playing ? '■ Stop' : '▶ Play'}
		</button>
		<label class="text-xs uppercase tracking-wider text-night-soft">BPM</label>
		<input type="range" min="60" max="180" bind:value={bpm} class="w-32" />
		<span class="font-mono text-sm">{bpm}</span>
		<button class="rounded-full bg-mist px-3 py-1 text-sm font-bold" onclick={clear}>Clear</button>
		<button class="rounded-full bg-mist px-3 py-1 text-sm font-bold" onclick={() => preset('rock')}>
			Rock
		</button>
		<button class="rounded-full bg-mist px-3 py-1 text-sm font-bold" onclick={() => preset('house')}>
			House
		</button>
		<button class="rounded-full bg-mist px-3 py-1 text-sm font-bold" onclick={() => preset('tres')}>
			Tresillo
		</button>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full border-separate" style="border-spacing: 2px;">
			<tbody>
				{#each grid as row, r}
					<tr>
						<th class="pr-2 text-right text-xs font-bold text-night-soft">{ROW_NAMES[r]}</th>
						{#each row as cell, c}
							<td>
								<button
									class="size-7 rounded transition"
									class:bg-duck-yellow={cell}
									class:bg-mist={!cell}
									class:ring-2={step === c}
									class:ring-night-ink={step === c}
									onclick={() => toggle(r, c)}
								></button>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<YourTurn
		title="Beat challenges"
		challenges={[
			'Build a basic rock beat — kick on 1 & 9, snare on 5 & 13.',
			'Halve the BPM and add hi-hats on every step.',
			'Make a beat that loops for 30 seconds and you can\'t stop nodding to.'
		]}
	/>
</div>
