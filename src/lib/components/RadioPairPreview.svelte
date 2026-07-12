<script lang="ts">
	import { onDestroy } from 'svelte';
	import LedMatrix from './LedMatrix.svelte';
	import { parse } from '$lib/simulator/parser';
	import { ParseError } from '$lib/simulator/ast';
	import { runProgram, type Signal } from '$lib/simulator/interpreter';
	import { createDeviceApi, createDefaultInputs, type LogEntry, type RadioIO, type SimInputs } from '$lib/simulator/device-api';

	type Props = { code: string; labelA?: string; labelB?: string };
	let { code, labelA = 'Board A', labelB = 'Board B' }: Props = $props();

	// Drives one simulated board. Two instances share the same parsed
	// source (these missions say "flash the same code to both boards") but
	// run fully independent interpreters, wired together only through the
	// radioIO queues below — so pressing a button on one board's simulated
	// controls can trigger a visible reaction on the other's screen.
	class BoardRunner {
		inputs = $state<SimInputs>(createDefaultInputs());
		bits = $state<boolean[]>(new Array(25).fill(false));
		neopixels = $state<[number, number, number][] | null>(null);
		log = $state<LogEntry[]>([]);
		parseErrorMsg = $state<string | null>(null);
		stalled = $state(false);
		playing = $state(true);

		gen: Generator<Signal, void, void> | null = null;
		api: ReturnType<typeof createDeviceApi> | null = null;
		resumeTimer: ReturnType<typeof setTimeout> | null = null;
		tickStreak = 0;
		destroyed = false;
		radioIO: RadioIO;

		constructor(radioIO: RadioIO) {
			this.radioIO = radioIO;
		}

		clampMs(ms: number): number {
			return Math.min(600, Math.max(16, ms * 0.5));
		}

		stopTimer() {
			if (this.resumeTimer) {
				clearTimeout(this.resumeTimer);
				this.resumeTimer = null;
			}
		}

		restart(source: string) {
			this.stopTimer();
			this.parseErrorMsg = null;
			this.stalled = false;
			this.tickStreak = 0;
			try {
				const ast = parse(source);
				const api = createDeviceApi(this.inputs, this.radioIO);
				this.api = api;
				this.gen = runProgram(ast, api.globals, (e) => {
					api.pushLog('error', `line ${e.line ?? '?'} — preview isn't sure what to do here (${e.message})`);
				});
				this.bits = api.state.bits;
				this.neopixels = api.state.neopixels;
				this.log = api.state.log;
				if (this.playing) this.step();
			} catch (e) {
				this.gen = null;
				this.parseErrorMsg = e instanceof ParseError ? `Line ${e.line}: ${e.message}` : (e as Error).message;
			}
		}

		step = () => {
			if (!this.gen || !this.playing || this.destroyed || !this.api) return;
			const api = this.api;
			let result: IteratorResult<Signal, void>;
			try {
				result = this.gen.next();
			} catch (e) {
				this.parseErrorMsg = `Preview stopped: ${(e as Error).message}`;
				return;
			}
			this.bits = api.state.bits;
			this.neopixels = api.state.neopixels;
			this.log = api.state.log;
			if (result.done) return;
			const sig = result.value;
			if (sig.type === 'sleep') {
				this.tickStreak = 0;
				this.resumeTimer = setTimeout(this.step, this.clampMs(sig.ms));
			} else {
				this.tickStreak++;
				if (this.tickStreak > 5) {
					this.stalled = true;
					api.pushLog('error', "This loop doesn't pause — preview stopped it to stay responsive.");
					return;
				}
				this.resumeTimer = setTimeout(this.step, 0);
			}
		};

		destroy() {
			this.destroyed = true;
			this.stopTimer();
		}

		tapButtonA() {
			this.inputs.buttonAPressed = true;
			this.inputs.buttonAHeld = true;
			setTimeout(() => (this.inputs.buttonAHeld = false), 150);
		}
		tapButtonB() {
			this.inputs.buttonBPressed = true;
			this.inputs.buttonBHeld = true;
			setTimeout(() => (this.inputs.buttonBHeld = false), 150);
		}
		tapLogo() {
			this.inputs.logoTouched = true;
			setTimeout(() => (this.inputs.logoTouched = false), 200);
		}
	}

	// Cross-wired queues: A's outbox feeds B's inbox and vice versa.
	let queueAtoB: unknown[] = [];
	let queueBtoA: unknown[] = [];

	const boardA = new BoardRunner({
		send: (p) => queueAtoB.push(p),
		receive: () => (queueBtoA.length ? queueBtoA.shift() : null)
	});
	const boardB = new BoardRunner({
		send: (p) => queueBtoA.push(p),
		receive: () => (queueAtoB.length ? queueAtoB.shift() : null)
	});

	let playing = $state(true);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	function restartBoth() {
		queueAtoB = [];
		queueBtoA = [];
		boardA.playing = playing;
		boardB.playing = playing;
		boardA.restart(code);
		boardB.restart(code);
	}

	function togglePlay() {
		playing = !playing;
		boardA.playing = playing;
		boardB.playing = playing;
		if (playing) {
			if (!boardA.stalled) boardA.step();
			if (!boardB.stalled) boardB.step();
		} else {
			boardA.stopTimer();
			boardB.stopTimer();
		}
	}

	$effect(() => {
		void code;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(restartBoth, 500);
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});

	onDestroy(() => {
		if (debounceTimer) clearTimeout(debounceTimer);
		boardA.destroy();
		boardB.destroy();
	});

	let showButtonA = $derived(code.includes('button_a'));
	let showButtonB = $derived(code.includes('button_b'));
	let showLogo = $derived(code.includes('pin_logo'));
	let showAccel = $derived(code.includes('accelerometer'));
	let anyInputs = $derived(showButtonA || showButtonB || showLogo || showAccel);

	const logColor: Record<LogEntry['kind'], string> = {
		print: 'text-(--color-leaf-green)',
		scroll: 'text-(--color-duck-yellow)',
		radio: 'text-(--color-pond-blue)',
		music: 'text-(--color-duck-yellow)',
		error: 'text-(--color-sunset-coral)'
	};
