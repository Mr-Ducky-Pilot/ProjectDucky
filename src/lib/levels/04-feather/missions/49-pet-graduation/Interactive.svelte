<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import PetStatSheet from '$lib/components/PetStatSheet.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, isNamed, markLevelCompleted } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const safe = (s: string) => s.replace(/"/g, '');

	const code = $derived.by(() => {
		const p = $pet;
		const greet = p.personality.greeting;
		const fav = p.personality.favoriteThing;
		const trick = p.personality.trick;
		const rules = p.personality.moodRules
			.map((r) => `    ('${r.when}', '${r.mood}'),`)
			.join('\n');

		return `# Graduation demo for ${safe(p.name) || 'Ducky'}
from microbit import *
import music

FACES = {
    'happy': Image.HAPPY, 'sad': Image.SAD, 'wink': Image.SURPRISED,
    'sleep': Image.ASLEEP, 'silly': Image.SILLY, 'wave': Image('00900:09990:99999:09990:00900'),
}
NAME = "${safe(p.name) || 'Ducky'}"

# --- Boot greeting ---
display.show(FACES.get("${safe(greet.face)}", Image.HAPPY))
sleep(500)
music.play([${greet.tone
			.split(';')
			.map((s) => `"${safe(s.split(',')[0])}:4"`)
			.join(', ')}])
display.scroll("Hi I am " + NAME)

# --- Mood engine ---
RULES = [
${rules || "    ('bright', 'happy'),"}
]

def sense():
    try: m = microphone.sound_level()
    except: m = 0
    l = display.read_light_level()
    t = temperature()
    if accelerometer.get_strength() > 1800: return 'shake'
    if m > 180: return 'loud'
    if m < 30:  return 'quiet'
    if l > 150: return 'bright'
    if l < 30:  return 'dark'
    if t < 18:  return 'cold'
    if t > 28:  return 'warm'
    return None

def do_trick():
    for f in (Image.ARROW_E, Image.ARROW_S, Image.ARROW_W, Image.ARROW_N):
        display.show(f); sleep(100)

# --- 60s demo loop ---
last_move = running_time()
start = running_time()

while running_time() - start < 60_000:
    trigger = sense()
    # Mood
    if trigger:
        for t, mood in RULES:
            if t == trigger:
                display.show(FACES.get(mood, Image.HAPPY))
                break
    # Favourite reaction
    if trigger == "${fav ?? ''}":
        music.play(['G5:2','E5:2'])

    # Trick
    if trigger == "${trick.gesture ?? ''}":
        do_trick()

    if abs(accelerometer.get_strength() - 1024) > 200:
        last_move = running_time()

    if running_time() - last_move > 15_000:
        display.show(Image.ASLEEP)
    sleep(200)

display.scroll(NAME + " graduated!")
display.show(Image.HAPPY)
while True:
    sleep(1000)`;
	});

	function onFlashed() {
		markLevelCompleted(4);
		complete();
	}
</script>

<div class="flex flex-col gap-6">
	<div class="flex flex-col items-center gap-3 rounded-3xl bg-egg-cream p-6 shadow-soft">
		<PetAvatar size={160} mood="celebrating" />
		<p class="font-display text-2xl font-extrabold text-night-ink">
			{isNamed($pet) ? `${$pet.name} is graduating!` : 'Adopt your duck first'}
		</p>
		<p class="max-w-md text-center text-sm text-night-soft">
			Below is the full Python that runs your duck — every personality choice you've
			made, baked into one 60-second showcase. Flash, hand it to a friend, watch their face.
		</p>
	</div>

	<PetStatSheet />

	<FlashCodeButton {code} disabled={!isNamed($pet)} onFlashed={onFlashed} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Set Ducky on a table — watch the 60s demo unfold.',
			'Record the demo on your phone — share it.',
			'Don\'t like a behaviour? Go back to the mission that wrote it.'
		]}
	/>
</div>
