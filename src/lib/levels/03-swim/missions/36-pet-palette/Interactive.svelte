<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import PetEditor from '$lib/components/PetEditor.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, unlockDimension } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const PATTERN_GLYPH: Record<string, string> = {
		plain: '00000:00000:00900:00000:00000',
		spots: '90909:00000:09090:00000:90909',
		stripes: '99999:00000:99999:00000:99999',
		star: '00900:09990:99999:09990:00900',
		heart: '09090:99999:99999:09990:00900'
	};

	const glyph = $derived(PATTERN_GLYPH[$pet.pattern] ?? PATTERN_GLYPH.plain);

	const code = $derived(`from microbit import *

PATTERN = "${glyph}"

display.show(Image(PATTERN))
sleep(1500)

while True:
    if button_a.was_pressed():
        display.show(Image(PATTERN))
    sleep(50)`);

	function onFlashed() {
		unlockDimension('art');
		complete();
	}
</script>

<div class="flex flex-col gap-5">
	<PetEditor showName={false} />

	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Your colors live in the browser; your <strong>pattern</strong> also flashes onto the LED matrix so the physical duck wears your design too.
	</div>

	<FlashCodeButton {code} onFlashed={onFlashed} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Pick a pattern, press A on the chip — see it appear.',
			'Show a friend, see if they can copy your color scheme.',
			'Match your favourite cartoon character.'
		]}
	/>
</div>
