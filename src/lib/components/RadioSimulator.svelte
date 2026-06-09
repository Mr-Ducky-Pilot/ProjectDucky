<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';

	type LogEntry = { dir: 'sent' | 'recv'; payload: number; ts: number };

	let payload = $state(99);
	let log = $state<LogEntry[]>([]);
	let el = $state<HTMLDivElement | null>(null);

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type !== 'radio') return;
			log = [...log.slice(-19), { dir: 'recv', payload: e.payload, ts: Date.now() }];
			setTimeout(() => el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 0);
		});
		return off;
	});

	async function send() {
		const state = connection.getState();
		if (state.status !== 'connected') return;
		await connection.send({ type: 'radio-send', payload });
		log = [...log.slice(-19), { dir: 'sent', payload, ts: Date.now() }];
		setTimeout(() => el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 0);
	}
</script>

<div class="overflow-hidden rounded-2xl border-2 border-(--color-pond-blue)/30 bg-(--color-pond-blue)/5">
	<div class="flex items-center gap-3 border-b border-(--color-pond-blue)/20 px-4 py-3">
		<span class="text-lg">🦆</span>
		<div>
			<p class="font-display text-sm font-extrabold text-(--color-night-ink)">Duck B Simulator</p>
			<p class="text-xs text-(--color-night-soft)">Simulate a second board sending radio packets</p>
		</div>
	</div>

	<div class="p-4 flex flex-col gap-3">
		<div class="flex items-center gap-2">
			<label class="text-xs font-bold text-(--color-night-soft)" for="radio-payload">Payload</label>
			<input
				id="radio-payload"
				type="number"
				min={0}
				max={99999}
				bind:value={payload}
				class="w-24 rounded-lg border-2 border-(--color-pond-blue)/30 bg-white px-2 py-1 text-center font-mono text-sm font-bold text-(--color-night-ink) outline-none focus:border-(--color-pond-blue)"
			/>
			<button
				type="button"
				onclick={send}
				class="pop-btn pop-btn--blue text-sm"
			>
				📡 Send Wave
			</button>
		</div>

		<div
			bind:this={el}
			class="h-28 overflow-y-auto rounded-xl bg-(--color-night-ink) p-3 font-mono text-xs leading-relaxed"
		>
			{#if log.length === 0}
				<span class="text-white/25">No radio activity yet…</span>
			{:else}
				{#each log as entry}
					<div class="flex gap-2">
						{#if entry.dir === 'sent'}
							<span class="text-(--color-duck-yellow)">→ sent {entry.payload}</span>
						{:else}
							<span class="text-(--color-leaf-green)">← received {entry.payload}</span>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
