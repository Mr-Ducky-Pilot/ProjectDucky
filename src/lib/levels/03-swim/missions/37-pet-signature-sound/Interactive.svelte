<script lang="ts">
	import FlashCodeButton from '$lib/components/FlashCodeButton.svelte';
	import PetAvatar from '$lib/components/PetAvatar.svelte';
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { pet, updatePersonality, unlockDimension } from '$lib/stores/pet';
	import { connection } from '$lib/stores/connection';
	import type { Mission } from '$lib/missions/types';

	type Props = { complete: () => void; mission: Mission };
	let { complete }: Props = $props();

	const NOTES = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'];

	function parseSignature(s: string): string[] {
		const parts = s.split(';').map((p) => p.split(',')[0]).filter(Boolean);
		while (parts.length < 4) parts.push('C4');
		return parts.slice(0, 4);
	}

	let notes = $state(parseSignature($pet.personality.greeting.tone));

	function set(i: number, n: string) {
		notes[i] = n;
		notes = notes;
		const tone = notes.map((nn) => `${nn},250`).join(';');
		updatePersonality({ greeting: { ...$pet.personality.greeting, tone } });
	}

	function preview() {
		const seq = notes.map((n) => ({ note: n, ms: 250 }));
		void connection.send({ type: 'tone', sequence: seq }).catch(() => {});
		// also play in browser via Web Audio for the not-connected case
		try {
			const ctx = new AudioContext();
			let t = ctx.currentTime;
			for (const n of notes) {
				const osc = ctx.createOscillator();
				const gain = ctx.createGain();
				osc.type = 'triangle';
				osc.frequency.value = 261.63 * Math.pow(2, NOTES.indexOf(n) / 12);
				osc.connect(gain).connect(ctx.destination);
				gain.gain.setValueAtTime(0.2, t);
				gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
				osc.start(t);
				osc.stop(t + 0.25);
				t += 0.25;
			}
			setTimeout(() => ctx.close(), 1500);
		} catch {
			/* no audio context */
		}
	}

	const pyTune = $derived('["' + notes.map((n) => `${n}:4`).join('","') + '"]');

	const code = $derived(`from microbit import *
import music

TUNE = ${pyTune}

music.play(TUNE)

while True:
    if button_a.was_pressed():
        music.play(TUNE)
    sleep(50)`);

	function onFlashed() {
		unlockDimension('music');
		complete();
	}
</script>

<div class="flex flex-col gap-5">
	<div class="flex items-center gap-4 rounded-2xl bg-egg-cream p-4 shadow-soft">
		<PetAvatar size={80} mood="excited" />
		<div>
			<p class="font-display text-xl font-extrabold text-night-ink">
				{$pet.name || 'Your duck'}'s signature
			</p>
			<p class="text-sm text-night-soft">{notes.join(' · ')}</p>
		</div>
	</div>

	<div class="grid grid-cols-4 gap-3">
		{#each notes as note, i}
			<label class="flex flex-col">
				<span class="text-xs font-bold uppercase tracking-widest text-night-soft">Note {i + 1}</span>
				<select
					class="mt-1 rounded-md border border-mist bg-white px-3 py-2 font-mono"
					value={note}
					onchange={(e) => set(i, (e.currentTarget as HTMLSelectElement).value)}
				>
					{#each NOTES as n}
						<option value={n}>{n}</option>
					{/each}
				</select>
			</label>
		{/each}
	</div>

	<button class="self-start rounded-full bg-night-ink px-4 py-2 font-display font-bold text-white" onclick={preview}>
		▶ Preview
	</button>

	<FlashCodeButton {code} onFlashed={onFlashed} />

	<YourTurn
		title="After flashing"
		challenges={[
			'Listen to your signature on the duck. Press A to replay.',
			'Compose an ascending one. Then a descending one. Which fits your duck?',
			'Steal the Netflix "ta-dum" — find the two notes.'
		]}
	/>
</div>
