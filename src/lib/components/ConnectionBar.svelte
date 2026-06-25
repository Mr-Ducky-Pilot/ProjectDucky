<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import { petLabel } from '$lib/stores/pet';

	const conn = connection;

	async function toggle() {
		const s = $conn.status;
		if (s === 'connected' || s === 'flashing') return connection.disconnect();
		return connection.connect();
	}

	const dotColor = $derived(
		$conn.status === 'connected'
			? 'bg-(--color-leaf-green)'
			: $conn.status === 'flashing' || $conn.status === 'requesting'
				? 'bg-(--color-duck-yellow-deep)'
				: $conn.status === 'error'
					? 'bg-(--color-sunset-coral)'
					: 'bg-(--color-mist)'
	);

	const kindBadgeClass = $derived(
		$conn.kind === 'real'
			? 'bg-(--color-leaf-green)/20 text-(--color-leaf-deep)'
			: 'bg-(--color-mist) text-(--color-night-soft)'
	);
</script>

<div class="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-[var(--shadow-soft)]">
	<span class="size-3 rounded-full {dotColor}"></span>
	<div class="flex flex-col leading-tight">
		<span
			class="flex items-center gap-1 text-[10px] font-extrabold tracking-wide text-(--color-night-soft) uppercase"
		>
			{$petLabel}
			{#if $conn.status === 'connected'}
				<span class="rounded-full px-1.5 py-px text-[9px] {kindBadgeClass}">
					{$conn.kind === 'real' ? 'Real' : 'Pretend'}
				</span>
			{/if}
		</span>
		<span class="text-sm font-bold">
			{#if $conn.status === 'idle'}Not connected{/if}
			{#if $conn.status === 'requesting'}Connecting…{/if}
			{#if $conn.status === 'connected'}
				{$conn.deviceLabel ?? 'Ready'}
			{/if}
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
