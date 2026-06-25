<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { connection } from '$lib/stores/connection';
	import { petLabel } from '$lib/stores/pet';

	let { children } = $props();

	const conn = connection;
	const isLanding = $derived(page.url.pathname === '/');
	const isConnect = $derived(page.url.pathname.startsWith('/connect'));

	const dotColor = $derived(
		$conn.status === 'connected'
			? 'bg-(--color-leaf-green)'
			: $conn.status === 'flashing' || $conn.status === 'requesting'
				? 'bg-(--color-duck-yellow-deep)'
				: $conn.status === 'error'
					? 'bg-(--color-sunset-coral)'
					: 'bg-(--color-mist)'
	);

	const statusLabel = $derived.by(() => {
		switch ($conn.status) {
			case 'connected':
				return $conn.kind === 'real' ? `Real ${$petLabel}` : `Pretend ${$petLabel}`;
			case 'flashing':
				return `Flashing ${Math.round(($conn.flash?.pct ?? 0) * 100)}%`;
			case 'requesting':
				return 'Connecting…';
			case 'error':
				return 'Hiccup';
			default:
				return 'Not connected';
		}
	});
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
			{#if !isConnect}
				<a
					href="/connect"
					class="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-[var(--shadow-soft)] hover:bg-(--color-egg-cream-2)"
					title={statusLabel}
				>
					<span class="size-2.5 rounded-full {dotColor}"></span>
					<span class="hidden sm:inline">{statusLabel}</span>
					<span class="sm:hidden">{$petLabel}</span>
				</a>
			{:else}
				<span
					class="flex items-center gap-2 rounded-full bg-(--color-pond-blue) px-4 py-2 text-white"
				>
					Connect
				</span>
			{/if}
		</nav>
	</header>
{/if}

<main class="min-h-[100dvh]">
	{@render children()}
</main>
