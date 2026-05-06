<script lang="ts">
	type Props = {
		emoji: string;
		title: string;
		blurb: string;
		color: string;
		href: string;
		locked?: boolean;
		index: number;
	};

	let { emoji, title, blurb, color, href, locked = false, index }: Props = $props();

	// Stagger horizontal offset like the Duolingo unit map.
	const offset = $derived(['ml-0', 'ml-12', 'ml-4', '-ml-6', 'ml-10', 'ml-2'][index % 6]);
</script>

<a
	{href}
	class="group block w-full max-w-[18rem] {offset} no-underline focus:outline-none"
	aria-disabled={locked}
>
	<div
		class="card relative flex items-center gap-4 rounded-3xl p-4 transition-transform group-hover:-translate-y-1 group-active:translate-y-0"
	>
		<div
			class="grid size-16 shrink-0 place-items-center rounded-full text-3xl shadow-[0_5px_0_rgb(0_0_0/0.12)]"
			style="background: {color};"
		>
			{emoji}
		</div>
		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<span class="text-xs font-bold tracking-widest text-(--color-night-soft) uppercase">
					Lvl {index}
				</span>
				{#if locked}
					<span
						class="rounded-full bg-(--color-mist) px-2 py-0.5 text-[10px] font-bold tracking-wide text-(--color-night-soft) uppercase"
					>
						Soon
					</span>
				{/if}
			</div>
			<h3 class="text-lg leading-tight">{title}</h3>
			<p class="mt-1 line-clamp-2 text-sm text-(--color-night-soft)">{blurb}</p>
		</div>
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<path
				d="M9 6l6 6-6 6"
				stroke="currentColor"
				stroke-width="3"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="text-(--color-night-soft) opacity-60 group-hover:opacity-100"
			/>
		</svg>
	</div>
</a>
