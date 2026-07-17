<script lang="ts">
	type LineSegment =
		| { kind: 'code'; text: string }
		| { kind: 'gap'; index: number; placeholder: string }
		| { kind: 'gap-ml'; index: number; placeholder: string };

	type Props = {
		template: string;
		code?: string;
		allFilled?: boolean;
		/**
		 * Suggested reference solutions for multi-line (___ml) blanks, keyed by
		 * the blank's gap index (same numbering as every gap in the template,
		 * counted left-to-right/top-to-bottom). Only needed for blanks where
		 * "fill it for me" should be offered — blanks without an entry here
		 * just don't get the button.
		 */
		mlSuggestions?: Record<number, string>;
	};

	let { template, code = $bindable(''), allFilled = $bindable(false), mlSuggestions = {} }: Props = $props();

	// Match ___ml(hint) first so it takes priority over ___(hint)
	const GAP_RE = /___ml\(([^)]*)\)|___\(([^)]*)\)|___/g;

	function parseTemplate(tmpl: string): { lines: LineSegment[][]; gapCount: number } {
		const segments: LineSegment[] = [];
		let gapIdx = 0;
		const regex = new RegExp(GAP_RE.source, 'g');
		let last = 0;
		let m: RegExpExecArray | null;

		while ((m = regex.exec(tmpl)) !== null) {
			if (m.index > last) segments.push({ kind: 'code', text: tmpl.slice(last, m.index) });
			if (m[0].startsWith('___ml')) {
				segments.push({ kind: 'gap-ml', index: gapIdx++, placeholder: m[1] ?? '' });
			} else {
				segments.push({ kind: 'gap', index: gapIdx++, placeholder: m[2] ?? '' });
			}
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

	// Compute leading whitespace for each ml gap so assembly can re-indent
	function computeMlIndents(tmpl: string): Record<number, string> {
		const result: Record<number, string> = {};
		const regex = new RegExp(GAP_RE.source, 'g');
		let gapIdx = 0;
		let m: RegExpExecArray | null;
		while ((m = regex.exec(tmpl)) !== null) {
			if (m[0].startsWith('___ml')) {
				const lineStart = tmpl.lastIndexOf('\n', m.index) + 1;
				const before = tmpl.slice(lineStart, m.index);
				result[gapIdx] = before.match(/^(\s*)/)?.[1] ?? '';
			}
			gapIdx++;
		}
		return result;
	}

	const NUMERIC_RE = /^-?\d+(\.\d+)?$/;

	// A blank whose hint (`___(10)`, `___(0.2)`) is itself a bare number is a
	// numeric slot — a non-numeric answer there flashes fine (all blanks
	// "filled") but crashes the board at runtime with a Python NameError the
	// moment it runs, with no way to surface that back to the browser. Flag
	// those gaps so we can reject non-numeric input before it ever flashes.
	function computeNumericGaps(tmpl: string): boolean[] {
		const result: boolean[] = [];
		const regex = new RegExp(GAP_RE.source, 'g');
		let m: RegExpExecArray | null;
		while ((m = regex.exec(tmpl)) !== null) {
			const hint = m[0].startsWith('___ml') ? m[1] : m[2];
			result.push(!m[0].startsWith('___ml') && NUMERIC_RE.test((hint ?? '').trim()));
		}
		return result;
	}

	const { lines, gapCount } = parseTemplate(template);
	const mlIndents = computeMlIndents(template);
	const numericGaps = computeNumericGaps(template);

	function gapIsValid(idx: number, v: string): boolean {
		const trimmed = v.trim();
		if (trimmed === '') return false;
		if (numericGaps[idx] && !NUMERIC_RE.test(trimmed)) return false;
		return true;
	}

	// Non-empty but not a valid number — distinct from "still blank" so a kid
	// gets a nudge instead of a silently-stuck flash button.
	function gapNeedsNumber(idx: number): boolean {
		const v = (values[idx] ?? '').trim();
		return numericGaps[idx] && v !== '' && !NUMERIC_RE.test(v);
	}
	const hasMlGaps = lines.some((line) => line.some((s) => s.kind === 'gap-ml'));
	let values = $state(new Array(gapCount).fill(''));
	let filledForMe = $state(new Set<number>());

	const assembled = $derived.by(() => {
		const regex = new RegExp(GAP_RE.source, 'g');
		let i = 0;
		return template.replace(regex, (match) => {
			const idx = i++;
			const val = values[idx];
			if (match.startsWith('___ml')) {
				if (!val) return match;
				const indent = mlIndents[idx] ?? '';
				// First line keeps the template's leading indent; subsequent lines get it prepended
				return val.split('\n').join('\n' + indent);
			}
			return val || match;
		});
	});

	$effect(() => {
		code = assembled;
		allFilled = values.every((v, i) => gapIsValid(i, v));
	});

	const blanksLeft = $derived(values.filter((v, i) => !gapIsValid(i, v)).length);

	function autoResize(el: HTMLTextAreaElement) {
		el.style.height = 'auto';
		el.style.height = el.scrollHeight + 'px';
	}

	function fillForMe(idx: number) {
		const suggestion = mlSuggestions[idx];
		if (!suggestion) return;
		values[idx] = suggestion;
		filledForMe.add(idx);
		filledForMe = filledForMe;
	}

	// Reactive width: grows with whichever is longer, the hint or what's
	// actually been typed, so digits never get clipped once a value is longer
	// than the original placeholder suggested. The buffer has to be generous —
	// box-sizing is border-box (Tailwind Preflight), so the input's own
	// horizontal padding (px-2.5 = 20px, ~2.4ch at this font size) eats into
	// whatever width we set here, not on top of it.
	function gapWidthCh(placeholder: string, value: string): number {
		return Math.max(6, Math.max(placeholder.length, value.length) + 6);
	}
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

	{#if hasMlGaps}
		<div class="border-b border-white/10 bg-white/5 px-4 py-2 text-xs text-white/50">
			💡 The highlighted boxes want real MicroPython, not just a value — write it the way the rest of
			the file is written (same style of function calls, one idea per line).
		</div>
	{/if}

	<!-- Code body -->
	<div class="overflow-x-auto p-5">
		{#each lines as line}
			{#if line.some((s) => s.kind === 'gap-ml')}
				<!-- Block line containing a multi-line gap -->
				<div class="my-1.5">
					{#each line as seg}
						{#if seg.kind === 'code'}
							<span class="whitespace-pre text-[#c9d1d9]">{seg.text}</span>
						{:else if seg.kind === 'gap'}
							<input
								class="mx-0.5 inline-block min-w-[3ch] rounded-md bg-(--color-duck-yellow) px-2.5 py-1 font-mono text-sm font-bold text-(--color-night-ink) outline-none transition focus:ring-2 focus:ring-(--color-duck-yellow)/60 focus:ring-offset-1 focus:ring-offset-(--color-night-ink)"
								class:ring-2={gapNeedsNumber(seg.index)}
								class:ring-(--color-sunset-coral)={gapNeedsNumber(seg.index)}
								style="width: {gapWidthCh(seg.placeholder, values[seg.index] ?? '')}ch;"
								placeholder={seg.placeholder || '?'}
								inputmode={numericGaps[seg.index] ? 'decimal' : 'text'}
								title={gapNeedsNumber(seg.index) ? 'This one needs a number' : undefined}
								bind:value={values[seg.index]}
							/>
						{:else if seg.kind === 'gap-ml'}
							<div class="mt-1.5 flex flex-col gap-1.5">
								{#if seg.placeholder}
									<p class="text-xs font-bold text-(--color-duck-yellow)/80">
										💬 {seg.placeholder}
									</p>
								{/if}
								<textarea
									class="block w-full resize-none rounded-lg border-2 border-(--color-duck-yellow)/50 bg-(--color-duck-yellow)/8 px-3 py-2 font-mono text-sm text-(--color-duck-yellow) outline-none transition placeholder-[#c9d1d9]/30 focus:border-(--color-duck-yellow) focus:bg-(--color-duck-yellow)/12"
									placeholder="write your code here…"
									rows={3}
									bind:value={values[seg.index]}
									oninput={(e) => autoResize(e.currentTarget)}
								></textarea>
								{#if mlSuggestions[seg.index]}
									<div class="flex items-center gap-2">
										<button
											type="button"
											onclick={() => fillForMe(seg.index)}
											class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 transition hover:bg-white/20"
										>
											✨ Fill it for me
										</button>
										<span class="text-[11px] text-white/35">
											{filledForMe.has(seg.index)
												? 'Filled — feel free to change it, that\'s the fun part.'
												: 'Try writing it yourself first — it sticks better. Stuck? This shows one way to do it.'}
										</span>
									</div>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			{:else}
				<!-- Normal inline line -->
				<div class="flex min-h-[1.6rem] items-center">
					{#each line as seg}
						{#if seg.kind === 'code'}
							<span class="whitespace-pre text-[#c9d1d9]">{seg.text}</span>
						{:else}
							<input
								class="mx-0.5 inline-block min-w-[3ch] rounded-md bg-(--color-duck-yellow) px-2.5 py-1 font-mono text-sm font-bold text-(--color-night-ink) outline-none transition focus:ring-2 focus:ring-(--color-duck-yellow)/60 focus:ring-offset-1 focus:ring-offset-(--color-night-ink)"
								class:ring-2={gapNeedsNumber(seg.index)}
								class:ring-(--color-sunset-coral)={gapNeedsNumber(seg.index)}
								style="width: {gapWidthCh(seg.placeholder, values[seg.index] ?? '')}ch;"
								placeholder={seg.placeholder || '?'}
								inputmode={numericGaps[seg.index] ? 'decimal' : 'text'}
								title={gapNeedsNumber(seg.index) ? 'This one needs a number' : undefined}
								bind:value={values[seg.index]}
							/>
						{/if}
					{/each}
				</div>
			{/if}
		{/each}
	</div>
</div>
