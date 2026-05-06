<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	let lux = $state(140);
	let threshold = $state(50);
	let applied = $state(false);

	onMount(() => {
		let off: (() => void) | null = null;
		connection.streamSensor('light', ([v]) => (lux = v)).then((u) => {
			off = u;
		});
		return () => off?.();
	});

	const mood = $derived(lux < threshold ? 'sleepy' : lux > 200 ? 'excited' : 'curious');
	const bgHue = $derived(Math.min(60, lux / 4));

	async function applyThreshold() {
		await connection.send({ type: 'light-threshold', value: threshold });
		applied = true;
		setTimeout(() => (applied = false), 1500);
	}
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch sm:gap-6">
		<div
			class="flex flex-1 items-center justify-center rounded-3xl p-4"
			style="background: linear-gradient(180deg, hsl({bgHue}, 80%, 92%), white);"
		>
			<Ducky {mood} size={140} />
		</div>
		<div class="flex flex-1 flex-col gap-3">
			<SensorMeter value={lux} min={0} max={255} label="Light level" color="#ffd23a" />
			<p class="text-sm text-(--color-night-soft)">
				{#if lux < threshold}
					🙈 It's dark — Ducky is sad!
				{:else if lux > 200}
					☀️ Whoa, bright! Ducky is excited.
				{:else}
					😊 Comfy light level.
				{/if}
			</p>
		</div>
	</div>

	<!-- Threshold tuner -->
	<div class="rounded-2xl border-2 border-(--color-mist) bg-white p-4">
		<div class="mb-3 flex items-center justify-between">
			<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				🔧 Tune the trigger point
			</span>
			<span class="rounded-full bg-(--color-duck-yellow) px-2 py-0.5 font-mono text-sm font-bold">
				{threshold}
			</span>
		</div>

		<!-- Live code preview -->
		<div
			class="mb-3 overflow-x-auto rounded-xl bg-slate-900 px-4 py-2 font-mono text-xs leading-relaxed"
		>
			<span class="text-purple-400">if</span>
			<span class="text-slate-300"> light_level &gt; </span>
			<span class="rounded bg-yellow-400/20 px-1 text-yellow-300 ring-1 ring-yellow-400/40"
				>{threshold}</span
			>
			<span class="text-slate-300">:</span><br />
			<span class="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;# 😊 show happy face</span><br />
			<span class="text-purple-400">else</span><span class="text-slate-300">:</span><br />
			<span class="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;# 😢 show sad face</span>
		</div>

		<input
			type="range"
			min="10"
			max="200"
			step="5"
			bind:value={threshold}
			class="w-full accent-yellow-400"
		/>
		<div class="mt-1 flex justify-between text-xs text-(--color-night-soft)">
			<span>Easy to trigger (10)</span>
			<span>Hard to trigger (200)</span>
		</div>

		<button
			type="button"
			onclick={applyThreshold}
			class="pop-btn pop-btn--yellow mt-3 w-full text-sm"
		>
			{#if applied}
				✅ Applied to Ducky!
			{:else}
				Apply to Ducky
			{/if}
		</button>
		<p class="mt-2 text-center text-xs text-(--color-night-soft)">
			Drag the slider, click Apply — the chip updates instantly!
		</p>
	</div>
</div>
