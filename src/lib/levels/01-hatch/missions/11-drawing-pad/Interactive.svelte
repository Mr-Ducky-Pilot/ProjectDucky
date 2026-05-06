<script lang="ts">
	import DrawingPad from '$lib/components/DrawingPad.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';

	type Props = { complete: () => void };
	let { complete }: Props = $props();

	let bits = $state<boolean[]>('0110011111111110111000100'.split('').map((c) => c === '1'));
	let lastSent = $state<boolean[] | null>(null);

	async function send() {
		await connection.send({ type: 'matrix', bits });
		lastSent = bits.slice();
		complete();
	}
</script>

<div class="flex flex-col items-stretch gap-6 lg:flex-row lg:items-start">
	<div class="flex min-w-0 flex-1 flex-col items-center gap-2">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Your canvas
		</span>
		<DrawingPad {bits} onchange={(b) => (bits = b)} size={240} />
	</div>

	<div class="flex flex-col items-center gap-3 lg:w-44">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			On the chip
		</span>
		<LedMatrix bits={lastSent ?? Array(25).fill(false)} size={140} />
		<button type="button" onclick={send} class="pop-btn pop-btn--yellow w-full">
			Beam to Ducky →
		</button>
		<p class="text-center text-xs text-(--color-night-soft)">
			{lastSent
				? 'Sent! Tweak a pixel and beam again.'
				: 'Hit beam to copy your drawing onto the real LEDs.'}
		</p>
	</div>
</div>
