<script lang="ts">
	import FreePythonEditor from '$lib/components/FreePythonEditor.svelte';
	import MicrobitPreview from '$lib/components/MicrobitPreview.svelte';
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import QrShareCard from '$lib/components/QrShareCard.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	let role = $state<'dj' | 'follower'>('dj');

	const INITIAL = $derived(`from microbit import *
import radio

radio.on()
radio.config(channel=42)

DJ = ${role === 'dj' ? 'True' : 'False'}

PATTERNS = [
    Image.HEART,
    Image('99099:99099:00000:90009:09990'),
    Image('00900:09990:99999:09990:00900'),
]
beat_idx = 0

if DJ:
    display.show(Image.MUSIC_QUAVER)
else:
    display.show(Image.HAPPY)

while True:
    if DJ and button_a.was_pressed():
        beat_idx = (beat_idx + 1) % 3
        radio.send('BEAT|' + str(beat_idx))
        display.show(PATTERNS[beat_idx])
        sleep(120)
        display.show(Image.MUSIC_QUAVER)

    if not DJ:
        msg = radio.receive()
        if msg and msg.startswith('BEAT|'):
            try:
                idx = int(msg[5:])
                display.show(PATTERNS[idx])
                sleep(120)
                display.show(Image.HAPPY)
            except:
                pass
    sleep(50)`);

	let code = $state(INITIAL);
	$effect(() => {
		code = INITIAL;
	});
</script>

<div class="flex flex-col gap-5">
	<div class="flex gap-2">
		<button
			class="rounded-full px-4 py-2 font-display font-bold"
			class:bg-night-ink={role === 'dj'}
			class:text-white={role === 'dj'}
			class:bg-mist={role !== 'dj'}
			onclick={() => (role = 'dj')}
		>
			🎧 DJ duck
		</button>
		<button
			class="rounded-full px-4 py-2 font-display font-bold"
			class:bg-night-ink={role === 'follower'}
			class:text-white={role === 'follower'}
			class:bg-mist={role !== 'follower'}
			onclick={() => (role = 'follower')}
		>
			🪩 Follower duck
		</button>
	</div>

	<div class="grid gap-4 md:grid-cols-[1fr_auto]">
		<FreePythonEditor initial={INITIAL} bind:code />
		<div class="md:w-64"><MicrobitPreview {code} /></div>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<QrShareCard variant="remix" remix={{ missionId: '54-radio-disco', code }} title="Share the disco" />

	<YourTurn
		title="Throw the party"
		challenges={[
			'Flash a DJ. Flash a follower. Press A on the DJ.',
			'5 ducks in a room — synchronised light show.',
			'Add a unique pattern per packet number.'
		]}
	/>
</div>
