<script lang="ts">
	import Ducky from '$lib/components/Ducky.svelte';
	import SpeechBubble from '$lib/components/SpeechBubble.svelte';
	import JourneyEgg from '$lib/components/JourneyEgg.svelte';
	import { LEVELS } from '$lib/data/journey';

	let audience = $state<'kids' | 'parents'>('kids');

	const boxItems = [
		{ emoji: '🎛️', label: '2 × micro:bit v2', sub: 'Speakers, mic, sensors, radio.' },
		{ emoji: '🖥️', label: '2 × OLED screens', sub: 'Tiny but punchy. 96 × 96 pixels.' },
		{ emoji: '🔌', label: '2 × USB cables', sub: 'Plug-and-play, no app to install.' },
		{ emoji: '🔋', label: '2 × battery packs', sub: 'Take Ducky off the desk.' },
		{ emoji: '🃏', label: 'Mission cards', sub: 'A few prompts. Mostly empty space.' },
		{ emoji: '✨', label: 'Sticker sheet', sub: 'Make it yours.' }
	];

	const claims = [
		{
			emoji: '🚫',
			title: 'No grades. No gates.',
			body: 'Every level is unlocked from minute one. Wander around. There’s no boss.'
		},
		{
			emoji: '🛠️',
			title: 'Real hardware.',
			body: 'You hold the chip. Your code runs on it. The OLED really lights up.'
		},
		{
			emoji: '🤝',
			title: 'Built for two.',
			body: 'Half the missions need a friend. Two ducks talking, wirelessly.'
		}
	];

	const audienceCopy = {
		kids: {
			title: 'Make weird stuff with a tiny computer.',
			body: 'Ducky helps you turn a chip into a music box, a mood ring, a walkie-talkie, or whatever you can dream up. No experience needed.'
		},
		parents: {
			title: 'A genuine on-ramp into computing.',
			body: 'Hardware kids touch, software they grow into. Built on micro:bit + MakeCode — the same stack used in classrooms worldwide. No accounts, no data collected.'
		}
	};
</script>

<!-- ============== HERO ============== -->
<section
	class="relative overflow-hidden px-5 pt-10 pb-14 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32"
>
	<!-- soft pond shape behind ducky -->
	<div
		class="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[640px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
		style="background: radial-gradient(circle, var(--color-duck-yellow) 0%, transparent 60%);"
		aria-hidden="true"
	></div>

	<div class="mx-auto flex max-w-6xl flex-col items-center text-center lg:flex-row lg:gap-10 lg:text-left">
		<!-- mascot -->
		<div class="relative order-1 lg:order-2 lg:flex-1">
			<div class="relative mx-auto inline-block">
				<Ducky mood="excited" size={260} />
				<div class="absolute -top-2 right-0 sm:right-[-30px] lg:right-[-50px]">
					<SpeechBubble text="Hi! I'm Ducky." typing={false} tone="cheer" side="left" />
				</div>
			</div>
		</div>

		<!-- copy -->
		<div class="order-2 mt-6 max-w-xl lg:order-1 lg:mt-0 lg:flex-1">
			<span
				class="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold tracking-wide text-(--color-pond-deep) uppercase shadow-[var(--shadow-soft)]"
			>
				<span class="size-2 animate-pulse rounded-full bg-(--color-leaf-green)"></span>
				Open-source • For ages 10–18
			</span>
			<h1 class="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-[64px]">
				Two devices. <br />
				One friendship. <br />
				<span class="text-(--color-duck-yellow-deep)">Infinite ideas.</span>
			</h1>
			<p class="mt-5 text-lg text-(--color-night-soft) sm:text-xl">
				Ducky is a free, screen-light, hardware-real STEM kit. Two micro:bits, a
				friend, and an afternoon — that’s the whole recipe.
			</p>

			<div class="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
				<a href="/journey" class="pop-btn pop-btn--yellow w-full sm:w-auto">
					Start the journey →
				</a>
				<a href="/connect" class="pop-btn pop-btn--ghost w-full sm:w-auto">
					Connect a micro:bit
				</a>
			</div>

			<p class="mt-4 text-sm text-(--color-night-soft)">
				Works in Chrome &amp; Edge. No install. No login. No tracking.
			</p>
		</div>
	</div>
</section>

