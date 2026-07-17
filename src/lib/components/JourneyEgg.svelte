<script lang="ts">
	type Props = {
		emoji: string;
		title: string;
		tagline: string;
		philosophy: string;
		color: string;
		href: string;
		locked?: boolean;
		index: number;
		align: 'left' | 'right';
		done: number;
		total: number;
	};

	let {
		emoji,
		title,
		tagline,
		philosophy,
		color,
		href,
		locked = false,
		index,
		align,
		done,
		total
	}: Props = $props();

	// Progress ring around the badge — a small halo, not the badge fill itself,
	// so the level's own color stays legible underneath the emoji.
	const R = 34;
	const CIRC = 2 * Math.PI * R;
	const pct = $derived(total > 0 ? Math.min(1, done / total) : 0);
</script>

{#snippet badge()}
	<div class="relative z-10" class:opacity-50={locked}>
		<svg width={2 * R + 10} height={2 * R + 10} class="-rotate-90" aria-hidden="true">
			<circle cx={R + 5} cy={R + 5} r={R} fill="none" stroke="rgb(0 0 0 / 0.08)" stroke-width="4" />
			<circle
				cx={R + 5}
				cy={R + 5}
				r={R}
				fill="none"
				stroke="var(--color-leaf-green)"
				stroke-width="4"
				stroke-linecap="round"
				stroke-dasharray={CIRC}
				stroke-dashoffset={CIRC * (1 - pct)}
				style="transition: stroke-dashoffset 0.6s ease;"
			/>
		</svg>
		<div
			class="absolute inset-[5px] grid place-items-center rounded-full text-3xl shadow-[0_5px_0_rgb(0_0_0/0.12)]"
			style="background: {color};"
		>
			{emoji}
		</div>
	</div>
{/snippet}

{#snippet card(rightAlignText: boolean)}
	<div
		class="card max-w-sm rounded-3xl p-5 transition-transform group-hover:-translate-y-1 group-active:translate-y-0"
		class:text-right={rightAlignText}
	>
		<div class="flex items-center gap-2" class:justify-end={rightAlignText}>
			<span class="text-xs font-bold tracking-widest text-(--color-night-soft) uppercase">
				Level {index}
			</span>
			{#if locked}
				<span class="rounded-full bg-(--color-mist) px-2 py-0.5 text-[10px] font-bold tracking-wide text-(--color-night-soft) uppercase">
					Soon
				</span>
			{/if}
		</div>
		<h3 class="mt-0.5 text-xl leading-tight">{title}</h3>
		<p class="mt-0.5 text-xs font-bold tracking-wide text-(--color-night-soft) uppercase">{tagline}</p>
		<p class="mt-2 text-sm leading-relaxed text-(--color-night-soft)">{philosophy}</p>
	</div>
{/snippet}

<a {href} class="group block no-underline focus:outline-none" aria-disabled={locked}>
	<div class="grid grid-cols-[auto_1fr] items-start gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-8">
		<!-- Left slot: only occupied when this card sits left of the spine -->
		<div class="hidden min-w-0 md:block" class:md:col-start-1={align === 'left'}>
			{#if align === 'left'}
				<div class="ml-auto">{@render card(true)}</div>
			{/if}
		</div>

		<!-- Badge: mobile col 1, desktop always the middle (spine) column -->
		<div class="md:col-start-2 md:row-start-1">
			{@render badge()}
		</div>

		<!-- Right slot: mobile always holds the card; desktop only when align is 'right' -->
		<div class="min-w-0 md:col-start-3" class:md:hidden={align === 'left'}>
			{@render card(false)}
		</div>
	</div>
</a>
