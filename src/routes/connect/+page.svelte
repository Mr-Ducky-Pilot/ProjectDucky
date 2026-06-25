<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import { connection } from '$lib/stores/connection';
	import { petLabel } from '$lib/stores/pet';
	import dialogue from '$lib/data/dialogue.json';

	const conn = connection;

	async function handleConnect() {
		await connection.connect();
	}
	async function handleDisconnect() {
		await connection.disconnect();
	}
	async function togglePretend(value: boolean) {
		await connection.setPreferMock(value);
	}

	const stateLine = $derived.by(() => {
		switch ($conn.status) {
			case 'connected':
				return $conn.kind === 'real'
					? 'Hi! I can hear you now.'
					: dialogue['mock.connect'];
			case 'flashing':
				return dialogue['connect.flashing'];
			case 'error':
				return dialogue['connect.error'];
			case 'requesting':
				return 'Pick your micro:bit from the list…';
			default:
				return $conn.kind === 'mock' ? dialogue['mock.connect'] : dialogue['connect.idle'];
		}
	});

	const moodFor = $derived(
		$conn.status === 'connected'
			? 'celebrating'
			: $conn.status === 'error'
				? 'sad'
				: $conn.status === 'flashing'
					? 'thinking'
					: 'curious'
	);
</script>

