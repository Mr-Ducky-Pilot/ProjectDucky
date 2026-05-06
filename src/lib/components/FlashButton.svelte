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

	async function flash() {
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
		await connection.flash(hexUrl);
		justFlashed = true;
		setMood('celebrating');
		say('Done — try it out!', 'celebrating');
		onFlashed?.();
		setTimeout(() => (justFlashed = false), 1800);
	}

	const busy = $derived($conn.status === 'flashing' || $conn.status === 'requesting');
</script>

<button type="button" onclick={flash} disabled={busy} class="pop-btn pop-btn--yellow w-full sm:w-auto">
	{#if busy}
		Flashing… {Math.round(($conn.flash?.pct ?? 0) * 100)}%
	{:else if justFlashed}
		✅ {flashedLabel}
	{:else}
		{label}
	{/if}
</button>
