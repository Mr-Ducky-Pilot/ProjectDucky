<script lang="ts">
	type Props = {
		title?: string;
		challenges: string[];
	};

	let { title = 'Your Turn 🎯', challenges }: Props = $props();

	let checked = $state(new Array(challenges.length).fill(false));
	const allDone = $derived(checked.every(Boolean));
	const doneCount = $derived(checked.filter(Boolean).length);
</script>

<div
	class="rounded-2xl border-2 p-5 transition-colors"
	style={allDone
		? 'border-color: color-mix(in srgb, var(--color-leaf-green) 60%, transparent); background: color-mix(in srgb, var(--color-leaf-green) 5%, transparent);'
		: 'border-color: color-mix(in srgb, var(--color-duck-yellow) 50%, transparent);'}
>
	<div class="mb-4 flex items-center gap-3">
		<h3
			class="font-display text-lg font-extrabold"
			style={allDone ? 'color: var(--color-leaf-green)' : 'color: var(--color-duck-yellow)'}
		>{title}</h3>
		{#if challenges.length > 1}
			<span class="ml-auto text-xs font-bold text-(--color-night-soft)">{doneCount}/{challenges.length}</span>
		{/if}
	</div>

	<ul class="space-y-3">
		{#each challenges as challenge, i}
			<li class="flex items-start gap-3">
				<button
					type="button"
					onclick={() => { checked[i] = !checked[i]; }}
					class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-xs font-extrabold transition"
					style={checked[i]
						? 'background: var(--color-duck-yellow); color: var(--color-night-ink); border: 2px solid transparent;'
						: 'background: transparent; border: 2px solid var(--color-duck-yellow);'}
					aria-label={checked[i] ? 'Uncheck challenge' : 'Check challenge'}
				>
					{#if checked[i]}✓{/if}
				</button>
				<span
					class="text-sm leading-relaxed"
					class:line-through={checked[i]}
					class:text-\(--color-night-soft\)={checked[i]}
				>{challenge}</span>
			</li>
		{/each}
	</ul>

	{#if allDone}
		<div class="mt-4 rounded-xl p-4 text-center" style="background: color-mix(in srgb, var(--color-leaf-green) 20%, transparent);">
			<p class="font-display text-lg font-extrabold" style="color: var(--color-leaf-deep)">🏆 Brilliant work!</p>
			<p class="mt-1 text-sm text-(--color-night-soft)">You've completed every challenge.</p>
		</div>
	{/if}
</div>
