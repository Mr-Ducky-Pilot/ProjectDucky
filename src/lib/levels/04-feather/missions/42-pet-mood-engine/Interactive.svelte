<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality, type MoodTrigger } from '$lib/stores/pet';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const TRIGGERS: MoodTrigger[] = ['bright', 'dark', 'cold', 'warm', 'loud', 'quiet', 'shake'];
	const MOODS = ['happy', 'sad', 'wink', 'sleep', 'silly'];

	let rules = $state(
		$pet.personality.moodRules.length
			? $pet.personality.moodRules.slice(0, 4)
			: ([
					{ when: 'bright', mood: 'happy' },
					{ when: 'dark', mood: 'sleep' },
					{ when: 'cold', mood: 'sad' },
					{ when: 'shake', mood: 'silly' }
				] as { when: MoodTrigger; mood: string }[])
	);

	$effect(() => {
		updatePersonality({ moodRules: rules });
	});

	function update(i: number, field: 'when' | 'mood', value: string) {
		(rules[i] as Record<string, string>)[field] = value;
		rules = rules;
	}

	const code = $derived.by(() => {
		const checks = `def check():
    l = display.read_light_level()
    t = temperature()
    g = accelerometer.get_strength()
    try: m = microphone.sound_level()
    except: m = 0
    if g > 1800: return 'shake'
    if m > 180: return 'loud'
    if m < 30: return 'quiet'
    if l > 150: return 'bright'
    if l < 30: return 'dark'
    if t < 18: return 'cold'
    if t > 28: return 'warm'
    return None`;
		const ruleLines = rules
			.map((r) => `    ('${r.when}', '${r.mood}'),`)
			.join('\n');
		return `from microbit import *

FACES = {
    'happy': Image.HAPPY, 'sad': Image.SAD, 'wink': Image.SURPRISED,
    'sleep': Image.ASLEEP, 'silly': Image.SILLY,
}

RULES = [
${ruleLines}
]

${checks}

while True:
    trigger = check()
    if trigger:
        for t, mood in RULES:
            if t == trigger:
                display.show(FACES.get(mood, Image.HAPPY))
                break
    sleep(200)`;
	});
</script>

<div class="flex flex-col gap-5">
	<div class="rounded-xl bg-(--color-pond-blue)/10 p-4 text-sm text-(--color-pond-deep)">
		Pick up to four "when X → mood Y" rules. Your duck checks all sensors every
		200ms and updates its face when any rule fires.
	</div>

	<div class="space-y-2">
		{#each rules as rule, i}
			<div class="flex items-center gap-2 rounded-2xl bg-egg-cream p-3 shadow-soft">
				<span class="text-sm font-bold text-night-soft">when</span>
				<select
					class="rounded-md border border-mist bg-white px-2 py-1"
					value={rule.when}
					onchange={(e) => update(i, 'when', (e.currentTarget as HTMLSelectElement).value)}
				>
					{#each TRIGGERS as t}<option value={t}>{t}</option>{/each}
				</select>
				<span class="text-sm font-bold text-night-soft">→ feel</span>
				<select
					class="rounded-md border border-mist bg-white px-2 py-1"
					value={rule.mood}
					onchange={(e) => update(i, 'mood', (e.currentTarget as HTMLSelectElement).value)}
				>
					{#each MOODS as m}<option value={m}>{m}</option>{/each}
				</select>
			</div>
		{/each}
	</div>

	<FlashCodeButton {code} onFlashed={complete} />

	<YourTurn
		title="Test the engine"
		challenges={[
			'Cover the chip — does it switch to your "dark" mood?',
			'Shake it — your "shake" mood fires.',
			'Add the most opinionated rules you can. Trade ducks with a friend.'
		]}
	/>
</div>
