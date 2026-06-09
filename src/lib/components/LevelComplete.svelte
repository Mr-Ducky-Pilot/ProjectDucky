<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import Confetti from './Confetti.svelte';
	import PetAvatar from './PetAvatar.svelte';
	import { LEVELS } from '$lib/data/journey';

	type Props = {
		level: number;
		open?: boolean;
		onClose?: () => void;
		onNext?: () => void;
	};

	let { level, open = $bindable(true), onClose, onNext }: Props = $props();

	const info = $derived(LEVELS.find((l) => l.id === level));
	const next = $derived(LEVELS.find((l) => l.id === level + 1));

	function close() {
		open = false;
		onClose?.();
	}

	function next_() {
		open = false;
		onNext?.();
	}
</script>

{#if open && info}
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4"
		transition:fade={{ duration: 250 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="level-complete-title"
	>
		<Confetti />

		<div
			class="relative w-full max-w-md rounded-3xl bg-egg-cream p-8 shadow-soft text-center"
			style="background: linear-gradient(180deg, {info.color} 0%, #fff8ec 100%);"
			transition:scale={{ duration: 450, easing: backOut, start: 0.7 }}
		>
			<button
				class="absolute right-4 top-4 text-xl text-night-soft hover:text-night-ink"
				aria-label="Close"
				onclick={close}
			>×</button>

			<div class="mb-4 flex justify-center">
				<PetAvatar mood="celebrating" size={140} />
			</div>

			<p class="mb-1 text-sm font-semibold uppercase tracking-wider text-night-soft">
				Level {level} complete!
			</p>
			<h2 id="level-complete-title" class="mb-2 font-display text-3xl font-extrabold text-night-ink">
				{info.emoji} {info.title} ✓
			</h2>
			<p class="mb-6 text-night-soft">
				{info.tagline}
			</p>

			{#if next}
				<button
					class="rounded-full bg-night-ink px-6 py-3 font-display text-base font-bold text-white shadow-soft transition hover:scale-105"
					onclick={next_}
				>
					Next: {next.emoji} {next.title} →
				</button>
			{:else}
				<p class="font-display text-lg font-bold text-night-ink">You finished every level! 🦆🌟</p>
			{/if}

			<div class="mt-4">
				<button class="text-sm text-night-soft underline" onclick={close}>Stay here</button>
			</div>
		</div>
	</div>
{/if}
