<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { setMood } from '$lib/stores/ducky';
	import { MOOD_PALETTE } from '$lib/data/moodPalette';
	import { onMount } from 'svelte';

	function sendMoodRgb(mood: keyof typeof MOOD_PALETTE) {
		const [r, g, b] = MOOD_PALETTE[mood].rgb;
		void connection.send({ type: 'rgb', r, g, b }).catch(() => {});
	}

	// Standard dice dot patterns (5×5 grid)
	const DICE_BITS: Record<number, string> = {
		1: '0000000000001000000000000',
		2: '1000000000000000000000001',
		3: '1000000000001000000000001',
		4: '1000100000000000000010001',
		5: '1000100000001000000010001',
		6: '1000100000100010000010001'
	};

	let result = $state<number | null>(null);
	let rolling = $state(false);
	let rollCount = $state(0);
	let history = $state<number[]>([]);
	let hasData = $state(false);
	let lastMagnitude = $state(0);

	const bits = $derived(
		result ? DICE_BITS[result].split('').map((c) => c === '1') : Array(25).fill(false)
	);

	async function roll() {
		if (rolling) return;
		rolling = true;
		setMood('excited');
		sendMoodRgb('excited');

		// Quick shuffle animation
		for (let i = 0; i < 5; i++) {
			const r = Math.ceil(Math.random() * 6);
			const b = DICE_BITS[r].split('').map((c) => c === '1');
			void connection.send({ type: 'matrix', bits: b }).catch(() => {});
			await new Promise((res) => setTimeout(res, 80));
		}

		const r = Math.ceil(Math.random() * 6);
		result = r;
		rollCount++;
		history = [r, ...history].slice(0, 8);

		void connection.send({ type: 'matrix', bits: DICE_BITS[r].split('').map((c) => c === '1') }).catch(() => {});
		setMood('celebrating');
		sendMoodRgb('celebrating');
		setTimeout(() => { rolling = false; setMood('idle'); sendMoodRgb('idle'); }, 600);
	}

	// Detect shake from accel stream
	onMount(() => {
		let off: (() => void) | null = null;
		let shaking = false;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor('accel', ([x, y, z]) => {
					hasData = true;
					const mag = Math.hypot(x, y, z);
					lastMagnitude = mag;
					if (mag > 1.8 && !shaking && !rolling) {
						shaking = true;
						void roll();
						setTimeout(() => { shaking = false; }, 600);
					}
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => { off?.(); offReady(); };
	});

	const diceEmoji: Record<number, string> = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' };
</script>

<div class="flex flex-col items-center gap-6">
	<div class="grid items-center gap-6 sm:grid-cols-2">
		<!-- Dice display -->
		<div class="flex flex-col items-center gap-3">
			<LedMatrix {bits} size={180} color="#ffd23a" />
			{#if result}
				<p class="font-display text-5xl font-extrabold">{diceEmoji[result]}</p>
			{:else}
				<p class="text-sm text-(--color-night-soft)">Shake to roll!</p>
			{/if}
		</div>

		<!-- Controls + stats -->
		<div class="flex flex-col gap-4">
			<button
				type="button"
				onclick={roll}
				disabled={rolling}
				class="pop-btn pop-btn--yellow text-lg"
			>
				{rolling ? '🎲 Rolling…' : '🎲 Shake / Roll!'}
			</button>

			<div class="flex gap-3">
				<div class="card flex-1 rounded-2xl p-3 text-center">
					<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Rolls</div>
					<div class="font-mono text-2xl font-extrabold">{rollCount}</div>
				</div>
				{#if result}
					<div class="card flex-1 rounded-2xl p-3 text-center">
						<div class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Last</div>
						<div class="font-mono text-2xl font-extrabold">{result}</div>
					</div>
				{/if}
			</div>

			{#if history.length > 0}
				<div class="rounded-2xl bg-(--color-mist) p-3">
					<p class="mb-2 text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">History</p>
					<div class="flex flex-wrap gap-1.5">
						{#each history as h, i}
							<span
								class="font-mono text-lg"
								style="opacity: {1 - i * 0.1}"
							>{diceEmoji[h]}</span>
						{/each}
					</div>
				</div>
			{/if}

			{#if !hasData}
				<p class="text-xs text-(--color-night-soft)">
					Start Ducky first to shake-to-roll. You can also tap the button above.
				</p>
			{/if}
		</div>
	</div>

	<YourTurn challenges={[
		'Roll until you\'ve seen every number from 1 to 6 at least once — how many rolls did it take?',
		'Try to roll the same number three times in a row — it\'s rare! Count your attempts.',
		'Roll 12 times and tally the results — did each number appear roughly twice? Is it fair?'
	]} />
</div>
