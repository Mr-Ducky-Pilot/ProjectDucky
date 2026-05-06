<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { connection } from '$lib/stores/connection';
	import { progress, setPlayerName } from '$lib/stores/progress';
	import { renderText } from '$lib/data/font3x5';

	type Props = { complete: () => void };
	let { complete }: Props = $props();

	let name = $state($progress.playerName || 'Ada');

	// Render the full word as a 5-row bitmap then animate a 5-column window
	// across it, exactly like the micro:bit's scrollText does.
	const rendered = $derived(renderText(name || 'A', { trailingPad: 6 }));

	let offset = $state(0);

	$effect(() => {
		// Re-read width so the effect resets when the user types.
		const w = rendered.width;
		offset = 0;
		const id = setInterval(() => {
			offset = (offset + 1) % Math.max(1, w);
		}, 280);
		return () => clearInterval(id);
	});

	const previewBits = $derived.by(() => {
		const arr: boolean[] = Array(25).fill(false);
		for (let r = 0; r < 5; r++) {
			for (let c = 0; c < 5; c++) {
				const srcCol = (offset + c) % rendered.width;
				const ch = rendered.rows[r][srcCol];
				arr[r * 5 + c] = ch === '1';
			}
		}
		return arr;
	});

	async function send() {
		setPlayerName(name);
		await connection.send({ type: 'scroll', text: name });
		complete();
	}
</script>

<div class="flex flex-col items-center gap-5">
	<LedMatrix bits={previewBits} size={200} />

	<label class="flex w-full max-w-md flex-col gap-2 text-center">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Your name
		</span>
		<input
			type="text"
			bind:value={name}
			maxlength="14"
			class="rounded-2xl border-2 border-(--color-mist) bg-white px-4 py-3 text-center font-display text-xl font-extrabold focus:border-(--color-pond-blue) focus:outline-none"
		/>
	</label>

	<button type="button" onclick={send} class="pop-btn pop-btn--yellow">
		Send my name to Ducky →
	</button>
</div>
