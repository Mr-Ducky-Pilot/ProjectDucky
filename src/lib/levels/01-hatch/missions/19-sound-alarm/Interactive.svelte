<script lang="ts">
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { setMood, say } from '$lib/stores/ducky';
	import { onMount } from 'svelte';

	let armed = $state(false);
	let triggered = $state(false);
	let triggerCount = $state(0);
	let sensitivity = $state(80);   // mic level 0-255 that triggers
	let micLevel = $state(0);
	let hasData = $state(false);
	let cooldown = false;

	const ALARM_PATTERN = '1010101010010100101010101'; // checkerboard
	const alarmBits = ALARM_PATTERN.split('').map((c) => c === '1');
	const clearBits = Array(25).fill(false);

	async function trigger() {
		if (cooldown || !armed) return;
		triggered = true;
		triggerCount++;
		cooldown = true;
		setMood('sad');
		say('ALARM! 🔔', 'sad');

		// Flash alarm pattern + play siren on board
		void connection.send({ type: 'matrix', bits: alarmBits }).catch(() => {});
		void connection.send({
			type: 'tone',
			sequence: [
				{ note: 'A#4', ms: 100 }, { note: 'C5', ms: 100 },
				{ note: 'A#4', ms: 100 }, { note: 'C5', ms: 100 },
				{ note: 'A#4', ms: 100 }
			]
		}).catch(() => {});

		setTimeout(async () => {
			triggered = false;
			if (armed) {
				void connection.send({ type: 'face', name: 'happy' }).catch(() => {});
			} else {
				void connection.send({ type: 'matrix', bits: clearBits }).catch(() => {});
			}
			setMood('idle');
			await new Promise((r) => setTimeout(r, 1500));
			cooldown = false;
		}, 2500);
	}

	function toggleArm() {
		armed = !armed;
		triggered = false;
		cooldown = false;
		if (armed) {
			setMood('curious');
			say('Shh… I\'m listening 👂', 'curious');
			void connection.send({ type: 'face', name: 'wink' }).catch(() => {});
		} else {
			setMood('idle');
			void connection.send({ type: 'matrix', bits: clearBits }).catch(() => {});
		}
	}

	onMount(() => {
		let off: (() => void) | null = null;

		async function subscribe() {
			try {
				off?.(); off = null;
				off = await connection.streamSensor('mic', ([v]) => {
					micLevel = v;
					hasData = true;
					if (armed && v > sensitivity) void trigger();
				});
			} catch { /* not connected yet */ }
		}

		subscribe();
		const offReady = connection.onReady(() => void subscribe());
		return () => { off?.(); offReady(); };
	});

	const bitsDisplay = $derived(triggered ? alarmBits : clearBits);
</script>

<div class="flex flex-col gap-5">
	<div class="grid items-center gap-6 sm:grid-cols-2">
		<!-- Alarm status -->
		<div class="flex flex-col items-center gap-4">
			<LedMatrix bits={bitsDisplay} size={180} color={triggered ? '#ff7a6b' : '#ffd23a'} />

			<button
				type="button"
				onclick={toggleArm}
				class="w-full rounded-2xl py-4 text-xl font-extrabold transition"
				class:bg-(--color-leaf-green)={armed}
				class:text-white={armed}
				class:bg-(--color-sunset-coral)={!armed && triggered}
				class:bg-(--color-mist)={!armed && !triggered}
				class:text-(--color-night-soft)={!armed && !triggered}
			>
				{#if triggered}🚨 ALARM!{:else if armed}🔒 ARMED — tap to disarm{:else}🔓 Disarmed — tap to arm{/if}
			</button>
		</div>

		<!-- Controls -->
		<div class="flex flex-col gap-4">
			<SensorMeter value={micLevel} min={0} max={255} label="Microphone" color="#4cc1ff" />

			<!-- Threshold marker on meter -->
			<div class="rounded-2xl border-2 border-(--color-mist) bg-white p-4">
				<div class="mb-2 flex items-center justify-between">
					<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
						Trigger level
					</span>
					<span class="rounded-full bg-(--color-sunset-coral)/20 px-2 py-0.5 font-mono text-sm font-bold text-(--color-sunset-deep)">
						{sensitivity}
					</span>
				</div>
				<input
					type="range"
					min={20}
					max={220}
					step={5}
					bind:value={sensitivity}
					class="w-full accent-(--color-sunset-coral)"
				/>
				<div class="mt-0.5 flex justify-between text-xs text-(--color-night-soft)">
					<span>Whisper</span><span>Shout only</span>
				</div>
			</div>

			{#if triggerCount > 0}
				<div class="rounded-2xl bg-(--color-sunset-coral)/10 p-3 text-center">
					<p class="text-xs font-extrabold tracking-wide text-(--color-sunset-deep) uppercase">Triggered</p>
					<p class="font-mono text-3xl font-extrabold text-(--color-sunset-deep)">{triggerCount}×</p>
				</div>
			{/if}

			{#if !hasData}
				<p class="text-xs text-(--color-night-soft)">
					Start Ducky first — then arm the alarm and stay quiet.
				</p>
			{/if}
		</div>
	</div>
</div>
