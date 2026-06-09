<script lang="ts">
	import PianoKeys from '$lib/components/PianoKeys.svelte';
	import { connection } from '$lib/stores/connection';
	import { setMood } from '$lib/stores/ducky';

	type Note = { name: string; freq: number };
	let recording = $state<Note[]>([]);
	let playing = $state(false);
	let audioOn = $state(true);

	let audioCtx: AudioContext | null = null;
	function getCtx() {
		if (!audioCtx) audioCtx = new AudioContext();
		return audioCtx;
	}

	function preview(freq: number, ms: number) {
		if (!audioOn) return;
		try {
			const ctx = getCtx();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = 'square';
			osc.frequency.value = freq;
			gain.gain.setValueAtTime(0.04, ctx.currentTime);
			gain.gain.linearRampToValueAtTime(0, ctx.currentTime + ms / 1000);
			osc.connect(gain).connect(ctx.destination);
			osc.start();
			osc.stop(ctx.currentTime + ms / 1000 + 0.05);
		} catch { /* SSR / no AudioContext */ }
	}

	function press(note: Note) {
		recording = [...recording, note];
		preview(note.freq, 200);
	}

	async function play() {
		if (recording.length === 0 || playing) return;
		playing = true;
		setMood('celebrating');

		// Browser preview
		if (audioOn) {
			recording.forEach((n, i) => setTimeout(() => preview(n.freq, 250), i * 280));
		}

		// Send to chip
		try {
			await connection.send({
				type: 'tone',
				sequence: recording.map((n) => ({ note: n.name, ms: 250 }))
			});
			void connection.send({ type: 'oled-text', lines: ['Welcome Jingle', `${recording.length} notes`, 'Playing...'] }).catch(() => {});
		} catch { /* not connected */ }

		setTimeout(() => { playing = false; setMood('idle'); }, recording.length * 280 + 300);
	}

	function clear() {
		recording = [];
	}

	const noteLabel = (n: Note) => n.name.replace(/\d/, '');
</script>

<div class="flex flex-col gap-5">
	<PianoKeys onpress={press} {recording} />

	<div class="flex flex-wrap items-center justify-center gap-3">
		<button
			type="button"
			onclick={play}
			disabled={recording.length === 0 || playing}
			class="pop-btn pop-btn--yellow"
		>
			{playing ? '♪ Playing…' : 'Play on Ducky ▶'}
		</button>
		<button type="button" onclick={clear} class="pop-btn pop-btn--ghost">Clear ✕</button>
		<button
			type="button"
			onclick={() => (audioOn = !audioOn)}
			class="rounded-full border-2 border-(--color-mist) bg-white px-3 py-2 text-sm font-bold transition hover:bg-(--color-mist)"
			title="Toggle browser sound"
		>
			{audioOn ? '🔊' : '🔇'}
		</button>
	</div>

	{#if recording.length > 0}
		<div class="flex flex-wrap justify-center gap-1">
			{#each recording as note, i}
				<span class="rounded-full bg-(--color-pond-blue)/15 px-2 py-0.5 font-mono text-xs font-bold text-(--color-pond-deep)">
					{noteLabel(note)}
				</span>
			{/each}
		</div>
	{:else}
		<p class="text-center text-xs text-(--color-night-soft)">
			Tap keys to build your jingle — Start Ducky first so it can play back.
		</p>
	{/if}

	<div class="rounded-2xl bg-(--color-pond-blue)/10 p-4">
		<p class="mb-1 text-xs font-extrabold tracking-widest text-(--color-pond-deep) uppercase">Starter melody</p>
		<p class="text-sm text-(--color-night-soft)">Twinkle: <span class="font-mono">C C G G A A G · F F E E D D C</span></p>
	</div>
</div>
