<script lang="ts">
	import DrawingPad from '$lib/components/DrawingPad.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { setMood } from '$lib/stores/ducky';

	let bits = $state<boolean[]>(Array(25).fill(false));
	let lastSent = $state<boolean[] | null>(null);
	let sending = $state(false);

	async function send() {
		sending = true;
		try {
			await connection.send({ type: 'matrix', bits });
			lastSent = bits.slice();
			setMood('celebrating');
			setTimeout(() => setMood('idle'), 800);
		} catch {
			// not connected — will show silently
		}
		sending = false;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="grid items-start gap-6 lg:grid-cols-[1fr_auto]">
		<div class="flex flex-col items-center gap-2">
			<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Draw here
			</span>
			<DrawingPad {bits} onchange={(b) => (bits = b)} size={220} />
		</div>

		<div class="flex flex-col items-center gap-3 lg:w-48">
			<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				On the chip
			</span>
			<LedMatrix bits={lastSent ?? Array(25).fill(false)} size={150} />

			<button
				type="button"
				onclick={send}
				disabled={sending}
				class="pop-btn pop-btn--yellow w-full"
			>
				{sending ? 'Sending…' : 'Beam to Ducky →'}
			</button>

			<p class="text-center text-xs text-(--color-night-soft)">
				{#if !lastSent}
					Start Ducky, then beam your drawing to the real LEDs.
				{:else}
					Sent! Tweak a pixel and beam again.
				{/if}
			</p>
		</div>
	</div>

	{#if lastSent}
		<div class="rounded-2xl bg-(--color-leaf-green)/10 p-3 text-center text-sm font-bold text-(--color-leaf-deep)">
			✅ Drawing beamed! Look at the real chip — does it match?
		</div>
	{/if}
</div>
