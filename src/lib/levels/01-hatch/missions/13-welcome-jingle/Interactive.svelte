<script lang="ts">
	import PianoKeys from '$lib/components/PianoKeys.svelte';
	import { connection } from '$lib/stores/connection';

	type Props = { complete: () => void };
	let { complete }: Props = $props();

	type Note = { name: string; freq: number };
	let recording = $state<Note[]>([]);

	// Tiny browser preview using WebAudio so kids hear it without flashing.
	let audioCtx: AudioContext | null = null;
	function preview(freq: number, ms: number) {
		if (!audioCtx) audioCtx = new AudioContext();
		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();
		osc.type = 'square';
		osc.frequency.value = freq;
		gain.gain.value = 0.04;
		osc.connect(gain).connect(audioCtx.destination);
		osc.start();
		osc.stop(audioCtx.currentTime + ms / 1000);
	}

	function press(note: Note) {
		recording = [...recording, note];
		preview(note.freq, 200);
	}

	async function play() {
		if (recording.length === 0) return;
		// Browser preview
		recording.forEach((n, i) => setTimeout(() => preview(n.freq, 250), i * 280));
		// Send to chip
		await connection.send({
			type: 'tone',
			sequence: recording.map((n) => ({ note: n.name, ms: 250 }))
		});
		complete();
	}

	function clear() {
		recording = [];
	}
</script>

<div class="flex flex-col gap-5">
	<PianoKeys onpress={press} {recording} />
	<div class="flex flex-wrap justify-center gap-3">
		<button type="button" onclick={play} class="pop-btn pop-btn--yellow" disabled={recording.length === 0}>
			Play on Ducky ▶
		</button>
		<button type="button" onclick={clear} class="pop-btn pop-btn--ghost">Clear</button>
	</div>
	<p class="text-center text-xs text-(--color-night-soft)">
		{recording.length} note{recording.length === 1 ? '' : 's'} ready
	</p>
</div>
