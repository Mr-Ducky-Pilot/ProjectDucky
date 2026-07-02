<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';

	const CARDS = [
		{ name: 'LEFT', emoji: '⬅️', color: '#4cc1ff', bits: '0010001000111110100000100' },
		{ name: 'RIGHT', emoji: '➡️', color: '#7ad44b', bits: '0010000010111110001000100' },
		{ name: 'STOMP', emoji: '🦶', color: '#ff7a6b', bits: '0010000100101010111000100' },
		{ name: 'JUMP', emoji: '⬆️', color: '#ffd23a', bits: '0010001110101010010000100' },
		{ name: 'HOLD', emoji: '✋', color: '#b18cff', bits: '0000001010010100101000000' }
	];

	const MIN_BPM = 60;
	const MAX_BPM = 160;
	const BPM_STEP = 8;

	let bpm = $state(96);
	let playing = $state(false);
	let cardIdx = $state(0);
	let stomps = $state(0);
	let cooldown = false;
	let hasData = $state(false);

	function toBits(s: string) {
		return s.replace(/:/g, '').split('').map((c) => c === '1');
	}

	function slower() {
		bpm = Math.max(MIN_BPM, bpm - BPM_STEP);
	}
	function faster() {
		bpm = Math.min(MAX_BPM, bpm + BPM_STEP);
	}

	$effect(() => {
		if (!playing) return;
		const ms = 60_000 / bpm;
		const id = setInterval(() => {
			cardIdx = Math.floor(Math.random() * CARDS.length);
			void connection.send({ type: 'tone', sequence: [{ note: 'C5', ms: 80 }] }).catch(() => {});
			void connection.send({ type: 'matrix', bits: toBits(CARDS[cardIdx].bits) }).catch(() => {});
		}, ms);
		return () => clearInterval(id);
	});

	// Clear the board's matrix whenever playback stops so it doesn't sit on
	// the last card shown.
	$effect(() => {
		if (playing) return;
		void connection.send({ type: 'matrix', bits: Array(25).fill(false) }).catch(() => {});
	});

	onMount(() => {
		let off: (() => void) | null = null;
		async function subscribe() {
			try {
				off?.();
				off = null;
				// Total shake magnitude (not just Z) — reliable regardless of how
				// the board is held or clipped to a foot/wrist.
				off = await connection.streamSensor('accel', ([x, y, z]) => {
					hasData = true;
					const mag = Math.hypot(x, y, z);
					if (mag > 1.8 && !cooldown) {
						stomps++;
						cooldown = true;
						void connection.send({ type: 'tone', sequence: [{ note: 'C4', ms: 60 }] }).catch(() => {});
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

	<div class="flex flex-wrap items-center justify-center gap-4">
		<button
			class="rounded-full bg-night-ink px-5 py-2 font-display font-bold text-white"
			onclick={() => {
				playing = !playing;
				if (!playing) stomps = 0;
			}}
		>
			{playing ? '■ Stop' : '▶ Dance!'}
		</button>

		<div class="flex items-center gap-2 rounded-full bg-mist px-2 py-1">
			<button
				type="button"
				onclick={slower}
				disabled={bpm <= MIN_BPM}
				class="grid size-8 place-items-center rounded-full bg-white font-bold text-night-ink shadow-soft disabled:opacity-40"
				aria-label="Slower"
			>
				−
			</button>
			<span class="w-20 text-center font-mono text-sm font-bold">{bpm} BPM</span>
			<button
				type="button"
				onclick={faster}
				disabled={bpm >= MAX_BPM}
				class="grid size-8 place-items-center rounded-full bg-white font-bold text-night-ink shadow-soft disabled:opacity-40"
				aria-label="Faster"
			>
				+
			</button>
		</div>
	</div>

	<div class="rounded-2xl bg-egg-cream px-6 py-3 text-center shadow-soft">
		<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Stomps detected</p>
		<p class="font-display text-3xl font-extrabold text-night-ink">{stomps}</p>
	</div>

	{#if !hasData}
		<p class="text-xs text-(--color-night-soft)">
			Start Ducky first — then stomp, and the beat + card symbol will show on the board too.
		</p>
	{/if}
</div>
