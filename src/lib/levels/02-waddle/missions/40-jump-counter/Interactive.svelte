<script lang="ts">
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TEMPLATE = `from microbit import *

JUMP = ___(1800)
COOLDOWN = ___(250)
count = 0
last_jump = 0

while True:
    z = accelerometer.get_z()
    now = running_time()
    if z > JUMP and now - last_jump > COOLDOWN:
        count += 1
        last_jump = now
        display.show(str(count % 10))
    sleep(20)`;

	let code = $state('');
	let allFilled = $state(false);
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Tune <strong>JUMP</strong> (how big a spike counts as a jump) and
		<strong>COOLDOWN</strong> (how many milliseconds to wait before counting
		another jump).
	</div>

	<CodeEditor template={TEMPLATE} bind:code bind:allFilled />

	<FlashCodeButton {code} disabled={!allFilled} onFlashed={complete} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Do 10 jumps. Does the counter agree?',
			'Lower JUMP to 1200 — it gets twitchy.',
			'Strap Ducky to your shoelace with tape and run!'
		]}
	/>
</div>
