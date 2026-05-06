<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	type Phase = 'idle' | 'wait' | 'go' | 'result' | 'jumped';
	let phase = $state<Phase>('idle');
	let startedAt = $state(0);
	let lastMs = $state<number | null>(null);
	let bestMs = $state<number | null>(null);
	let timer: ReturnType<typeof setTimeout> | null = null;

	const ALL_ON = Array(25).fill(true);
	const ALL_OFF = Array(25).fill(false);
	const X = '1000101010001010100010001'.split('').map((c) => c === '1');

	const bits = $derived(
		phase === 'go' ? ALL_ON : phase === 'jumped' ? X : phase === 'wait' ? Array(25).fill(false) : ALL_OFF
	);

	function start() {
		phase = 'wait';
		const delay = 800 + Math.random() * 2200;
		timer = setTimeout(() => {
			phase = 'go';
			startedAt = performance.now();
		}, delay);
	}

	function tap() {
		if (phase === 'wait') {
			if (timer) clearTimeout(timer);
			phase = 'jumped';
			return;
		}
		if (phase === 'go') {
			lastMs = Math.round(performance.now() - startedAt);
			if (bestMs === null || lastMs < bestMs) bestMs = lastMs;
			phase = 'result';
			return;
		}
		if (phase === 'idle' || phase === 'result' || phase === 'jumped') {
			start();
		}
	}

	const matrixColor = $derived(
		phase === 'go' ? '#7ad44b' : phase === 'jumped' ? '#ff7a6b' : '#ffd23a'
	);
</script>

<div class="flex flex-col items-center gap-5">
	<LedMatrix {bits} size={220} color={matrixColor} />

	<button type="button" onclick={tap} class="pop-btn pop-btn--blue text-lg" style="min-width: 220px;">
		{#if phase === 'idle'}Start{/if}
		{#if phase === 'wait'}Wait for green…{/if}
		{#if phase === 'go'}NOW! Tap!{/if}
		{#if phase === 'result'}Go again{/if}
		{#if phase === 'jumped'}Jumped! Try again{/if}
	</button>

	<div class="flex gap-4 text-center">
		<div class="card rounded-2xl px-5 py-3">
			<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Last
			</div>
			<div class="font-mono text-2xl font-extrabold">{lastMs ?? '—'} ms</div>
		</div>
		<div class="card rounded-2xl px-5 py-3">
			<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Best
			</div>
			<div class="font-mono text-2xl font-extrabold text-(--color-leaf-deep)">{bestMs ?? '—'} ms</div>
		</div>
	</div>
</div>
