<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';

	const FACES = [
		{ name: 'happy', bits: '00000:01010:00000:10001:01110' },
		{ name: 'sad', bits: '00000:01010:00000:01110:10001' },
		{ name: 'wink', bits: '00000:01000:00010:10001:01110' },
		{ name: 'sleepy', bits: '00000:11011:00000:01110:00000' },
		{ name: 'silly', bits: '10001:01010:00100:01010:10001' }
	];

	let idx = $state(0);
	const bits = $derived(FACES[idx].bits.replace(/:/g, '').split('').map((c) => c === '1'));
</script>

<div class="flex flex-col items-center gap-4">
	<LedMatrix {bits} size={220} color="#ffd23a" />
	<p class="font-display text-2xl font-extrabold capitalize text-night-ink">{FACES[idx].name}</p>
	<div class="flex gap-2">
		<button
			class="rounded-full bg-mist px-4 py-2 font-display font-bold text-night-ink"
			onclick={() => (idx = (idx - 1 + FACES.length) % FACES.length)}
		>
			← A
		</button>
		<button
			class="rounded-full bg-mist px-4 py-2 font-display font-bold text-night-ink"
			onclick={() => (idx = (idx + 1) % FACES.length)}
		>
			B →
		</button>
	</div>
	<p class="max-w-xs text-center text-sm text-(--color-night-soft)">
		On your duck, press the real A and B buttons.
	</p>
</div>
