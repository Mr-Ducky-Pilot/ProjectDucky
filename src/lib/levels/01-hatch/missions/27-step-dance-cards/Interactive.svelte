<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';

	const CARDS = [
		{ name: 'LEFT', emoji: '⬅️', color: '#4cc1ff' },
		{ name: 'RIGHT', emoji: '➡️', color: '#7ad44b' },
		{ name: 'STOMP', emoji: '🦶', color: '#ff7a6b' },
		{ name: 'JUMP', emoji: '⬆️', color: '#ffd23a' },
		{ name: 'HOLD', emoji: '✋', color: '#b18cff' }
	];

	let bpm = $state(96);
	let playing = $state(false);
	let cardIdx = $state(0);
	let stomps = $state(0);
	let cooldown = false;

	$effect(() => {
		if (!playing) return;
		const ms = 60_000 / bpm;
		const id = setInterval(() => {
			cardIdx = Math.floor(Math.random() * CARDS.length);
			void connection.send({ type: 'tone', sequence: [{ note: 'C5', ms: 80 }] }).catch(() => {});
		}, ms);
		return () => clearInterval(id);
	});

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = await connection.streamSensor('accel', ([, , z]) => {
					if (Math.abs(z) > 1.8 && !cooldown) {
						stomps++;
						cooldown = true;
						setTimeout(() => (cooldown = false), 250);
					}
				});
			} catch {
				/* not connected */
			}
		}
		void subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => {
			off?.();
			offReady();
		};
	});
</script>

<div class="flex flex-col items-center gap-6">
	<div
		class="grid h-64 w-64 place-items-center rounded-3xl shadow-soft transition-colors"
		style="background: {CARDS[cardIdx].color};"
	>
		<div class="text-center">
			<div class="text-7xl">{CARDS[cardIdx].emoji}</div>
			<p class="mt-2 font-display text-3xl font-extrabold text-white">{CARDS[cardIdx].name}</p>
		</div>
	</div>

	<div class="flex items-center gap-4">
		<button
			class="rounded-full bg-night-ink px-5 py-2 font-display font-bold text-white"
			onclick={() => {
				playing = !playing;
				if (!playing) stomps = 0;
			}}
		>
			{playing ? '■ Stop' : '▶ Dance!'}
		</button>
		<label class="text-xs uppercase tracking-wider text-night-soft">BPM</label>
		<input type="range" min="60" max="160" bind:value={bpm} class="w-32" />
		<span class="font-mono text-sm">{bpm}</span>
	</div>

	<div class="rounded-2xl bg-egg-cream px-6 py-3 text-center shadow-soft">
		<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Stomps detected</p>
		<p class="font-display text-3xl font-extrabold text-night-ink">{stomps}</p>
	</div>
</div>
