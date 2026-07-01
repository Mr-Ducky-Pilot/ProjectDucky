<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { setMood } from '$lib/stores/ducky';
	import { onMount } from 'svelte';

	let steps = $state(0);
	let goal = $state(20);
	let sensitivity = $state(1.3);   // g threshold for a step spike
	let hasData = $state(false);
	let magnitude = $state(1.0);

	// Step detection state machine
	let above = false;

	function detectStep(mag: number) {
		if (mag > sensitivity && !above) {
			above = true;
			steps++;
			sendProgress();
			if (steps % 5 === 0) setMood('celebrating');
		} else if (mag < sensitivity - 0.1) {
			above = false;
		}
	}

	// Build bargraph bits for board (progress toward goal, 0-25 LEDs)
	function progressBits(n: number, total: number): boolean[] {
		const lit = Math.min(25, Math.round((n / total) * 25));
		return Array.from({ length: 25 }, (_, i) => {
			const row = Math.floor(i / 5);
			const col = i % 5;
			// Fill from bottom-left, row by row upward
			const linearIdx = (4 - row) * 5 + col;
			return linearIdx < lit;
		});
	}

	function sendProgress() {
		const bits = progressBits(steps, goal);
		void connection.send({ type: 'matrix', bits }).catch(() => {});
	}

	function reset() {
		steps = 0;
		above = false;
		void connection.send({ type: 'matrix', bits: Array(25).fill(false) }).catch(() => {});
	}

	const pct = $derived(Math.min(1, steps / goal));
	const bits = $derived(progressBits(steps, goal));

	onMount(() => {
		let off: (() => void) | null = null;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor('accel', ([x, y, z]) => {
					const mag = Math.hypot(x, y, z);
					magnitude = mag;
					hasData = true;
					detectStep(mag);
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => { steps = 0; above = false; void subscribe(); });
		return () => { off?.(); offReady(); };
	});
</script>

<div class="flex flex-col gap-6">
	<div class="grid items-start gap-6 sm:grid-cols-2">
		<!-- Step count display -->
		<div class="flex flex-col items-center gap-3">
			<LedMatrix {bits} size={180} color="#7ad44b" />
			<div class="text-center">
				<p class="font-mono text-6xl font-extrabold">{steps}</p>
				<p class="text-sm text-(--color-night-soft)">steps of {goal}</p>
			</div>
		</div>

		<!-- Controls -->
		<div class="flex flex-col gap-4">
			<!-- Progress bar -->
			<div class="overflow-hidden rounded-full bg-(--color-mist)" style="height: 12px;">
				<div
					class="h-full rounded-full bg-(--color-leaf-green) transition-all duration-300"
					style="width: {pct * 100}%;"
				></div>
			</div>

			{#if steps >= goal}
				<div class="rounded-2xl bg-(--color-leaf-green)/20 p-3 text-center font-bold text-(--color-leaf-deep)">
					🎉 Goal reached! You did it!
				</div>
			{/if}

			<SensorMeter value={magnitude} min={0.5} max={2.5} label="Accel magnitude" unit="g" color="#7ad44b" />

			<div class="rounded-2xl border-2 border-(--color-mist) bg-white p-3">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
						Step threshold
					</span>
					<span class="font-mono text-sm font-bold">{sensitivity.toFixed(1)}g</span>
				</div>
				<input
					type="range"
					min={1.1}
					max={2.0}
					step={0.05}
					bind:value={sensitivity}
					class="w-full accent-(--color-leaf-green)"
				/>
				<div class="mt-0.5 flex justify-between text-xs text-(--color-night-soft)">
					<span>Sensitive</span><span>Only big steps</span>
				</div>
			</div>

			<div class="flex items-center gap-3">
				<label class="flex flex-col gap-1 flex-1">
					<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Goal</span>
					<select bind:value={goal} class="rounded-xl border-2 border-(--color-mist) px-3 py-2 text-sm font-bold">
						{#each [10, 20, 50, 100] as g}
							<option value={g}>{g} steps</option>
						{/each}
					</select>
				</label>
				<button type="button" onclick={reset} class="pop-btn pop-btn--ghost self-end">
					Reset
				</button>
			</div>

			{#if !hasData}
				<p class="text-xs text-(--color-night-soft)">
					Start Ducky first, then clip the chip to your shoe or hold it in your hand.
				</p>
			{/if}
		</div>
	</div>

	<YourTurn challenges={[
		'Set goal to 10, then walk exactly 10 steps — does the counter match?',
		'Adjust the threshold until desk bumps and arm swings don\'t count as steps.',
		'Set goal to 20 and walk around the room — hit your target!'
	]} />
</div>
