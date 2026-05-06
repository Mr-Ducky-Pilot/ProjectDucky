<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import { connection } from '$lib/stores/connection';
	import dialogue from '$lib/data/dialogue.json';

	const conn = connection;

	async function pretendConnect() {
		await connection.connect();
	}
	function disconnect() {
		void connection.disconnect();
	}

	const stateLine = $derived.by(() => {
		switch ($conn.status) {
			case 'connected':
				return dialogue['connect.connected'];
			case 'flashing':
				return dialogue['connect.flashing'];
			case 'error':
				return dialogue['connect.error'];
			case 'requesting':
				return 'Looking for ducks…';
			default:
				return dialogue['connect.idle'];
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
				<h2 class="text-2xl">Plug a micro:bit into your laptop</h2>
				<ol class="mx-auto mt-3 max-w-md list-decimal space-y-2 pl-6 text-left text-(--color-night-soft)">
					<li>Use the USB cable in the box.</li>
					<li>Wait for the “MICROBIT” drive to appear.</li>
					<li>Tap <strong>Connect Ducky</strong> below and pick it from the list.</li>
				</ol>
				<button type="button" onclick={pretendConnect} class="pop-btn pop-btn--blue mt-6">
					Connect Ducky
				</button>
				<p class="mt-3 text-xs text-(--color-night-soft)">
					Pretend mode is on — handy when your kit is in another room.
				</p>
			{:else if $conn.status === 'connected'}
				<h2 class="text-2xl">All set 🎉</h2>
				<p class="mt-2 text-(--color-night-soft)">
					Your duck is ready. Hop into the journey and pick a mission.
				</p>
				<div class="mt-5 flex flex-wrap justify-center gap-3">
					<a href="/journey" class="pop-btn pop-btn--yellow">Open the journey →</a>
					<button type="button" onclick={disconnect} class="pop-btn pop-btn--ghost">
						Disconnect
					</button>
				</div>
			{:else if $conn.status === 'flashing'}
				<h2 class="text-2xl">Sending it over…</h2>
				<div class="mx-auto mt-4 h-3 w-full max-w-sm overflow-hidden rounded-full bg-(--color-mist)">
					<div
						class="h-full rounded-full bg-(--color-duck-yellow-deep) transition-[width] duration-150"
						style="width: {Math.round(($conn.flash?.pct ?? 0) * 100)}%;"
					></div>
				</div>
			{:else if $conn.status === 'error'}
				<h2 class="text-2xl">Something didn’t click</h2>
				<p class="mt-2 text-(--color-night-soft)">
					{$conn.error ?? 'Try unplugging the cable and plugging it back in.'}
				</p>
				<button type="button" onclick={pretendConnect} class="pop-btn pop-btn--blue mt-4">
					Try again
				</button>
			{:else}
				<h2 class="text-2xl">Just a sec…</h2>
			{/if}
		</div>

		<div
			class="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-(--color-egg-cream-2) px-4 py-2 text-xs font-bold text-(--color-night-soft)"
		>
			Browser support:
			<span class="rounded-full bg-(--color-leaf-green)/20 px-2 py-0.5 text-(--color-leaf-deep)">Chrome ✓</span>
			<span class="rounded-full bg-(--color-leaf-green)/20 px-2 py-0.5 text-(--color-leaf-deep)">Edge ✓</span>
			<span class="rounded-full bg-(--color-mist) px-2 py-0.5 line-through opacity-70">Safari</span>
			<span class="rounded-full bg-(--color-mist) px-2 py-0.5 line-through opacity-70">Firefox</span>
		</div>
	</div>
</section>
