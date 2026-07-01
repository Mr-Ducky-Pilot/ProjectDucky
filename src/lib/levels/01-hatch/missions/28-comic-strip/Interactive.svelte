<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import DrawingPad from '$lib/components/DrawingPad.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	type Panel = { bits: boolean[]; caption: string };

	const empty = (): Panel => ({ bits: Array(25).fill(false), caption: '' });
	let panels = $state<Panel[]>([empty(), empty(), empty(), empty()]);
	let activeIdx = $state(0);
	let playing = $state(false);

	function setBits(b: boolean[]) {
		panels[activeIdx].bits = b;
		panels = panels;
	}

	async function play() {
		playing = true;
		for (const p of panels) {
			void connection.send({ type: 'matrix', bits: p.bits }).catch(() => {});
			await new Promise((r) => setTimeout(r, 1800));
		}
		playing = false;
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-wrap gap-3">
		{#each panels as p, i}
			<button
				class="flex flex-col items-center gap-1 rounded-2xl p-2 transition"
				class:bg-duck-yellow={activeIdx === i}
				class:bg-mist={activeIdx !== i}
				onclick={() => (activeIdx = i)}
			>
				<LedMatrix bits={p.bits} size={70} color="#1c1f2e" />
				<p class="max-w-[70px] truncate text-[10px] font-bold text-night-ink">
					{p.caption || `Panel ${i + 1}`}
				</p>
			</button>
		{/each}
	</div>

	<div class="grid items-start gap-6 lg:grid-cols-2">
		<DrawingPad bits={panels[activeIdx].bits} onchange={setBits} />
		<div class="space-y-3">
			<label class="block">
				<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Caption</span>
				<input
					class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2"
					placeholder="Once upon a time..."
					maxlength="32"
					bind:value={panels[activeIdx].caption}
				/>
			</label>
			<button
				class="rounded-full bg-night-ink px-5 py-3 font-display font-bold text-white"
				disabled={playing}
				onclick={play}
			>
				{playing ? '▶ Playing…' : '▶ Play the strip'}
			</button>
		</div>
	</div>
</div>
