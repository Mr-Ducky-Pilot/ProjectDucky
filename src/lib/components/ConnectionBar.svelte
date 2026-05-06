<script lang="ts">
	import { connection } from '$lib/stores/connection';

	const conn = connection;

	async function toggle() {
		const s = $conn.status;
		if (s === 'connected' || s === 'flashing') return connection.disconnect();
		return connection.connect();
	}
</script>

<div class="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-[var(--shadow-soft)]">
	<span
		class="size-3 rounded-full"
		class:bg-(--color-leaf-green)={$conn.status === 'connected'}
		class:bg-(--color-duck-yellow-deep)={$conn.status === 'flashing' ||
			$conn.status === 'requesting'}
		class:bg-(--color-sunset-coral)={$conn.status === 'error'}
		class:bg-(--color-mist)={$conn.status === 'idle'}
	></span>
	<div class="flex flex-col leading-tight">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Ducky
		</span>
		<span class="text-sm font-bold">
			{#if $conn.status === 'idle'}Not connected{/if}
			{#if $conn.status === 'requesting'}Connecting…{/if}
			{#if $conn.status === 'connected'}Ready{/if}
			{#if $conn.status === 'flashing'}
				Flashing {Math.round(($conn.flash?.pct ?? 0) * 100)}%
			{/if}
			{#if $conn.status === 'error'}Hiccup{/if}
		</span>
	</div>
	<button type="button" onclick={toggle} class="pop-btn pop-btn--blue ml-2 px-3 py-2 text-sm">
		{#if $conn.status === 'connected' || $conn.status === 'flashing'}
			Disconnect
		{:else}
			Connect
		{/if}
	</button>
</div>
