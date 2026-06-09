<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	const EMOTIONS = [
		{ name: 'happy', emoji: '😀', bits: '00000:01010:00000:10001:01110' },
		{ name: 'sad', emoji: '😢', bits: '00000:01010:00000:01110:10001' },
		{ name: 'love', emoji: '😍', bits: '01010:11111:11111:01110:00100' },
		{ name: 'cool', emoji: '😎', bits: '00000:11011:00000:01110:00000' },
		{ name: 'mad', emoji: '😡', bits: '10001:01010:00000:11111:10001' },
		{ name: 'tired', emoji: '😴', bits: '00000:11011:00000:00000:11111' }
	];

	function toBits(s: string) {
		return s.replace(/:/g, '').split('').map((c) => c === '1');
	}

	let lastSent = $state<number | null>(null);
	let lastReceived = $state<number | null>(null);
	let history = $state<Array<{ kind: 'sent' | 'recv'; idx: number; at: number }>>([]);

	function send(idx: number) {
		lastSent = idx;
		history = [{ kind: 'sent', idx, at: Date.now() }, ...history.slice(0, 9)];
		void connection.send({ type: 'matrix', bits: toBits(EMOTIONS[idx].bits) }).catch(() => {});
		void connection.send({ type: 'radio-send', payload: idx + 1 }).catch(() => {});
	}

	onMount(() => {
		return connection.onEvent((e) => {
			if (e.type === 'radio' && typeof e.payload === 'number' && e.payload >= 1 && e.payload <= EMOTIONS.length) {
				const idx = e.payload - 1;
				lastReceived = idx;
				history = [{ kind: 'recv', idx, at: Date.now() }, ...history.slice(0, 9)];
			}
		});
	});
</script>

<div class="flex flex-col items-center gap-6">
	<div class="grid grid-cols-3 gap-3">
		{#each EMOTIONS as e, i}
			<button
				class="grid place-items-center rounded-2xl bg-egg-cream p-4 text-4xl shadow-soft transition hover:-translate-y-1"
				class:ring-4={lastSent === i}
				class:ring-duck-yellow={lastSent === i}
				onclick={() => send(i)}
			>
				{e.emoji}
			</button>
		{/each}
	</div>

	<div class="grid grid-cols-2 gap-6">
		<div class="text-center">
			<p class="text-xs font-bold uppercase tracking-widest text-night-soft">You sent</p>
			<LedMatrix
				bits={lastSent !== null ? toBits(EMOTIONS[lastSent].bits) : Array(25).fill(false)}
				size={120}
				color="#ffd23a"
			/>
			<p class="mt-1 text-sm font-bold">
				{lastSent !== null ? EMOTIONS[lastSent].name : '—'}
			</p>
		</div>
		<div class="text-center">
			<p class="text-xs font-bold uppercase tracking-widest text-night-soft">Friend sent</p>
			<LedMatrix
				bits={lastReceived !== null ? toBits(EMOTIONS[lastReceived].bits) : Array(25).fill(false)}
				size={120}
				color="#4cc1ff"
			/>
			<p class="mt-1 text-sm font-bold">
				{lastReceived !== null ? EMOTIONS[lastReceived].name : 'Listening…'}
			</p>
		</div>
	</div>
</div>