<!-- ============== WHAT'S IN THE BOX ============== -->
<section class="px-5 py-14 sm:py-20">
	<div class="mx-auto max-w-6xl">
		<div class="mb-6 max-w-2xl text-center sm:mx-auto sm:mb-10">
			<h2 class="text-3xl sm:text-4xl">What’s in the box</h2>
			<p class="mt-3 text-(--color-night-soft) sm:text-lg">
				Everything for two players. Nothing you’ll have to figure out alone.
			</p>
		</div>

		<div class="snap-row lg:!grid-cols-3 xl:!grid-cols-3">
			{#each boxItems as item}
				<div class="card flex items-center gap-4 p-5">
					<div
						class="grid size-14 shrink-0 place-items-center rounded-2xl bg-(--color-egg-cream-2) text-2xl"
					>
						{item.emoji}
					</div>
					<div class="min-w-0">
						<div class="font-display text-base font-extrabold">{item.label}</div>
						<div class="text-sm text-(--color-night-soft)">{item.sub}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ============== JOURNEY MAP ============== -->
<section class="px-5 py-14 sm:py-20">
	<div class="mx-auto max-w-3xl">
		<div class="mb-6 text-center sm:mb-10">
			<h2 class="text-3xl sm:text-4xl">Six little eggs</h2>
			<p class="mt-3 text-(--color-night-soft) sm:text-lg">
				A duck’s lifecycle, but for skills. Pick any egg — they’re all unlocked.
			</p>
		</div>
		<div class="flex flex-col items-stretch gap-4 sm:items-center">
			{#each LEVELS as level, i}
				<JourneyEgg
					emoji={level.emoji}
					title={level.title}
					blurb={level.tagline}
					color={level.color}
					href={level.available ? `/level/${level.id}` : '/journey'}
					locked={!level.available}
					index={i}
				/>
			{/each}
		</div>
	</div>
</section>

<!-- ============== WHY DIFFERENT ============== -->
<section class="px-5 py-14 sm:py-20">
	<div class="mx-auto max-w-6xl">
		<h2 class="text-center text-3xl sm:text-4xl">Why it’s different</h2>
		<div class="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-6">
			{#each claims as claim}
				<div class="card p-6 text-center">
					<div class="mx-auto grid size-16 place-items-center rounded-full bg-(--color-egg-cream-2) text-3xl">
						{claim.emoji}
					</div>
					<h3 class="mt-4 text-xl">{claim.title}</h3>
					<p class="mt-2 text-(--color-night-soft)">{claim.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ============== AUDIENCE TOGGLE ============== -->
<section class="px-5 py-14 sm:py-20">
	<div class="mx-auto max-w-3xl">
		<div class="card overflow-hidden p-6 sm:p-10">
			<div class="mb-6 inline-flex rounded-full bg-(--color-mist) p-1">
				<button
					type="button"
					onclick={() => (audience = 'kids')}
					class="rounded-full px-4 py-2 text-sm font-extrabold transition"
					class:bg-white={audience === 'kids'}
					class:shadow-[var(--shadow-soft)]={audience === 'kids'}
				>
					For kids
				</button>
				<button
					type="button"
					onclick={() => (audience = 'parents')}
					class="rounded-full px-4 py-2 text-sm font-extrabold transition"
					class:bg-white={audience === 'parents'}
					class:shadow-[var(--shadow-soft)]={audience === 'parents'}
				>
					For grown-ups
				</button>
			</div>
			<h2 class="text-2xl sm:text-3xl">{audienceCopy[audience].title}</h2>
			<p class="mt-3 text-(--color-night-soft) sm:text-lg">{audienceCopy[audience].body}</p>
		</div>
	</div>
</section>

<!-- ============== GET STARTED CTA ============== -->
<section class="px-5 py-16 sm:py-24">
	<div
		class="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[2.5rem] bg-(--color-night-ink) px-6 py-12 text-center text-white sm:px-12"
	>
		<Ducky mood="celebrating" size={120} />
		<h2 class="text-3xl text-white sm:text-4xl">Ready to meet your duck?</h2>
		<p class="max-w-xl text-(--color-mist)">
			Plug a micro:bit into your laptop, hit Connect, and Ducky will say hi.
			It takes about a minute.
		</p>
		<a href="/connect" class="pop-btn pop-btn--yellow">Connect a micro:bit →</a>
		<div class="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-(--color-mist)/80">
			<span class="rounded-full bg-white/10 px-3 py-1">✅ Chrome</span>
			<span class="rounded-full bg-white/10 px-3 py-1">✅ Edge</span>
			<span class="rounded-full bg-white/10 px-3 py-1 line-through opacity-60">Safari</span>
			<span class="rounded-full bg-white/10 px-3 py-1 line-through opacity-60">Firefox</span>
		</div>
	</div>
</section>

<footer class="px-5 pt-6 pb-12 text-center text-sm text-(--color-night-soft)">
	<p>
		Open source •
		<a class="underline" href="https://github.com/anthropics/claude-code/issues">
			GitHub
		</a>
		• Made with 💛 for curious humans.
	</p>
</footer>
