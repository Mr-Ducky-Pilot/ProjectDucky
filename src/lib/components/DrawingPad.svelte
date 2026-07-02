<script lang="ts">
	type Props = {
		bits: boolean[];
		onchange: (bits: boolean[]) => void;
		size?: number; // total side length of the lit area (excl. padding)
	};

	let { bits, onchange, size = 260 }: Props = $props();

	// Same math as LedMatrix: 5*cell + 4*gap with gap = cell*0.16 → cell = size / 5.64
	const cell = $derived(size / 5.64);
	const gap = $derived(cell * 0.16);

	let painting = $state<null | 'on' | 'off'>(null);

	function toggle(i: number, mode: 'on' | 'off' | null = null) {
		const next = bits.slice();
		next[i] = mode === null ? !next[i] : mode === 'on';
		onchange(next);
	}

	function down(i: number) {
		const mode: 'on' | 'off' = bits[i] ? 'off' : 'on';
		painting = mode;
		toggle(i, mode);
	}
	function over(i: number) {
		if (!painting) return;
		toggle(i, painting);
	}
	function up() {
		painting = null;
	}

	function clear() {
		onchange(Array(25).fill(false));
	}
	function fill() {
		onchange(Array(25).fill(true));
	}
	function invert() {
		// Guard against a short/undefined bits array (shouldn't happen with the
		// fixed 25-cell grid, but keeps this safe regardless of caller input).
		onchange(Array.from({ length: 25 }, (_, i) => !bits[i]));
	}

	const presets: Record<string, string> = {
		Heart: '0101011111111110111000100',
		Smile: '0000010001000001000101110',
		Arrow: '0010001110111110010000100',
		Square: '1111110001100011000111111'
	};
	function applyPreset(name: string) {
		onchange(presets[name].split('').map((c) => c === '1'));
	}
</script>

<div class="flex w-full max-w-full flex-col items-center gap-3">
	<div
		role="application"
		aria-label="LED drawing grid"
		class="inline-grid w-fit max-w-full touch-none rounded-2xl bg-(--color-night-ink) p-3 shadow-[var(--shadow-soft)]"
		style="grid-template-columns: repeat(5, {cell}px); gap: {gap}px;"
		onpointerup={up}
		onpointerleave={up}
	>
		{#each Array(25) as _, i}
			<button
				type="button"
				aria-label={`pixel ${i + 1}`}
				aria-pressed={bits[i]}
				class="cursor-pointer rounded-md border-0 transition-all"
				style="
					width: {cell}px;
					height: {cell}px;
					background: {bits[i] ? '#ffd23a' : '#3a3f55'};
					box-shadow: {bits[i] ? `0 0 ${cell * 0.4}px #ffd23a` : 'none'};
					opacity: {bits[i] ? 1 : 0.4};
				"
				onpointerdown={(ev) => {
					ev.preventDefault();
					down(i);
				}}
				onpointerenter={() => over(i)}
			></button>
		{/each}
	</div>

	<div class="flex flex-wrap justify-center gap-2 text-xs">
		<button type="button" onclick={clear} class="pop-btn pop-btn--ghost px-3 py-2">Clear</button>
		<button type="button" onclick={fill} class="pop-btn pop-btn--ghost px-3 py-2">Fill</button>
		<button type="button" onclick={invert} class="pop-btn pop-btn--ghost px-3 py-2">Invert</button>
		{#each Object.keys(presets) as name}
			<button
				type="button"
				onclick={() => applyPreset(name)}
				class="pop-btn pop-btn--ghost px-3 py-2"
			>
				{name}
			</button>
		{/each}
	</div>
</div>
