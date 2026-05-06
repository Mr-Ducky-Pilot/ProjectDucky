<script lang="ts">
	type Note = { name: string; freq: number; black?: boolean };

	type Props = {
		notes?: Note[];
		onpress: (note: Note) => void;
		recording?: { name: string }[];
	};

	const DEFAULT_NOTES: Note[] = [
		{ name: 'C4', freq: 262 },
		{ name: 'D4', freq: 294 },
		{ name: 'E4', freq: 330 },
		{ name: 'F4', freq: 349 },
		{ name: 'G4', freq: 392 },
		{ name: 'A4', freq: 440 },
		{ name: 'B4', freq: 494 },
		{ name: 'C5', freq: 523 }
	];

	let { notes = DEFAULT_NOTES, onpress, recording = [] }: Props = $props();

	let active = $state<string | null>(null);

	function press(n: Note) {
		active = n.name;
		onpress(n);
		setTimeout(() => {
			if (active === n.name) active = null;
		}, 200);
	}
</script>

<div class="flex w-full flex-col gap-3">
	<div
		class="flex w-full overflow-hidden rounded-2xl bg-(--color-night-ink) p-2 shadow-[var(--shadow-soft)]"
	>
		<div class="flex w-full gap-1">
			{#each notes as n}
				<button
					type="button"
					onpointerdown={() => press(n)}
					class="flex h-32 flex-1 items-end justify-center rounded-xl pb-3 font-mono text-xs font-bold text-(--color-night-ink) transition-transform"
					style="
						background: {active === n.name ? '#ffd23a' : 'white'};
						transform: translateY({active === n.name ? '4px' : '0'});
					"
				>
					{n.name}
				</button>
			{/each}
		</div>
	</div>

	{#if recording.length > 0}
		<div
			class="flex flex-wrap items-center gap-1 rounded-2xl bg-(--color-egg-cream-2) p-3 text-sm"
		>
			<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
				Tune:
			</span>
			{#each recording as r, i}
				<span class="rounded-lg bg-white px-2 py-0.5 font-mono">{r.name}</span>
				{#if i < recording.length - 1}
					<span class="text-(--color-night-soft)">→</span>
				{/if}
			{/each}
		</div>
	{/if}
</div>
