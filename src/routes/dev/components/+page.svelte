<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import LedMatrix from '$lib/components/LedMatrix.svelte';
	import DrawingPad from '$lib/components/DrawingPad.svelte';
	import SensorMeter from '$lib/components/SensorMeter.svelte';
	import VolumeMeter from '$lib/components/VolumeMeter.svelte';
	import Thermometer from '$lib/components/Thermometer.svelte';
	import CompassDial from '$lib/components/CompassDial.svelte';
	import PianoKeys from '$lib/components/PianoKeys.svelte';
	import MissionCard from '$lib/components/MissionCard.svelte';
	import ConceptCard from '$lib/components/ConceptCard.svelte';
	import FlashButton from '$lib/components/FlashButton.svelte';
	import ConnectionBar from '$lib/components/ConnectionBar.svelte';
	import { ALL_MISSIONS } from '$lib/missions/registry';
	import type { DuckyMood } from '$lib/components/Ducky.svelte';

	const moods: DuckyMood[] = [
		'idle', 'excited', 'thinking', 'celebrating', 'curious', 'sleepy', 'sad'
	];

	let bits = $state(Array(25).fill(false));
	let value = $state(45);

	$effect(() => {
		const id = setInterval(() => (value = 30 + Math.random() * 50), 600);
		return () => clearInterval(id);
	});

	const HEART = '0110011111111110111000100'.split('').map((c) => c === '1');
</script>

<section class="px-5 py-8">
	<div class="mx-auto max-w-6xl space-y-12">
		<header>
			<h1 class="text-3xl">Component gallery</h1>
			<p class="text-(--color-night-soft)">Quick sanity check that every shared piece looks right.</p>
		</header>

		<section>
			<h2 class="font-display text-xl">Ducky moods</h2>
			<div class="mt-3 flex flex-wrap gap-3">
				{#each moods as m}
					<div class="card flex flex-col items-center rounded-2xl p-3">
						<Ducky mood={m} size={90} bob={false} />
						<span class="text-xs text-(--color-night-soft)">{m}</span>
					</div>
				{/each}
			</div>
		</section>

		<section>
			<h2 class="font-display text-xl">Speech bubbles</h2>
			<div class="mt-3 flex flex-wrap items-end gap-4">
				<SpeechBubble text="Neutral" typing={false} />
				<SpeechBubble text="Cheer!" typing={false} tone="cheer" />
				<SpeechBubble text="Hint?" typing={false} tone="hint" />
				<SpeechBubble text="Typing this out…" charsPerSecond={20} />
			</div>
		</section>

		<section>
			<h2 class="font-display text-xl">Hardware widgets</h2>
			<div class="mt-3 grid items-start gap-4 md:grid-cols-3">
				<div class="card rounded-2xl p-4 text-center">
					<LedMatrix bits={HEART} size={150} color="#ff7a6b" />
				</div>
				<div class="card rounded-2xl p-4">
					<DrawingPad {bits} onchange={(b) => (bits = b)} size={180} />
				</div>
				<Thermometer c={24.3} />
				<SensorMeter {value} min={0} max={100} label="Demo" unit="%" />
				<VolumeMeter level={value * 2.4} />
				<CompassDial heading={value * 3.6} size={180} />
				<PianoKeys onpress={() => {}} recording={[{ name: 'C4' }, { name: 'E4' }]} />
			</div>
		</section>

		<section>
			<h2 class="font-display text-xl">Mission card + concept</h2>
			<div class="mt-3 grid items-start gap-4 md:grid-cols-3">
				{#each ALL_MISSIONS.slice(0, 3) as mission}
					<MissionCard {mission} />
				{/each}
			</div>
			<div class="mt-4 max-w-md">
				<ConceptCard markdown={ALL_MISSIONS[0]?.conceptMarkdown ?? '## empty'} />
			</div>
		</section>

		<section>
			<h2 class="font-display text-xl">Buttons + connection</h2>
			<div class="mt-3 flex flex-wrap items-center gap-3">
				<button type="button" class="pop-btn">Default</button>
				<button type="button" class="pop-btn pop-btn--yellow">Yellow</button>
				<button type="button" class="pop-btn pop-btn--blue">Blue</button>
				<button type="button" class="pop-btn pop-btn--coral">Coral</button>
				<button type="button" class="pop-btn pop-btn--ghost">Ghost</button>
				<FlashButton hexUrl="" />
				<ConnectionBar />
			</div>
		</section>

		<section>
			<h2 class="font-display text-xl">All missions</h2>
			<ul class="mt-3 space-y-1 font-mono text-sm">
				{#each ALL_MISSIONS as m}
					<li>
						<a class="text-(--color-pond-deep) underline" href="/mission/{m.level}/{m.id}">
							L{m.level} · {m.id}
						</a>
						— {m.title}
					</li>
				{/each}
			</ul>
		</section>
	</div>
</section>
