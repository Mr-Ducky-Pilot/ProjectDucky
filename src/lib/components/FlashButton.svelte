<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import { setMood, say } from '$lib/stores/ducky';

	type Props = {
		hexUrl?: string;
		label?: string;
		flashedLabel?: string;
		onFlashed?: () => void;
	};

	let {
		hexUrl,
		label = 'Send to Ducky',
		flashedLabel = 'Sent!',
		onFlashed
	}: Props = $props();

	const conn = connection;
	let justFlashed = $state(false);
	let localError = $state<string | null>(null);

	async function flash() {
		localError = null;

		if (!hexUrl) {
			// universal-listener mission — nothing to flash, just trigger callback
			justFlashed = true;
			setMood('celebrating');
			say('Beamed it over!', 'celebrating');
			onFlashed?.();
			setTimeout(() => (justFlashed = false), 1600);
			return;
		}

		if ($conn.status === 'idle') {
			await connection.connect();
		}
		// User cancelled the picker or the connect failed — bail out instead of
		// trying to flash a nonexistent device.
		if (connection.getState().status !== 'connected') return;

		await connection.flash(hexUrl);
		const after = connection.getState();
		if (after.status === 'error') {
			// Common case: the firmware doesn't exist yet (M0 hasn't built it).
			// Surface a friendly message instead of the raw fetch error.
			if (/(\b404\b|firmware)/i.test(after.error ?? '')) {
				localError = "Firmware for this mission isn't built yet — try pretend mode while we get the .hex on disk.";
			} else {
				localError = after.error;
			}
			setMood('sad');
			return;
		}

		justFlashed = true;
		setMood('celebrating');
		say('Done — try it out!', 'celebrating');
		onFlashed?.();
		setTimeout(() => (justFlashed = false), 1800);
	}

	const busy = $derived($conn.status === 'flashing' || $conn.status === 'requesting');
</script>

<div class="flex flex-col items-start gap-2">
	<button
		type="button"
		onclick={flash}
		disabled={busy}
		class="pop-btn pop-btn--yellow w-full sm:w-auto"
	>
		{#if busy}
			Flashing… {Math.round(($conn.flash?.pct ?? 0) * 100)}%
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