<section class="px-5 py-10 sm:py-16">
	<div class="mx-auto flex max-w-3xl flex-col items-center text-center">
		<Ducky mood={moodFor} size={200} />
		<div class="mt-4">
			<SpeechBubble text={stateLine} typing={true} tone="hint" side="left" />
		</div>

		<div class="card mt-8 w-full max-w-xl rounded-3xl p-6 sm:p-8">
			{#if $conn.status === 'idle'}
				<h2 class="text-2xl">
					{$conn.kind === 'mock' ? 'Pretend mode is on' : 'Plug a micro:bit into your laptop'}
				</h2>

				{#if $conn.kind === 'real'}
					<ol class="mx-auto mt-3 max-w-md list-decimal space-y-2 pl-6 text-left text-(--color-night-soft)">
						<li>Use the USB cable in the box.</li>
						<li>Wait for the “MICROBIT” drive to appear on your computer.</li>
						<li>
							Click <strong>Connect {$petLabel}</strong>, pick your micro:bit from the
							browser pop-up.
						</li>
					</ol>

					{#if !$conn.webusbSupported}
						<p class="mt-3 rounded-2xl bg-(--color-sunset-coral)/15 p-3 text-sm text-(--color-sunset-deep)">
							Your browser doesn’t do WebUSB. Use Chrome or Edge for the real thing.
						</p>
					{/if}
				{:else}
					<p class="mx-auto mt-3 max-w-md text-(--color-night-soft)">
						No real micro:bit needed — {$petLabel} will pretend to be one. Sensors
						will show fake-but-believable values; flashes finish in a couple
						of seconds. Handy for poking around.
					</p>
				{/if}

				<button
					type="button"
					onclick={handleConnect}
					class="pop-btn pop-btn--blue mt-6"
					disabled={!$conn.webusbSupported && $conn.kind === 'real'}
				>
					{$conn.kind === 'mock' ? `Connect to pretend ${$petLabel}` : `Connect ${$petLabel}`}
				</button>
			{:else if $conn.status === 'connected'}
				<h2 class="text-2xl">
					{$conn.kind === 'real' ? `Real ${$petLabel} connected 🎉` : `Pretend ${$petLabel} online`}
				</h2>

				{#if $conn.deviceLabel}
					<dl class="mt-4 flex flex-col gap-1 text-sm text-(--color-night-soft) sm:flex-row sm:justify-center sm:gap-6">
						<div>
							<dt class="text-xs font-extrabold tracking-wide uppercase">Device</dt>
							<dd class="font-mono">{$conn.deviceLabel}</dd>
						</div>
						{#if $conn.deviceSerial}
							<div>
								<dt class="text-xs font-extrabold tracking-wide uppercase">Serial</dt>
								<dd class="font-mono">{$conn.deviceSerial}</dd>
							</div>
						{/if}
					</dl>
				{/if}

				<p class="mt-4 text-(--color-night-soft)">
					Hop into the journey and pick a mission. The connection follows you
					around the app.
				</p>
				<div class="mt-5 flex flex-wrap justify-center gap-3">
					<a href="/journey" class="pop-btn pop-btn--yellow">Open the journey →</a>
					<button type="button" onclick={handleDisconnect} class="pop-btn pop-btn--ghost">
						Disconnect
					</button>
				</div>
			{:else if $conn.status === 'requesting'}
				<h2 class="text-2xl">Picking a duck…</h2>
				<p class="mt-2 text-(--color-night-soft)">
					Choose your micro:bit from the browser pop-up. It’ll show up as
					“DAPLink CMSIS-DAP”.
				</p>
			{:else if $conn.status === 'flashing'}
				<h2 class="text-2xl">Sending firmware over…</h2>
				<div class="mx-auto mt-4 h-3 w-full max-w-sm overflow-hidden rounded-full bg-(--color-mist)">
					<div
						class="h-full rounded-full bg-(--color-duck-yellow-deep) transition-[width] duration-150"
						style="width: {Math.round(($conn.flash?.pct ?? 0) * 100)}%;"
					></div>
				</div>
				<p class="mt-2 font-mono text-xs text-(--color-night-soft)">
					{$conn.flash?.phase ?? ''} · {Math.round(($conn.flash?.pct ?? 0) * 100)}%
				</p>
			{:else if $conn.status === 'error'}
				<h2 class="text-2xl">Something didn’t click</h2>
				<p class="mt-2 break-words text-(--color-night-soft)">
					{$conn.error ?? 'Try unplugging the cable and plugging it back in.'}
				</p>
				<button type="button" onclick={handleConnect} class="pop-btn pop-btn--blue mt-4">
					Try again
				</button>
			{/if}
		</div>

		<!-- Pretend-mode toggle -->
		<div class="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-sm shadow-[var(--shadow-soft)]">
			<span class="font-bold">Use pretend mode</span>
			<button
				type="button"
				role="switch"
				aria-checked={$conn.preferMock}
				aria-label="Toggle pretend mode"
				onclick={() => togglePretend(!$conn.preferMock)}
				class="relative h-7 w-12 rounded-full transition-colors"
				style="background: {$conn.preferMock ? 'var(--color-pond-blue)' : 'var(--color-mist)'};"
			>
				<span
					class="absolute top-0.5 size-6 rounded-full bg-white shadow transition-transform"
					style="transform: translateX({$conn.preferMock ? '22px' : '2px'});"
				></span>
			</button>
		</div>
		<p class="mt-2 max-w-sm text-center text-xs text-(--color-night-soft)">
			{#if $conn.preferMock}
				No real device needed — {$petLabel} will simulate sensors and flashes.
			{:else if !$conn.webusbSupported}
				Your browser doesn’t support WebUSB; pretend mode is on automatically.
			{:else}
				Real WebUSB connection to a plugged-in micro:bit.
			{/if}
		</p>

		<div
			class="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-(--color-egg-cream-2) px-4 py-2 text-xs font-bold text-(--color-night-soft)"
		>
			Browser support:
			<span class="rounded-full bg-(--color-leaf-green)/20 px-2 py-0.5 text-(--color-leaf-deep)">Chrome ✓</span>
			<span class="rounded-full bg-(--color-leaf-green)/20 px-2 py-0.5 text-(--color-leaf-deep)">Edge ✓</span>
			<span class="rounded-full bg-(--color-mist) px-2 py-0.5 line-through opacity-70">Safari</span>
			<span class="rounded-full bg-(--color-mist) px-2 py-0.5 line-through opacity-70">Firefox</span>
		</div>
	</div>
</section>
