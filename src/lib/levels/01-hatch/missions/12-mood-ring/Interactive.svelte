<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	type SensorChoice = 'mic' | 'light' | 'temp' | 'accel';
	const SENSOR_INFO: Record<SensorChoice, { label: string; min: number; max: number; unit: string }> = {
		mic: { label: 'Loudness', min: 0, max: 255, unit: '' },
		light: { label: 'Light', min: 0, max: 255, unit: '' },
		temp: { label: 'Temperature', min: 10, max: 40, unit: '°C' },
		accel: { label: 'Motion', min: 0, max: 3, unit: 'g' }
	};

	let sensor = $state<SensorChoice>('light');
	let threshold = $state(120);
	let raw = $state<number[]>([0]);
	let measured = $state(0);

	const info = $derived(SENSOR_INFO[sensor]);

	$effect(() => {
		threshold = (info.min + info.max) / 2;
	});

	$effect(() => {
		let off: (() => void) | null = null;
		connection
			.streamSensor(sensor, (vals) => {
				raw = vals;
				measured = sensor === 'accel' ? Math.hypot(...vals) : vals[0];
			})
			.then((u) => {
				off = u;
			});
		return () => off?.();
	});

	const happy = $derived(measured >= threshold);
</script>

<div class="grid items-center gap-5 sm:grid-cols-2">
	<div class="flex justify-center">
		<Ducky mood={happy ? 'celebrating' : 'sad'} size={180} />
	</div>

	<div class="flex flex-col gap-4">
		<div class="flex flex-wrap gap-2">
			{#each Object.entries(SENSOR_INFO) as [key, _]}
				<button
					type="button"
					onclick={() => (sensor = key as SensorChoice)}
					class="rounded-full px-3 py-1.5 text-sm font-bold transition"
					class:bg-(--color-night-ink)={sensor === key}
					class:text-white={sensor === key}
					class:bg-(--color-mist)={sensor !== key}
					class:text-(--color-night-soft)={sensor !== key}
				>
					{SENSOR_INFO[key as SensorChoice].label}
				</button>
			{/each}
		</div>

		<SensorMeter value={measured} min={info.min} max={info.max} label={info.label} unit={info.unit} />

		<label class="flex flex-col gap-2">
			<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Threshold
			</span>
			<input
				type="range"
				bind:value={threshold}
				min={info.min}
				max={info.max}
				step={(info.max - info.min) / 100}
				class="w-full accent-(--color-pond-blue)"
			/>
			<span class="font-mono text-sm text-(--color-night-soft)">
				Happy if reading ≥ {threshold.toFixed(1)}{info.unit}
			</span>
		</label>
	</div>
</div>
