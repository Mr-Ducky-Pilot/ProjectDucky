<script lang="ts">
	import { onMount } from 'svelte';
	import { connection } from '$lib/stores/connection';

	type Props = {
		title?: string;
		filter?: (text: string) => boolean;
		maxLines?: number;
	};

	let {
		title = 'Board Output',
		filter = () => true,
		maxLines = 60
	}: Props = $props();

	type LogLine = { ts: number; text: string };
	let lines = $state<LogLine[]>([]);
	let el = $state<HTMLDivElement | null>(null);

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type !== 'log') return;
			if (!filter(e.text)) return;
			lines = [...lines.slice(-(maxLines - 1)), { ts: Date.now(), text: e.text }];
			// auto-scroll
			setTimeout(() => el?.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }), 0);
		});
		return off;
	});

	function clear() {
		lines = [];
	}

	function fmtTime(ts: number) {
		const d = new Date(ts);
		return `${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}.${String(d.getMilliseconds()).slice(0, 2).padStart(2, '0')}`;
	}
</script>

<div class="overflow-hidden rounded-2xl bg-(--color-night-ink) font-mono text-sm shadow-lg">
	<div class="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
		<div class="flex gap-1.5">
			<span class="size-3 rounded-full bg-[#ff5f57]"></span>
			<span class="size-3 rounded-full bg-[#febc2e]"></span>
			<span class="size-3 rounded-full bg-[#28c840]"></span>
		</div>
		<span class="ml-2 text-xs text-white/40">{title}</span>
		<button
			type="button"
			onclick={clear}
			class="ml-auto text-xs text-white/30 transition hover:text-white/60"
		>clear</button>
	</div>

	<div
		bind:this={el}
		class="h-40 overflow-y-auto p-4 leading-relaxed"
	>
		{#if lines.length === 0}
			<span class="text-white/25">Waiting for board output… (flash your code first)</span>
		{:else}
			{#each lines as line}
				<div class="flex gap-3">
					<span class="shrink-0 text-white/25">{fmtTime(line.ts)}</span>
					<span class="text-(--color-leaf-green)">{line.text}</span>
				</div>
			{/each}
		{/if}
	</div>
</div>
