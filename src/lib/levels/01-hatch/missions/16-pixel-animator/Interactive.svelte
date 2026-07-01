<script lang="ts">
	import DrawingPad from '$lib/components/DrawingPad.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { setMood } from '$lib/stores/ducky';

	const FRAME_COUNT = 3;
	let frames = $state<boolean[][]>(Array.from({ length: FRAME_COUNT }, () => Array(25).fill(false)));
	let activeFrame = $state(0);
	let delay = $state(300);
	let playing = $state(false);
	let previewFrame = $state(0);
	let playInterval: ReturnType<typeof setInterval> | null = null;
	let previewInterval: ReturnType<typeof setInterval> | null = null;

	const currentBits = $derived(frames[activeFrame]);

	function setFrame(idx: number, bits: boolean[]) {
		frames = frames.map((f, i) => (i === idx ? bits : f));
	}

	function startPreview() {
		if (previewInterval) clearInterval(previewInterval);
		previewInterval = setInterval(() => {
			previewFrame = (previewFrame + 1) % FRAME_COUNT;
		}, delay);
	}

	function stopPreview() {
		if (previewInterval) clearInterval(previewInterval);
		previewInterval = null;
	}

	async function play() {
		if (playing) {
			playing = false;
			if (playInterval) { clearInterval(playInterval); playInterval = null; }
			// Stop animation on board
			void connection.send({ type: 'quit' }).catch(() => {});
			return;
		}
		playing = true;
		setMood('celebrating');
		let f = 0;

		async function sendFrame() {
			void connection.send({ type: 'matrix', bits: frames[f] }).catch(() => {});
			previewFrame = f;
			f = (f + 1) % FRAME_COUNT;
		}

		await sendFrame();
		playInterval = setInterval(() => { void sendFrame(); }, delay);
	}

	$effect(() => {
		startPreview();
		return stopPreview;
	});
</script>

<div class="flex flex-col gap-6">
	<!-- Frame tabs -->
	<div class="flex items-center gap-3">
		{#each Array(FRAME_COUNT) as _, i}
			<button
				type="button"
				onclick={() => (activeFrame = i)}
				class="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-extrabold transition"
				class:bg-(--color-duck-yellow)={activeFrame === i}
				class:text-(--color-night-ink)={activeFrame === i}
				class:bg-(--color-mist)={activeFrame !== i}
				class:text-(--color-night-soft)={activeFrame !== i}
			>
				Frame {i + 1}
			</button>
		{/each}
		<span class="ml-auto text-xs text-(--color-night-soft)">Editing frame {activeFrame + 1}</span>
	</div>

	<div class="grid items-start gap-6 lg:grid-cols-[1fr_auto]">
		<!-- Drawing pad for active frame -->
		<div class="flex flex-col items-center gap-2">
			<DrawingPad bits={currentBits} onchange={(b) => setFrame(activeFrame, b)} size={220} />
		</div>

		<!-- Preview + controls -->
		<div class="flex w-52 flex-col items-center gap-4">
			<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Preview (live)
			</span>
			<LedMatrix bits={frames[previewFrame]} size={150} />

			<div class="w-full">
				<div class="mb-1 flex items-center justify-between text-xs text-(--color-night-soft)">
					<span>Speed</span>
					<span class="font-mono font-bold">{delay}ms / frame</span>
				</div>
				<input
					type="range"
					min={80}
					max={1000}
					step={20}
					bind:value={delay}
					class="w-full accent-(--color-duck-yellow)"
				/>
				<div class="mt-0.5 flex justify-between text-xs text-(--color-night-soft)">
					<span>Fast</span><span>Slow</span>
				</div>
			</div>

			<button
				type="button"
				onclick={play}
				class="pop-btn w-full"
				class:pop-btn--yellow={!playing}
				class:pop-btn--ghost={playing}
			>
				{playing ? '⏹ Stop' : '▶ Play on Ducky'}
			</button>
		</div>
	</div>

	<!-- Frame strip -->
	<div class="flex items-center gap-3 overflow-x-auto pb-1">
		{#each frames as frame, i}
			<button
				type="button"
				onclick={() => (activeFrame = i)}
				class="shrink-0 rounded-xl p-1 transition"
				class:ring-2={activeFrame === i}
				class:ring-(--color-duck-yellow)={activeFrame === i}
			>
				<LedMatrix bits={frame} size={70} />
				<p class="mt-1 text-center text-xs font-bold text-(--color-night-soft)">{i + 1}</p>
			</button>
		{/each}
	</div>

	<YourTurn challenges={[
		'Animate a bouncing ball: single dot at the top in frame 1, middle in frame 2, bottom in frame 3.',
		'Make a "winking face" — 3 frames where an eye closes then opens again.',
		'Set the delay to 150ms and play — does it feel like smooth motion?'
	]} />
</div>
