<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import { setMood } from '$lib/stores/ducky';
	import { MOOD_PALETTE } from '$lib/data/moodPalette';
	import type { DuckyMood } from '$lib/components/Ducky.svelte';
	import { onMount } from 'svelte';

	const MOODS: DuckyMood[] = ['idle', 'excited', 'thinking', 'celebrating', 'curious', 'sleepy', 'sad'];

	let idx = $state(0);
	const mood = $derived(MOODS[idx]);
	const entry = $derived(MOOD_PALETTE[mood]);

	function show(newIdx: number) {
		idx = ((newIdx % MOODS.length) + MOODS.length) % MOODS.length;
		const m = MOODS[idx];
		const p = MOOD_PALETTE[m];
		setMood(m);
		void connection.send({ type: 'face', name: p.face === 'duck' || p.face === 'dizzy' ? 'happy' : p.face }).catch(() => {});
		const [r, g, b] = p.rgb;
		void connection.send({ type: 'rgb', r, g, b }).catch(() => {});
		if (p.sound) void connection.send({ type: 'sound', name: p.sound }).catch(() => {});
	}

	onMount(() => {
		show(0);
		return connection.onEvent((e) => {
			if (e.type === 'button' && e.phase === 'down') {
				if (e.button === 'A') show(idx - 1);
				if (e.button === 'B') show(idx + 1);
			}
		});
	});
</script>

<div class="flex flex-col items-center gap-5">
	<div
		class="grid size-40 place-items-center rounded-full text-5xl shadow-[var(--shadow-soft)] transition-colors duration-300"
		style="background: {entry.hex};"
	>
		{mood === 'sad' ? '😢' : mood === 'sleepy' ? '😴' : mood === 'thinking' ? '🤔' : mood === 'curious' ? '🧐' : mood === 'celebrating' ? '🎉' : mood === 'excited' ? '🤩' : '🦆'}
	</div>
	<p class="font-display text-xl font-extrabold capitalize">{mood}</p>

	<div class="flex flex-wrap justify-center gap-2">
		{#each MOODS as m, i}
			<button
				type="button"
				onclick={() => show(i)}
				class="size-10 rounded-full border-2 transition"
				class:border-night-ink={i === idx}
				class:border-transparent={i !== idx}
				style="background: {MOOD_PALETTE[m].hex};"
				aria-label={m}
			></button>
		{/each}
	</div>

	<p class="text-center text-xs text-(--color-night-soft)">
		Press A or B on the board to cycle moods — or tap the dots above.
	</p>
	<p class="max-w-xs text-center text-xs text-(--color-night-soft)">
		💡 The colour glow needs a Grove RGB LED clipped to pin 0 — the face and sound work either way.
	</p>
</div>
