<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import { connection } from '$lib/stores/connection';
	import type { DuckyMood } from '$lib/components/Ducky.svelte';
	import { onMount } from 'svelte';

	let mood = $state<DuckyMood>('idle');
	let touches = $state(0);
	let audioOn = $state(true);

	/** Descending sawtooth quack via Web Audio API — no audio file needed. */
	function playBrowserQuack() {
		if (!audioOn) return;
		try {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.connect(gain);
			gain.connect(ctx.destination);
			osc.type = 'sawtooth';
			osc.frequency.setValueAtTime(700, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.28);
			gain.gain.setValueAtTime(0.35, ctx.currentTime);
			gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.32);
			osc.start(ctx.currentTime);
			osc.stop(ctx.currentTime + 0.35);
			// ctx auto-closes when osc stops
		} catch {
			/* AudioContext not available (e.g. SSR) */
		}
	}

	function quack() {
		touches++;
		mood = 'celebrating';
		playBrowserQuack();
		setTimeout(() => (mood = 'idle'), 700);
	}

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type === 'touch' && e.phase === 'down') quack();
		});
		return off;
	});
</script>

<div class="flex flex-col items-center gap-5">
	<Ducky {mood} size={180} />

	<div class="flex items-center gap-3">
		<button type="button" onclick={quack} class="pop-btn pop-btn--yellow">
			Pretend I touched the logo 👆
		</button>

		<!-- Audio toggle -->
		<button
			type="button"
			onclick={() => (audioOn = !audioOn)}
			class="rounded-full border-2 border-(--color-mist) bg-white px-3 py-2 text-sm font-bold transition hover:bg-(--color-mist)"
			title="Toggle browser sound"
		>
			{audioOn ? '🔊' : '🔇'}
		</button>
	</div>

	<p class="text-sm text-(--color-night-soft)">
		Quacks so far: <strong>{touches}</strong>
	</p>
	<p class="max-w-xs text-center text-xs text-(--color-night-soft)">
		The micro:bit also plays a 3-note descending quack through its built-in speaker each time you touch the gold logo.
	</p>
</div>
