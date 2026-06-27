<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { buildL1Hex } from '$lib/firmware/build';
	import { progress, setPlayerName } from '$lib/stores/progress';
	import { FONT_3X5 } from '$lib/data/font3x5';
	import { setMood, say } from '$lib/stores/ducky';

	type Props = { complete: () => void };
	let { complete }: Props = $props();

	let name = $state($progress.playerName || 'Ada');
	let charIdx = $state(0);
	let sending = $state(false);
	let sent = $state(false);
	let errorMsg = $state<string | null>(null);

	// Character carousel: cycle through each letter of the name
	const letters = $derived(
		name
			.trim()
			.toUpperCase()
			.split('')
			.filter((c) => c in FONT_3X5 || c === ' ')
	);

	$effect(() => {
		const len = letters.length;
		charIdx = 0;
		if (len === 0) return;
		const id = setInterval(() => {
			charIdx = (charIdx + 1) % len;
		}, 550);
		return () => clearInterval(id);
	});

	// Build 5×5 bits: center the 3-wide glyph with 1px padding left/right
	const currentBits = $derived.by(() => {
		const chars = letters;
		if (chars.length === 0) return Array(25).fill(false);
		const ch = chars[charIdx] ?? ' ';
		const glyph = FONT_3X5[ch] ?? FONT_3X5['?'];
		const arr: boolean[] = Array(25).fill(false);
		for (let r = 0; r < 5; r++) {
			const row = glyph[r] ?? '000';
			for (let c = 0; c < 3; c++) {
				arr[r * 5 + (c + 1)] = row[c] === '1';
			}
		}
		return arr;
	});

	// Show letter label below the matrix
	const currentLetter = $derived(letters[charIdx] ?? '');

	async function sendToDevice() {
		if (sending) return;
		errorMsg = null;
		sending = true;

		try {
			const state = connection.getState();
			if (state.status === 'idle') {
				await connection.connect();
			}
			if (connection.getState().status !== 'connected') {
				sending = false;
				return;
			}

			// Flash L1 listener firmware if not already loaded
			if (connection.getState().lastFlashedFirmware !== 'l1') {
				const hex = await buildL1Hex();
				await connection.flash(hex, 'l1');
			}

			if (connection.getState().status === 'error') {
				errorMsg = connection.getState().error;
				setMood('sad');
				sending = false;
				return;
			}

			// Wait for MicroPython to boot and announce itself
			await connection.waitForReady();

			setPlayerName(name);
			await connection.send({ type: 'scroll', text: name.toUpperCase() });

			sent = true;
			setMood('celebrating');
			say(`Hi ${name}! 👋`, 'celebrating');
			complete();
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : String(err);
			setMood('sad');
		} finally {
			sending = false;
		}
	}
</script>

<div class="flex flex-col items-center gap-6">
	<!-- LED preview -->
	<div class="flex flex-col items-center gap-3">
		<p class="text-xs font-extrabold tracking-widest text-(--color-night-soft) uppercase">
			Live Preview
		</p>
		<div class="relative">
			<LedMatrix bits={currentBits} size={200} />
			{#if currentLetter && currentLetter !== ' '}
				<div
					class="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-(--color-night-ink) px-3 py-0.5 font-mono text-sm font-bold text-white"
				>
					{currentLetter}
				</div>
			{/if}
		</div>
	</div>

	<!-- Name input -->
	<label class="flex w-full max-w-sm flex-col gap-2 text-center" style="margin-top: 1.5rem;">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Your name
		</span>
		<input
			type="text"
			bind:value={name}
			maxlength="12"
			placeholder="e.g. ADA"
			class="rounded-2xl border-2 border-(--color-mist) bg-white px-4 py-3 text-center font-display text-2xl font-extrabold tracking-widest uppercase focus:border-(--color-pond-blue) focus:outline-none"
		/>
		<span class="text-xs text-(--color-night-soft)">
			Each letter shows on the micro:bit one at a time
		</span>
	</label>

	<!-- Send button -->
	<button
		type="button"
		onclick={sendToDevice}
		disabled={sending || !name.trim()}
		class="pop-btn pop-btn--yellow w-full max-w-sm"
	>
		{#if sending}
			Sending to Ducky…
		{:else if sent}
			✅ Sent! Watch Ducky scroll it
		{:else}
			Send my name to Ducky →
		{/if}
	</button>

	{#if errorMsg}
		<p class="max-w-sm rounded-xl bg-(--color-sunset-coral)/15 px-3 py-2 text-center text-xs text-(--color-sunset-deep)">
			{errorMsg}
		</p>
	{/if}
</div>
