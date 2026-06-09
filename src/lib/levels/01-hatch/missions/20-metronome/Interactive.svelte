<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let bpm = $state(120);
	let running = $state(false);
	let beat = $state(false);   // toggles each tick for visual flash
	let beatCount = $state(0);
	let audioOn = $state(true);
	let tapTimes: number[] = [];

	// Accent: first beat of every 4 is louder
	const ACCENT_NOTE = 'C5';
	const BEAT_NOTE   = 'G4';

	let interval: ReturnType<typeof setInterval> | null = null;
	let audioCtx: AudioContext | null = null;

	function playBrowserBeep(accent: boolean) {
		if (!audioOn) return;
		try {
			if (!audioCtx) audioCtx = new AudioContext();
			const osc = audioCtx.createOscillator();
			const gain = audioCtx.createGain();
			osc.type = 'square';
			osc.frequency.value = accent ? 523 : 392;
			gain.gain.setValueAtTime(accent ? 0.06 : 0.04, audioCtx.currentTime);
			gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.07);
			osc.connect(gain).connect(audioCtx.destination);
			osc.start();
			osc.stop(audioCtx.currentTime + 0.1);
		} catch { /* no AudioContext */ }
	}

	function tick() {
		beat = !beat;
		beatCount++;
		const accent = beatCount % 4 === 1;
		const note = accent ? ACCENT_NOTE : BEAT_NOTE;

		// Browser audio
		playBrowserBeep(accent);

		// Board: flash matrix + beep
		const flashBits = beat ? Array(25).fill(true) : Array(25).fill(false);
		void connection.send({ type: 'matrix', bits: flashBits }).catch(() => {});
		void connection.send({ type: 'tone', sequence: [{ note, ms: 60 }] }).catch(() => {});
	}

	function start() {
		if (running) return;
		running = true;
		beatCount = 0;
		beat = false;
		tick();
		interval = setInterval(tick, Math.round(60000 / bpm));
		void connection.send({ type: 'oled-text', lines: ['Metronome', `BPM: ${bpm}`, 'Running...'] }).catch(() => {});
	}

	function stop() {
		running = false;
		if (interval) { clearInterval(interval); interval = null; }
		beat = false;
		void connection.send({ type: 'matrix', bits: Array(25).fill(false) }).catch(() => {});
		void connection.send({ type: 'oled-text', lines: ['Metronome', `BPM: ${bpm}`, 'Stopped'] }).catch(() => {});
	}

	function toggle() {
		if (running) stop(); else start();
	}

	function onBpmChange() {
		if (!running) {
			void connection.send({ type: 'oled-text', lines: ['Metronome', `BPM: ${bpm}`] }).catch(() => {});
		}
		if (running) { stop(); start(); }
	}

	function tap() {
		const now = performance.now();
		tapTimes = [...tapTimes, now].slice(-8);
		if (tapTimes.length >= 2) {
			const intervals = tapTimes.slice(1).map((t, i) => t - tapTimes[i]);
			const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
			bpm = Math.max(30, Math.min(240, Math.round(60000 / avg)));
			if (running) { stop(); start(); }
		}
	}

	const beatDots = $derived(
		Array.from({ length: 25 }, (_, i) => {
			if (!running) return false;
			const row = Math.floor(i / 5);
			const col = i % 5;
			const accent = beatCount % 4 === 1;
			return beat ? (accent ? true : row === 2 && col === 2) : false;
		})
	);

	onMount(() => () => stop());
</script>

<div class="flex flex-col items-center gap-6">
	<!-- Big BPM display -->
	<div class="flex flex-col items-center">
		<p class="font-display text-8xl font-extrabold leading-none" style="color: {running ? '#ffd23a' : '#5a5f7a'}">{bpm}</p>
		<p class="text-sm font-bold text-(--color-night-soft) uppercase tracking-widest">BPM</p>
	</div>

	<!-- Beat indicator -->
	<LedMatrix bits={beatDots} size={160} color="#ffd23a" />

	<!-- BPM slider -->
	<div class="w-full max-w-sm">
		<input
			type="range"
			min={30}
			max={240}
			step={1}
			bind:value={bpm}
			oninput={onBpmChange}
			class="w-full accent-(--color-duck-yellow)"
		/>
		<div class="mt-1 flex justify-between text-xs text-(--color-night-soft)">
			<span>30 Largo</span>
			<span>120 Allegro</span>
			<span>240 Presto</span>
		</div>
	</div>

	<!-- Controls -->
	<div class="flex flex-wrap items-center justify-center gap-3">
		<button
			type="button"
			onclick={toggle}
			class="pop-btn text-xl"
			class:pop-btn--yellow={!running}
			class:pop-btn--ghost={running}
			style="min-width: 160px;"
		>
			{running ? '⏹ Stop' : '▶ Start'}
		</button>

		<button
			type="button"
			onclick={tap}
			class="pop-btn pop-btn--blue"
		>
			👆 Tap BPM
		</button>

		<button
			type="button"
			onclick={() => (audioOn = !audioOn)}
			class="rounded-full border-2 border-(--color-mist) bg-white px-3 py-2 text-sm font-bold transition hover:bg-(--color-mist)"
		>
			{audioOn ? '🔊' : '🔇'}
		</button>
	</div>

	<!-- Common tempos -->
	<div class="flex flex-wrap justify-center gap-2">
		{#each [
			{ name: 'Slow waltz', value: 84 },
			{ name: 'March', value: 120 },
			{ name: 'Dance', value: 160 }
		] as preset}
			<button
				type="button"
				onclick={() => { bpm = preset.value; onBpmChange(); }}
				class="rounded-full bg-(--color-mist) px-3 py-1.5 text-xs font-bold text-(--color-night-soft) transition hover:bg-(--color-duck-yellow) hover:text-(--color-night-ink)"
			>
				{preset.name} ({preset.value})
			</button>
		{/each}
	</div>

	<YourTurn challenges={[
		'Tap the BPM button along to a song you know — what BPM is it?',
		'Set to 120 BPM (march tempo) and clap in time for 30 seconds without losing the beat.',
		'Try 180 BPM — that\'s dance music speed! Can you clap every single beat?'
	]} />
</div>
