<script lang="ts">
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const INITIAL = `from microbit import *
import music

NOTES = [262, 294, 330, 392, 440, 523, 587, 659]   # C major scale

while True:
    light = display.read_light_level()
    note_idx = min(len(NOTES) - 1, light // 32)

    ax = accelerometer.get_x()
    tempo = 80 + abs(ax) // 5     # 80..240ms

    try:
        vol = microphone.sound_level()
    except:
        vol = 100

    if vol > 20:
        music.pitch(NOTES[note_idx], tempo)
    sleep(40)`;

	let code = $state(INITIAL);
</script>

<div class="flex flex-col gap-5">
	<FreePythonEditor initial={INITIAL} bind:code />

	<FlashCodeButton {code} onFlashed={complete} />

	<QrShareCard variant="remix" remix={{ missionId: '53-sensor-symphony', code }} title="Share your symphony" />

	<YourTurn
		title="Conduct"
		challenges={[
			'Cup your hand over the chip — pitch drops.',
			'Tilt it slowly — rhythm changes.',
			'Use minor scale notes instead.'
		]}
	/>
</div>
