<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import { connection } from '$lib/stores/connection';
	import type { DuckyMood } from '$lib/components/Ducky.svelte';
	import { onMount } from 'svelte';

	let mood = $state<DuckyMood>('idle');
	let touches = $state(0);

	function quack() {
		touches++;
		mood = 'celebrating';
		setTimeout(() => (mood = 'idle'), 600);
	}

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type === 'touch' && e.phase === 'down') quack();
		});
		return off;
	});
</script>

<div class="flex flex-col items-center gap-4">
	<Ducky {mood} size={180} />
	<button type="button" onclick={quack} class="pop-btn pop-btn--yellow">
		Pretend I touched the logo
	</button>
	<p class="text-sm text-(--color-night-soft)">Quacks so far: <strong>{touches}</strong></p>
</div>
