<script lang="ts">
	type Props = {
		text: string;
		typing?: boolean;
		side?: 'left' | 'right';
		tone?: 'neutral' | 'cheer' | 'hint';
		charsPerSecond?: number;
	};

	let {
		text,
		typing = true,
		side = 'right',
		tone = 'neutral',
		charsPerSecond = 60
	}: Props = $props();

	let visible = $state('');

	$effect(() => {
		// Read reactive deps so the effect re-runs when text/typing change.
		const t = text;
		const isTyping = typing;
		if (!isTyping) {
			visible = t;
			return;
		}
		visible = '';
		let i = 0;
		const interval = Math.max(8, 1000 / charsPerSecond);
		const id = setInterval(() => {
			i++;
			visible = t.slice(0, i);
			if (i >= t.length) clearInterval(id);
		}, interval);
		return () => clearInterval(id);
	});

	const toneClass = $derived(
		tone === 'cheer'
			? 'bg-(--color-duck-yellow) text-(--color-night-ink)'
			: tone === 'hint'
				? 'bg-(--color-pond-blue) text-white'
				: 'bg-white text-(--color-night-ink)'
	);
</script>

<div
	class="relative inline-block max-w-xs rounded-3xl px-4 py-3 text-sm font-bold leading-snug shadow-[var(--shadow-soft)] sm:max-w-sm sm:text-base {toneClass}"
>
	<span>{visible}</span>
	{#if typing && visible.length < text.length}
		<span class="ml-1 inline-block h-3 w-2 animate-pulse rounded-sm bg-current opacity-70"></span>
	{/if}
	<span
		class="absolute bottom-0 h-4 w-4 rotate-45 {toneClass}"
		style="
			{side === 'left' ? 'left: 18px;' : 'right: 18px;'}
			transform: translateY(40%) rotate(45deg);
		"
		aria-hidden="true"
	></span>
</div>
