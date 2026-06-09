<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality, type MoodTrigger } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const OPTIONS: MoodTrigger[] = ['bright', 'dark', 'cold', 'warm', 'loud', 'quiet'];
	const REACTIONS = ['happy-bounce', 'jingle', 'fireworks', 'spin'];

	let fav = $state<MoodTrigger>($pet.personality.favoriteThing || 'bright');
	let reaction = $state(REACTIONS[0]);

	$effect(() => {
		updatePersonality({ favoriteThing: fav });
	});

	const code = $derived(`from microbit import *
import music

FAV = '${fav}'

def is_fav():
    if FAV == 'bright': return display.read_light_level() > 150
    if FAV == 'dark':   return display.read_light_level() < 30
    if FAV == 'cold':   return temperature() < 18
    if FAV == 'warm':   return temperature() > 28
    if FAV == 'loud':
        try: return microphone.sound_level() > 180
        except: return False
    if FAV == 'quiet':
        try: return microphone.sound_level() < 20
        except: return False
    return False

def celebrate():
${reaction === 'happy-bounce'
		? "    display.show(Image.HAPPY); sleep(200); display.show(Image.HEART); sleep(200)"
		: reaction === 'jingle'
			? "    music.play(['C5:4','E5:4','G5:4']); display.show(Image.YES); sleep(200)"
			: reaction === 'fireworks'
				? "    display.show(Image('99999:90009:00900:90009:99999')); sleep(150); display.clear(); sleep(80)"
				: "    for f in (Image.ARROW_E, Image.ARROW_S, Image.ARROW_W, Image.ARROW_N):\n        display.show(f); sleep(120)"}

while True:
    if is_fav():
        celebrate()
    else:
        display.show(Image.ASLEEP)
    sleep(300)`);
</script>

<div class="flex flex-col gap-5">
	<div class="grid gap-4 md:grid-cols-2">
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">My duck loves…</span>
			<select class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display" bind:value={fav}>
				{#each OPTIONS as o}<option value={o}>{o}</option>{/each}
			</select>
		</label>
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">…and reacts with</span>
			<select class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display" bind:value={reaction}>
				{#each REACTIONS as r}<option value={r}>{r}</option>{/each}
			</select>
		</label>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="See if it works"
		challenges={[
			'Trigger the favourite — does the reaction fire?',
			'Hand to a friend without telling them. Can they guess?',
			'Re-flash with a quirky favourite (e.g. "quiet").'
		]}
	/>
</div>
