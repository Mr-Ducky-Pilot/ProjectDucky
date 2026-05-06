<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import { setMood, say } from '$lib/stores/ducky';
	import { buildDuckyHex } from '$lib/firmware/build';

	type Props = {
		preset?: string;
		label?: string;
		flashedLabel?: string;
		onFlashed?: () => void;
	};

	let {
		preset,
		label = 'Send to Ducky',
		flashedLabel = 'Sent!',
		onFlashed
	}: Props = $props();

	const conn = connection;
	let justFlashed = $state(false);
	let building = $state(false);
	let booting = $state(false);
	let localError = $state<string | null>(null);

	async function flash() {
		localError = null;

		if ($conn.status === 'idle') {
			await connection.connect();
		}
		if (connection.getState().status !== 'connected') return;

		building = true;
		let hex: ArrayBuffer;
		try {
			hex = await buildDuckyHex();
		} catch (err) {
			localError = err instanceof Error ? err.message : 'Failed to build firmware.';
			setMood('sad');
			building = false;
			return;
		}
		building = false;

		await connection.flash(hex);
		const after = connection.getState();
		if (after.status === 'error') {
			localError = after.error;
			setMood('sad');
			return;
		}

		if (preset) {
			// Board resets after flash — wait for MicroPython to boot before
			// sending serial commands, otherwise they're lost.
			booting = true;
			await connection.waitForReady();
			booting = false;
			try {
				await connection.send({ type: 'preset', name: preset });
			} catch {
				// non-fatal
			}
		}

		justFlashed = true;
		setMood('celebrating');
		say('Done — try it out!', 'celebrating');
		onFlashed?.();
		setTimeout(() => (justFlashed = false), 1800);
	}

	const busy = $derived(
		building || booting || $conn.status === 'flashing' || $conn.status === 'requesting'
	);
</script>

<div class="flex flex-col items-start gap-2">
	<button
		type="button"
		onclick={flash}
		disabled={busy}
		class="pop-btn pop-btn--yellow w-full sm:w-auto"
	>
		{#if building}
			Building firmware…
		{:else if $conn.status === 'requesting'}
			Connecting…
		{:else if $conn.status === 'flashing'}
			Flashing… {Math.round(($conn.flash?.pct ?? 0) * 100)}%
		{:else if booting}
			Booting Ducky…
		{:else if justFlashed}
			✅ {flashedLabel}
		{:else}
			{label}
		{/if}
	</button>
	{#if localError}
		<p class="rounded-xl bg-(--color-sunset-coral)/15 px-3 py-2 text-xs text-(--color-sunset-deep)">
			{localError}
		</p>
	{/if}
</div>
