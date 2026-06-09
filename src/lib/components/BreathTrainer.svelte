<script lang="ts">
	type Props = { inSec?: number; holdSec?: number; outSec?: number };
	let { inSec = 4, holdSec = 7, outSec = 8 }: Props = $props();

	const total = $derived(inSec + holdSec + outSec);
	let phaseTime = $state(0);
	let phase = $state<'in' | 'hold' | 'out'>('in');
	let running = $state(false);

	$effect(() => {
		if (!running) return;
		const id = setInterval(() => {
			phaseTime += 0.1;
			if (phase === 'in' && phaseTime >= inSec) {
				phase = 'hold';
				phaseTime = 0;
			} else if (phase === 'hold' && phaseTime >= holdSec) {
				phase = 'out';
				phaseTime = 0;
			} else if (phase === 'out' && phaseTime >= outSec) {
				phase = 'in';
				phaseTime = 0;
			}
		}, 100);
		return () => clearInterval(id);
	});

	const scale = $derived.by(() => {
		if (phase === 'in') return 0.4 + 0.6 * (phaseTime / inSec);
		if (phase === 'hold') return 1.0;
		return 1.0 - 0.6 * (phaseTime / outSec);
	});

	const label = $derived(
		phase === 'in' ? 'breathe in' : phase === 'hold' ? 'hold' : 'breathe out'
	);
	const color = $derived(
		phase === 'in' ? '#4cc1ff' : phase === 'hold' ? '#b18cff' : '#7ad44b'
	);
	const remaining = $derived(
		phase === 'in' ? inSec - phaseTime : phase === 'hold' ? holdSec - phaseTime : outSec - phaseTime
	);
</script>

<div class="flex flex-col items-center gap-3">
	<div class="relative grid h-56 w-56 place-items-center">
		<div
			class="absolute size-44 rounded-full transition-transform duration-100"
			style="background: {color}; transform: scale({scale}); opacity: 0.4;"
		></div>
		<div
			class="absolute size-32 rounded-full transition-transform duration-100"
			style="background: {color}; transform: scale({scale}); opacity: 0.6;"
		></div>
		<div class="relative text-center">
			<p class="font-display text-2xl font-bold text-night-ink">{label}</p>
			<p class="font-mono text-sm text-night-soft">{Math.max(0, remaining).toFixed(1)}s</p>
		</div>
	</div>
	<button
		class="rounded-full bg-night-ink px-4 py-2 font-display text-sm font-bold text-white"
		onclick={() => {
			running = !running;
			if (running) {
				phase = 'in';
				phaseTime = 0;
			}
		}}
	>
		{running ? 'Stop' : 'Start preview'}
	</button>
</div>
