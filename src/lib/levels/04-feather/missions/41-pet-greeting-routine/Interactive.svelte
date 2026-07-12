<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import { pet, updatePersonality } from '$lib/stores/pet';
	import { spriteFor } from '$lib/data/petSprites';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const FACES = ['happy', 'sad', 'wink', 'wave', 'sleep', 'duck'] as const;
	const FACE_BITS: Record<string, string> = {
		happy: '00000:01010:00000:10001:01110',
		sad: '00000:01010:00000:01110:10001',
		wink: '00000:01000:00010:10001:01110',
		wave: '00100:01110:11111:01110:00100',
		sleep: '00000:11011:00000:01110:00000',
		duck: '00110:01111:11110:11110:01100'
	};

	let face = $state($pet.personality.greeting.face || 'happy');
	let tone = $state($pet.personality.greeting.tone || 'C4,200;E4,200;G4,300');
	let scroll = $state($pet.personality.greeting.scroll || `Hi I am ${$pet.name}`);

	$effect(() => {
		updatePersonality({ greeting: { face, tone, scroll } });
	});

	const bits = $derived(
		(FACE_BITS[face] || FACE_BITS.happy).replace(/:/g, '').split('').map((c) => c === '1')
	);

	const speciesBits = $derived(
		spriteFor($pet.species).join('').split('').map((c) => c === '9')
	);

	const safe = (s: string) => s.replace(/"/g, '');
	const speciesImage = $derived(spriteFor($pet.species).join(':'));
	const code = $derived(`from microbit import *
import music

FACES = {
    'happy': Image("00000:09090:00000:90009:09990"),
    'sad':   Image("00000:09090:00000:09990:90009"),
    'wink':  Image("00000:09000:00090:90009:09990"),
    'wave':  Image("00900:09990:99999:09990:00900"),
    'sleep': Image("00000:99099:00000:09990:00000"),
    'duck':  Image("00990:09999:99990:99990:09900"),
}
SPECIES_ICON = Image("${speciesImage}")

display.show(SPECIES_ICON)
sleep(500)
display.show(FACES['${safe(face)}'])
sleep(500)
music.play([${tone
		.split(';')
		.map((p) => `"${safe(p.split(',')[0])}:4"`)
		.join(', ')}])
display.scroll("${safe(scroll)}")

while True:
    sleep(100)`);
</script>

<div class="flex flex-col gap-5">
	<div class="flex items-center gap-4 rounded-3xl bg-egg-cream p-5 shadow-soft">
		<PetAvatar size={120} mood="excited" />
		<div class="flex flex-col items-center gap-1">
			<LedMatrix bits={speciesBits} size={80} color="#7ad44b" />
			<span class="text-xs font-bold text-night-soft">boot icon</span>
		</div>
		<LedMatrix {bits} size={120} color="#ffd23a" />
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">First face</span>
			<select class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2 font-display" bind:value={face}>
				{#each FACES as f}<option value={f}>{f}</option>{/each}
			</select>
		</label>

		<label>
			<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Greeting scroll</span>
			<input
				class="mt-1 w-full rounded-md border border-mist bg-white px-3 py-2"
				maxlength="40"
				bind:value={scroll}
				placeholder="Hi I am ..."
			/>
		</label>
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="Try it"
		challenges={[
			'Flash, unplug, replug — watch the boot routine you wrote.',
			'Try the most over-the-top greeting you can.',
			'Hand to a friend — does the greeting tell them whose duck it is?'
		]}
	/>
</div>
