<script lang="ts">
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import Ducky from '$lib/components/Ducky.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	const WAVE = '0010001110011100010000100'.split('').map((c) => c === '1');
	const EMPTY = Array(25).fill(false);

	let theirBits = $state<boolean[]>(EMPTY);
	let myBits = $state<boolean[]>(EMPTY);
	let received = $state(0);

	function showWave(target: 'mine' | 'theirs') {
		if (target === 'mine') myBits = WAVE;
		else theirBits = WAVE;
		setTimeout(() => {
			if (target === 'mine') myBits = EMPTY;
			else theirBits = EMPTY;
		}, 700);
	}

	async function pressA() {
		showWave('mine');
		await connection.send({ type: 'radio-send', payload: 1 });
	}

	onMount(() => {
		const off = connection.onEvent((e) => {
			if (e.type === 'radio') {
				received++;
				showWave('theirs');
			}
		});
		return off;
	});
</script>

<div class="grid gap-5 sm:grid-cols-2">
	<div class="card flex flex-col items-center gap-3 rounded-3xl p-5">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Your duck
		</span>
		<Ducky mood="excited" size={100} />
		<LedMatrix bits={myBits} size={140} color="#ffd23a" />
		<button type="button" onclick={pressA} class="pop-btn pop-btn--blue">
			Press A
		</button>
	</div>
	<div class="card flex flex-col items-center gap-3 rounded-3xl p-5">
		<span class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">
			Friend's duck
		</span>
		<Ducky mood={theirBits[0] ? 'celebrating' : 'curious'} size={100} />
		<LedMatrix bits={theirBits} size={140} color="#7ad44b" />
		<p class="text-xs text-(--color-night-soft)">Waves received: <strong>{received}</strong></p>
	</div>
</div>
<p class="mt-3 text-center text-sm text-(--color-night-soft)">
	(Pretend mode loops your wave back to you — when two ducks are connected
	for real, the friend’s chip lights up instead.)
</p>
