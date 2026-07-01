<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	type Phase = 'idle' | 'wait' | 'go' | 'result' | 'jumped';
	let phase = $state<Phase>('idle');
	let startedAt = $state(0);
	let lastMs = $state<number | null>(null);
	let bestMs = $state<number | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const ALL_ON  = Array(25).fill(true);
	const ALL_OFF = Array(25).fill(false);
	const X_BITS  = '1000101010001010100010001'.split('').map((c) => c === '1');

	const bits = $derived(
		phase === 'go' ? ALL_ON : (phase === 'jumped' || phase === 'result') ? X_BITS : ALL_OFF
	);

	const matrixColor = $derived(
		phase === 'go' ? '#7ad44b' : phase === 'jumped' ? '#ff7a6b' : '#ffd23a'
	);

	// Send board state explicitly on each transition (avoids $effect reactivity edge cases)
	function sendBits(b: boolean[]) {
		void connection.send({ type: 'matrix', bits: b }).catch(() => {});
	}

	function start() {
		phase = 'wait';
		sendBits(ALL_OFF);
		const delay = 800 + Math.random() * 2200;
		timer = setTimeout(() => {
			phase = 'go';
			startedAt = performance.now();
			sendBits(ALL_ON);
		}, delay);
	}

	function tap() {
		if (phase === 'wait') {
			if (timer) clearTimeout(timer);
			phase = 'jumped';
			sendBits(X_BITS);
			return;
		}
		if (phase === 'go') {
			lastMs = Math.round(performance.now() - startedAt);
			if (bestMs === null || lastMs < bestMs) bestMs = lastMs;
			phase = 'result';
			sendBits(X_BITS);
			return;
		}
		// idle / result / jumped → start a new round
		start();
	}

	// Wire board button A → tap (single press is fine — navigation uses AA double-press)
	onMount(() => {
		sendBits(ALL_OFF);  // clear board on mount
		const off = connection.onEvent((e) => {
			if (e.type === 'button' && e.button === 'A' && e.phase === 'down') tap();
		});
		return off;
	});

	const rating = $derived.by(() => {
		if (!lastMs) return '';
		if (lastMs < 200) return '⚡ Lightning fast!';
		if (lastMs < 280) return '🏆 Great!';
		if (lastMs < 400) return '👍 Good';
		return '🐢 Keep practising';
	});
</script>

<div class="flex flex-col items-center gap-5">
	<LedMatrix {bits} size={200} color={matrixColor} />

	<button
		type="button"
		onclick={tap}
		class="pop-btn pop-btn--blue text-lg"
		style="min-width: 220px;"
	>
		{#if phase === 'idle'}Start{/if}
		{#if phase === 'wait'}⏳ Wait for green…{/if}
		{#if phase === 'go'}NOW! Tap!{/if}
		{#if phase === 'result'}Go again{/if}
		{#if phase === 'jumped'}Too early! Try again{/if}
	</button>

	<p class="text-center text-xs text-(--color-night-soft)">
		Tap the button above <em>or</em> press button A on the chip (single tap)
	</p>

	<div class="flex gap-4 text-center">
		<div class="card rounded-2xl px-5 py-3">
			<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Last</div>
			<div class="font-mono text-2xl font-extrabold">{lastMs ?? '—'} {lastMs ? 'ms' : ''}</div>
			{#if rating}<div class="mt-1 text-xs">{rating}</div>{/if}
		</div>
		<div class="card rounded-2xl px-5 py-3">
			<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Best</div>
			<div class="font-mono text-2xl font-extrabold text-(--color-leaf-deep)">{bestMs ?? '—'} {bestMs ? 'ms' : ''}</div>
		</div>
	</div>

	<YourTurn challenges={[
		'Get your reaction time under 350 milliseconds — keep trying!',
		'Beat 280ms — that\'s roughly the average for a 12-year-old.',
		'Play 5 rounds without a single "too early" jump — patience wins!'
	]} />
</div>