</script>

{#snippet board(b: BoardRunner, label: string)}
	<div class="flex flex-1 flex-col gap-3 rounded-2xl bg-(--color-night-ink) p-4 shadow-lg">
		<span class="text-center font-mono text-xs uppercase tracking-wider text-white/40">{label}</span>

		<div class="flex justify-center" class:opacity-40={!!b.parseErrorMsg}>
			<LedMatrix bits={b.bits} size={130} />
		</div>

		{#if b.neopixels && b.neopixels.length > 0}
			<div class="flex items-center justify-center gap-1.5">
				{#each b.neopixels as [r, g, bl]}
					<span class="size-3 rounded-full border border-white/20" style="background: rgb({r}, {g}, {bl});"></span>
				{/each}
			</div>
		{/if}

		{#if b.parseErrorMsg}
			<p class="rounded-lg bg-(--color-sunset-coral)/15 px-2 py-1.5 text-[11px] text-(--color-sunset-coral)">
				🔍 {b.parseErrorMsg}
			</p>
		{:else if b.stalled}
			<p class="rounded-lg bg-(--color-sunset-coral)/15 px-2 py-1.5 text-[11px] text-(--color-sunset-coral)">
				⏸ Loop stopped — didn't pause.
			</p>
		{/if}

		{#if anyInputs}
			<div class="flex flex-wrap justify-center gap-1.5">
				{#if showButtonA}
					<button
						type="button"
						onclick={() => b.tapButtonA()}
						class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/70 transition hover:bg-white/20 active:bg-white/30"
					>
						Press A
					</button>
				{/if}
				{#if showButtonB}
					<button
						type="button"
						onclick={() => b.tapButtonB()}
						class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/70 transition hover:bg-white/20 active:bg-white/30"
					>
						Press B
					</button>
				{/if}
				{#if showLogo}
					<button
						type="button"
						onclick={() => b.tapLogo()}
						class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/70 transition hover:bg-white/20 active:bg-white/30"
					>
						Touch logo
					</button>
				{/if}
				{#if showAccel}
					<div class="flex w-full items-center gap-2 pt-1">
						<span class="text-[10px] text-white/30">tilt</span>
						<input type="range" min="-1000" max="1000" bind:value={b.inputs.accelX} class="w-full" />
					</div>
				{/if}
			</div>
		{/if}

		<div class="h-20 overflow-y-auto rounded-lg bg-black/30 p-2 font-mono text-[10px] leading-relaxed">
			{#if b.log.length === 0}
				<span class="text-white/25">Waiting…</span>
			{:else}
				{#each b.log as entry (entry.id)}
					<div class={logColor[entry.kind]}>{entry.text}</div>
				{/each}
			{/if}
		</div>
	</div>
{/snippet}

<div class="flex flex-col gap-3">
	<div class="flex items-center justify-between">
		<span class="text-xs font-bold text-(--color-night-soft)">📡 Two-board preview</span>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={togglePlay}
				class="rounded-full bg-(--color-mist) px-3 py-1 text-xs font-bold text-(--color-night-soft) transition hover:bg-(--color-mist)/70"
			>
				{playing ? '⏸ Pause' : '▶ Play'}
			</button>
			<button
				type="button"
				onclick={restartBoth}
				class="rounded-full bg-(--color-mist) px-3 py-1 text-xs font-bold text-(--color-night-soft) transition hover:bg-(--color-mist)/70"
			>
				↻ Restart both
			</button>
		</div>
	</div>

	<div class="flex flex-col gap-3 sm:flex-row">
		{@render board(boardA, labelA)}
		{@render board(boardB, labelB)}
	</div>

	<p class="text-center text-[10px] text-(--color-night-soft)">
		Both panels run the same code, radio-linked to each other — an approximation. Flash real boards to play for real.
	</p>
</div>
