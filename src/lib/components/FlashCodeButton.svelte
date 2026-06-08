<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import { setMood, say } from '$lib/stores/ducky';
	import { buildCustomHex } from '$lib/firmware/build';

	type Props = {
		code: string;
		disabled?: boolean;
		label?: string;
		onFlashed?: () => void;
	};

	let { code, disabled = false, label = 'Flash My Code!', onFlashed }: Props = $props();

	const conn = connection;
	let building = $state(false);
	let justFlashed = $state(false);
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
			hex = await buildCustomHex(code);
		} catch (err) {
			localError = err instanceof Error ? err.message : 'Failed to build firmware.';
			setMood('sad');
			building = false;
			return;
		}
		building = false;

		await connection.flash(hex, 'custom');
		const after = connection.getState();
		if (after.status === 'error') {
			localError = after.error;
			setMood('sad');
			return;
		}

		justFlashed = true;
		setMood('celebrating');
		say('Your code is running!', 'celebrating');
		onFlashed?.();
		setTimeout(() => (justFlashed = false), 2500);
	}

	const busy = $derived(
		building || $conn.status === 'flashing' || $conn.status === 'requesting'
	);
</script>

<div class="flex flex-col items-start gap-2">
	<button
		type="button"
		onclick={flash}
		disabled={busy || disabled}
		class="pop-btn pop-btn--yellow w-full sm:w-auto"
	>
		{#if building}
			Building firmware…
		{:else if $conn.status === 'requesting'}
			Connecting…
		{:else if $conn.status === 'flashing'}
			Flashing… {Math.round(($conn.flash?.pct ?? 0) * 100)}%
		{:else if justFlashed}
			✅ Running on Ducky!
		{:else if disabled}
			Fill all the blanks first
		{:else}
			⚡ {label}
		{/if}
	</button>
	{#if localError}
		<p class="rounded-xl bg-(--color-sunset-coral)/15 px-3 py-2 text-xs text-(--color-sunset-deep)">
			{localError}
		</p>
	{/if}
</div>
