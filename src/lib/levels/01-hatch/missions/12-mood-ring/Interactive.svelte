<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	type SensorChoice = 'mic' | 'light' | 'temp' | 'accel';
	const SENSOR_INFO: Record<SensorChoice, { label: string; icon: string; min: number; max: number; unit: string }> = {
		mic:   { label: 'Loudness',    icon: '🎤', min: 0,  max: 255, unit: '' },
		light: { label: 'Brightness',  icon: '💡', min: 0,  max: 255, unit: '' },
		temp:  { label: 'Temperature', icon: '🌡️', min: 10, max: 40,  unit: '°C' },
		accel: { label: 'Motion',      icon: '📳', min: 0,  max: 3,   unit: 'g' }
	};

	let sensor = $state<SensorChoice>('light');
	let threshold = $state(128);
	let measured = $state(0);
	let hasData = $state(false);

	const info = $derived(SENSOR_INFO[sensor]);
	const happy = $derived(measured >= threshold);

	// Reset threshold to midpoint when sensor changes
	$effect(() => {
		threshold = (info.min + info.max) / 2;
	});

	// Send face to board whenever mood changes
	$effect(() => {
		void connection.send({ type: 'face', name: happy ? 'happy' : 'sad' }).catch(() => {});
	});

	onMount(() => {
		let off: (() => void) | null = null;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor(sensor, (vals) => {
					measured = sensor === 'accel' ? Math.hypot(...vals) : vals[0];
					hasData = true;
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => { off?.(); offReady(); };
	});

	// Re-subscribe when sensor changes (after initial mount)
	let firstRun = true;
	$effect(() => {
		// Access sensor to track dependency
		const _ = sensor;
		if (firstRun) { firstRun = false; return; }
		// sensor changed — re-subscribe
		let off: (() => void) | null = null;
		connection.streamSensor(sensor, (vals) => {
			measured = sensor === 'accel' ? Math.hypot(...vals) : vals[0];
			hasData = true;
		}).then((u) => { off = u; });
		return () => off?.();
	});
</script>

<div class="flex flex-col gap-5">
	<div class="flex flex-wrap gap-2">
		{#each Object.entries(SENSOR_INFO) as [key, info]}
			<button
				type="button"
				onclick={() => { sensor = key as SensorChoice; measured = 0; hasData = false; }}
				class="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold transition"
				class:bg-(--color-night-ink)={sensor === key}
				class:text-white={sensor === key}
				class:bg-(--color-mist)={sensor !== key}
				class:text-(--color-night-soft)={sensor !== key}
			>
				{info.icon} {info.label}
			</button>
		{/each}
	</div>

	<div class="grid items-center gap-5 sm:grid-cols-2">
		<div class="flex flex-col items-center gap-3">
			<Ducky mood={happy ? 'celebrating' : 'sad'} size={160} />
			<p class="text-center text-sm font-bold">
				{happy ? '😊 Happy!' : '😢 Sad…'}
			</p>
		</div>

		<div class="flex flex-col gap-4">
			<SensorMeter value={measured} min={info.min} max={info.max} label={info.label} unit={info.unit} />

			<div class="rounded-2xl border-2 border-(--color-mist) bg-white p-4">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
						Trigger point
					</span>
					<span class="rounded-full bg-(--color-duck-yellow) px-2 py-0.5 font-mono text-sm font-bold">
						{threshold.toFixed(1)}{info.unit}
					</span>
				</div>

				<div class="mb-3 overflow-x-auto rounded-xl bg-slate-900 px-4 py-2 font-mono text-xs leading-relaxed">
					<span class="text-purple-400">if</span>
					<span class="text-slate-300"> reading &gt; </span>
					<span class="rounded bg-yellow-400/20 px-1 text-yellow-300 ring-1 ring-yellow-400/40">{threshold.toFixed(1)}</span>
					<span class="text-slate-300">:</span><br />
					<span class="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;# 😊 happy</span><br />
					<span class="text-purple-400">else</span><span class="text-slate-300">:</span><br />
					<span class="text-slate-500">&nbsp;&nbsp;&nbsp;&nbsp;# 😢 sad</span>
				</div>

				<input
					type="range"
					bind:value={threshold}
					min={info.min}
					max={info.max}
					step={(info.max - info.min) / 100}
					class="w-full accent-(--color-pond-blue)"
				/>
			</div>
		</div>
	</div>

	{#if !hasData}
		<p class="text-center text-xs text-(--color-night-soft)">
			Start Ducky first — then pick a sensor and slide the threshold.
		</p>
	{/if}
</div>
