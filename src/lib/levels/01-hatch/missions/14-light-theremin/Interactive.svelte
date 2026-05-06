<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	const SCALES = {
		pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
		major: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
		minor: ['C4', 'D4', 'D#4', 'F4', 'G4', 'G#4', 'A#4', 'C5'],
		spooky: ['C4', 'D4', 'D#4', 'F#4', 'G4', 'G#4', 'B4', 'C5']
	} as const;

	type ScaleName = keyof typeof SCALES;

	let scale = $state<ScaleName>('pentatonic');
	let lux = $state(120);
	let lastIdx = $state(-1);

	const NOTE_FREQS: Record<string, number> = {
		C4: 262, 'D4': 294, 'D#4': 311, E4: 330, F4: 349, 'F#4': 370, G4: 392, 'G#4': 415, A4: 440, 'A#4': 466, B4: 494, C5: 523, 'D5': 587, 'E5': 659
	};

	let audioCtx: AudioContext | null = null;
	let osc: OscillatorNode | null = null;
	let gain: GainNode | null = null;

	function ensureAudio() {
		if (audioCtx) return;
		audioCtx = new AudioContext();
		osc = audioCtx.createOscillator();
		gain = audioCtx.createGain();
		osc.type = 'square';
		gain.gain.value = 0.0;
		osc.connect(gain).connect(audioCtx.destination);
		osc.start();
	}

	$effect(() => {
		const notes = SCALES[scale];
		const idx = Math.floor((lux / 256) * notes.length);
		const safe = Math.max(0, Math.min(notes.length - 1, idx));
		if (safe === lastIdx) return;
		lastIdx = safe;
		if (osc && gain && audioCtx) {
			osc.frequency.setValueAtTime(NOTE_FREQS[notes[safe]] ?? 262, audioCtx.currentTime);
			gain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 0.02);
			gain.gain.setTargetAtTime(0.0, audioCtx.currentTime + 0.18, 0.05);
		}
		void connection.send({ type: 'tone', sequence: [{ note: notes[safe], ms: 200 }] });
	});

	onMount(() => {
		let off: (() => void) | null = null;
		connection.streamSensor('light', ([v]) => (lux = v)).then((u) => {
			off = u;
		});
		return () => {
			off?.();
			osc?.stop();
			audioCtx?.close();
		};
	});

	const currentNote = $derived(SCALES[scale][Math.max(0, Math.min(SCALES[scale].length - 1, Math.floor((lux / 256) * SCALES[scale].length)))]);
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-wrap gap-2">
		{#each Object.keys(SCALES) as s}
			<button
				type="button"
				onclick={() => {
					ensureAudio();
					scale = s as ScaleName;
				}}
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

	<button type="button" onclick={ensureAudio} class="pop-btn pop-btn--blue self-start">
		Turn on browser sound
	</button>

	<SensorMeter value={lux} min={0} max={255} label="Light reading" color="#ffd23a" />

	<div class="card flex items-center justify-center gap-3 rounded-3xl p-6">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Now playing
		</span>
		<span class="font-mono text-3xl font-extrabold">{currentNote}</span>
	</div>
</div>
