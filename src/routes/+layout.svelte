<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();

	const isLanding = $derived(page.url.pathname === '/');
</script>

<svelte:head>
	<title>Ducky — Two devices. One friendship. Infinite ideas.</title>
</svelte:head>

{#if !isLanding}
	<header
		class="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-black/5 bg-(--color-egg-cream)/85 px-4 py-3 backdrop-blur-md sm:px-6"
	>
		<a href="/" class="flex items-center gap-2 no-underline">
			<span class="text-2xl">🦆</span>
			<span class="font-display text-xl font-extrabold text-(--color-night-ink)">Ducky</span>
		</a>
		<nav class="flex items-center gap-2 text-sm font-bold">
			<a
				href="/journey"
				class="rounded-full px-3 py-2 text-(--color-night-soft) hover:bg-white"
				class:bg-white={page.url.pathname.startsWith('/journey')}
			>
				Journey
			</a>
			<a
				href="/connect"
				class="rounded-full bg-(--color-pond-blue) px-4 py-2 text-white shadow-[0_4px_0_rgb(0_0_0/0.12)] hover:brightness-105"
			>
				Connect
			</a>
		</nav>
	</header>
{/if}

<main class="min-h-[100dvh]">
	{@render children()}
</main>
