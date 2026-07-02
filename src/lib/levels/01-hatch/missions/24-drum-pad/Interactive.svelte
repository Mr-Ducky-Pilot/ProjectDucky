<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import YourTurn from '$lib/components/YourTurn.svelte';

	const ROWS = 4;
	const COLS = 16;
	const ROW_NAMES = ['Kick', 'Snare', 'Hat', 'Clap'];
	// Board tone (T: protocol — simple square-wave beeps, one pitch per row).
	const ROW_NOTES = ['C3', 'F4', 'A5', 'D5'];
	const ROW_MS = [120, 80, 40, 60]; // longer thump for kick, snappy for hat

	let grid = $state(Array.from({ length: ROWS }, () => new Array(COLS).fill(false)));
	let step = $state(-1);
	let playing = $state(false);
	let bpm = $state(110);

	// --- Local Web Audio drum synth (instant feedback, real percussive
	// timbre — the board can only play a single square-wave pitch per note,
	// so kick/snare/hat/clap all sounded the same there; this gives each one
	// actual character: pitched thump, noise-burst snare/hat/clap).
	let audioCtx: AudioContext | null = null;
	function ensureAudio(): AudioContext {
		if (!audioCtx) audioCtx = new AudioContext();
		return audioCtx;
	}
	function makeNoise(ctx: AudioContext): AudioBufferSourceNode {
		const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
		const data = buf.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
		const src = ctx.createBufferSource();
		src.buffer = buf;
		return src;
	}
	function playDrum(row: number) {
		const ctx = ensureAudio();
		const t = ctx.currentTime;
		if (row === 0) {
			// Kick: sine sweeping down with a quick decay
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(150, t);
			osc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
			gain.gain.setValueAtTime(0.9, t);
			gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
			osc.connect(gain).connect(ctx.destination);
			osc.start(t);
			osc.stop(t + 0.16);
		} else if (row === 1) {
			// Snare: tonal body + noise burst
			const osc = ctx.createOscillator();
			const oscGain = ctx.createGain();
			osc.type = 'triangle';
			osc.frequency.setValueAtTime(190, t);
			oscGain.gain.setValueAtTime(0.4, t);
			oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
			osc.connect(oscGain).connect(ctx.destination);
			osc.start(t);
			osc.stop(t + 0.09);
			const noise = makeNoise(ctx);
			const noiseGain = ctx.createGain();
			noiseGain.gain.setValueAtTime(0.5, t);
			noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
			noise.connect(noiseGain).connect(ctx.destination);
			noise.start(t);
			noise.stop(t + 0.1);
		} else if (row === 2) {
			// Hat: short bright high-passed noise burst
			const noise = makeNoise(ctx);
			const hp = ctx.createBiquadFilter();
			hp.type = 'highpass';
			hp.frequency.value = 6000;
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(0.3, t);
			gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
			noise.connect(hp).connect(gain).connect(ctx.destination);
			noise.start(t);
			noise.stop(t + 0.05);
		} else {
			// Clap: band-passed noise burst, slightly longer than the hat
			const noise = makeNoise(ctx);
			const bp = ctx.createBiquadFilter();
			bp.type = 'bandpass';
			bp.frequency.value = 1500;
			const gain = ctx.createGain();
			gain.gain.setValueAtTime(0.5, t);
			gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
			noise.connect(bp).connect(gain).connect(ctx.destination);
			noise.start(t);
			noise.stop(t + 0.1);
		}
	}

	$effect(() => {
		if (!playing) return;
		const intervalMs = 60000 / bpm / 2; // 8th notes
		const id = setInterval(() => {
			step = (step + 1) % COLS;
			const tones = [];
			for (let r = 0; r < ROWS; r++) {
				if (grid[r][step]) {
					tones.push({ note: ROW_NOTES[r], ms: ROW_MS[r] });
					playDrum(r);
				}
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
		if (grid[r][c]) playDrum(r); // preview the sound the moment it's turned on
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
