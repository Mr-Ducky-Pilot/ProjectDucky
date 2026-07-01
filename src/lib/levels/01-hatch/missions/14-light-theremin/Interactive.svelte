<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	const SCALES: Record<string, string[]> = {
		pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
		major:      ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
		minor:      ['C4', 'D4', 'D#4', 'F4', 'G4', 'G#4', 'A#4', 'C5'],
		spooky:     ['C4', 'D4', 'D#4', 'F#4', 'G4', 'G#4', 'B4', 'C5']
	};

	const NOTE_FREQS: Record<string, number> = {
		C4: 262, 'D4': 294, 'D#4': 311, E4: 330, F4: 349, 'F#4': 370,
		G4: 392, 'G#4': 415, A4: 440, 'A#4': 466, B4: 494, C5: 523, 'D5': 587, 'E5': 659
	};

	let scale = $state('pentatonic');
	let lux = $state(128);
	let hasData = $state(false);
	let audioOn = $state(false);
	let lastIdx = $state(-1);

	let audioCtx: AudioContext | null = null;
	let osc: OscillatorNode | null = null;
	let gainNode: GainNode | null = null;

	function startAudio() {
		if (audioCtx) return;
		audioCtx = new AudioContext();
		osc = audioCtx.createOscillator();
		gainNode = audioCtx.createGain();
		osc.type = 'sine';
		gainNode.gain.value = 0;
		osc.connect(gainNode).connect(audioCtx.destination);
		osc.start();
		audioOn = true;
	}

	function stopAudio() {
		if (!audioCtx) return;
		osc?.stop();
		audioCtx.close();
		audioCtx = null; osc = null; gainNode = null;
		audioOn = false;
	}

	const currentNote = $derived.by(() => {
		const notes = SCALES[scale];
		const idx = Math.max(0, Math.min(notes.length - 1, Math.floor((lux / 256) * notes.length)));
		return notes[idx];
	});

	// Update pitch whenever note changes
	$effect(() => {
		const notes = SCALES[scale];
		const idx = Math.max(0, Math.min(notes.length - 1, Math.floor((lux / 256) * notes.length)));
		if (idx === lastIdx) return;
		lastIdx = idx;
		if (audioOn && osc && gainNode && audioCtx) {
			osc.frequency.setValueAtTime(NOTE_FREQS[notes[idx]] ?? 262, audioCtx.currentTime);
			gainNode.gain.setTargetAtTime(0.06, audioCtx.currentTime, 0.02);
			gainNode.gain.setTargetAtTime(0, audioCtx.currentTime + 0.2, 0.05);
		}
		void connection.send({ type: 'tone', sequence: [{ note: notes[idx], ms: 120 }] }).catch(() => {});
	});

	onMount(() => {
		let off: (() => void) | null = null;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor('light', ([v]) => {
					lux = v;
					hasData = true;
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());

		return () => {
			off?.(); offReady();
			stopAudio();
		};
	});
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-wrap gap-2">
		{#each Object.keys(SCALES) as s}
			<button
				type="button"
				onclick={() => { scale = s; lastIdx = -1; }}
				class="rounded-full px-3 py-1.5 text-sm font-bold capitalize transition"
				class:bg-(--color-night-ink)={scale === s}
				class:text-white={scale === s}
				class:bg-(--color-mist)={scale !== s}
				class:text-(--color-night-soft)={scale !== s}
			>
				{s}
			</button>
		{/each}
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		<div class="flex flex-col gap-3">
			<SensorMeter value={lux} min={0} max={255} label="Light reading" color="#ffd23a" />
			<div class="flex items-center justify-between gap-3">
				<button
					type="button"
					onclick={() => (audioOn ? stopAudio() : startAudio())}
					class="pop-btn pop-btn--ghost flex items-center gap-2 text-sm"
				>
					{audioOn ? '🔊 Browser sound on' : '🔇 Browser sound off'}
				</button>
			</div>
		</div>

		<div class="card flex flex-col items-center justify-center gap-2 rounded-3xl p-6">
			<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Now playing</p>
			<p class="font-mono text-5xl font-extrabold">{currentNote}</p>
			<p class="text-xs text-(--color-night-soft)">Cover the chip to go lower</p>
		</div>
	</div>

	{#if !hasData}
		<p class="text-center text-xs text-(--color-night-soft)">
			Start Ducky first — then hover your hand over the chip and move it slowly.
		</p>
	{/if}

	<YourTurn challenges={[
		'Switch to the major scale and slowly move your hand to play 3 different notes in a row.',
		'Find note G4 and hold it steady for 3 seconds by covering the chip just the right amount.',
		'Switch to the spooky scale and improvise — can you make it sound like a ghost?'
	]} />
</div>
