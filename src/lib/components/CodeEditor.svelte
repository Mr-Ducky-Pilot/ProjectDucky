<script lang="ts">
	type LineSegment =
		| { kind: 'code'; text: string }
		| { kind: 'gap'; index: number; placeholder: string };

	type Props = {
		template: string;
		code?: string;
		allFilled?: boolean;
	};

	let { template, code = $bindable(''), allFilled = $bindable(false) }: Props = $props();

	function parseTemplate(tmpl: string): { lines: LineSegment[][]; gapCount: number } {
		const segments: LineSegment[] = [];
		let gapIdx = 0;
		const regex = /___(?:\(([^)]*)\))?/g;
		let last = 0;
		let m: RegExpExecArray | null;

		while ((m = regex.exec(tmpl)) !== null) {
			if (m.index > last) segments.push({ kind: 'code', text: tmpl.slice(last, m.index) });
			segments.push({ kind: 'gap', index: gapIdx++, placeholder: m[1] ?? '' });
			last = regex.lastIndex;
		}
		if (last < tmpl.length) segments.push({ kind: 'code', text: tmpl.slice(last) });

		const lines: LineSegment[][] = [];
		let currentLine: LineSegment[] = [];

		for (const seg of segments) {
			if (seg.kind === 'code') {
				const parts = seg.text.split('\n');
				parts.forEach((part, i) => {
					if (i > 0) {
						lines.push(currentLine);
						currentLine = [];
					}
					if (part.length > 0) currentLine.push({ kind: 'code', text: part });
				});
			} else {
				currentLine.push(seg);
			}
		}
		lines.push(currentLine);

		return { lines, gapCount: gapIdx };
	}

	const { lines, gapCount } = parseTemplate(template);
	let values = $state(new Array(gapCount).fill(''));

	const assembled = $derived.by(() => {
		const regex = /___(?:\(([^)]*)\))?/g;
		let i = 0;
		return template.replace(regex, () => values[i++] || '___');
	});

	$effect(() => {
		code = assembled;
		allFilled = values.every((v) => v.trim() !== '');
	});

	const blanksLeft = $derived(values.filter((v) => !v.trim()).length);
</script>

<div class="overflow-hidden rounded-2xl bg-(--color-night-ink) font-mono text-sm leading-relaxed shadow-lg">
	<!-- macOS-style title bar -->
	<div class="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
		<div class="flex gap-1.5">
			<span class="size-3 rounded-full bg-[#ff5f57]"></span>
			<span class="size-3 rounded-full bg-[#febc2e]"></span>
			<span class="size-3 rounded-full bg-[#28c840]"></span>
		</div>
		<span class="ml-2 text-xs text-white/40">main.py</span>
		<span class="ml-auto text-xs font-bold"
			class:text-(--color-duck-yellow)={blanksLeft > 0}
			class:text-(--color-leaf-green)={blanksLeft === 0}
		>
			{#if blanksLeft > 0}
				{blanksLeft} blank{blanksLeft === 1 ? '' : 's'} to fill
			{:else}
				✓ All filled!
			{/if}
		</span>
	</div>

	<!-- Code body -->
	<div class="overflow-x-auto p-5">
		{#each lines as line}
			<div class="flex min-h-[1.6rem] items-center">
				{#each line as seg}
					{#if seg.kind === 'code'}
						<span class="whitespace-pre text-[#c9d1d9]">{seg.text}</span>
					{:else}
						<input
							class="mx-0.5 inline-block min-w-[3ch] rounded-md bg-(--color-duck-yellow) px-1.5 py-0.5 font-mono text-sm font-bold text-(--color-night-ink) outline-none transition focus:ring-2 focus:ring-(--color-duck-yellow)/60 focus:ring-offset-1 focus:ring-offset-(--color-night-ink)"
							style="width: {Math.max(3, (seg.placeholder.length || 1) + 1)}ch;"
							placeholder={seg.placeholder || '?'}
							bind:value={values[seg.index]}
						/>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
</div>
