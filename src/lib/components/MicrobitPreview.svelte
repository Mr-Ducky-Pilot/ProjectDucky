<script lang="ts">
	import { onDestroy } from 'svelte';
	import LedMatrix from './LedMatrix.svelte';
	import { parse } from '$lib/simulator/parser';
	import { ParseError } from '$lib/simulator/ast';
	import { runProgram, type Signal } from '$lib/simulator/interpreter';
	import { createDeviceApi, createDefaultInputs, type LogEntry } from '$lib/simulator/device-api';

	type Props = { code: string };
	let { code }: Props = $props();

	let inputs = $state(createDefaultInputs());
	let bits = $state<boolean[]>(new Array(25).fill(false));
	let neopixels = $state<[number, number, number][] | null>(null);
	let log = $state<LogEntry[]>([]);
	let parseErrorMsg = $state<string | null>(null);
	let stalled = $state(false);
	let playing = $state(true);

	// Cheap substring scan of the current source to decide which simulated
	// input controls are worth showing — a false positive just shows an
	// unused control, which is harmless.
	let showButtonA = $derived(code.includes('button_a'));
	let showButtonB = $derived(code.includes('button_b'));
	let showLogo = $derived(code.includes('pin_logo'));
	let showAccel = $derived(code.includes('accelerometer'));
	let showMic = $derived(code.includes('microphone'));
	let showLight = $derived(code.includes('read_light_level'));
	let showTemp = $derived(code.includes('temperature'));
	let anyInputs = $derived(showButtonA || showButtonB || showLogo || showAccel || showMic || showLight || showTemp);

	let gen: Generator<Signal, void, void> | null = null;
	let currentApi: ReturnType<typeof createDeviceApi> | null = null;
	let resumeTimer: ReturnType<typeof setTimeout> | null = null;
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let tickStreak = 0;
	let destroyed = false;

	function clampMs(ms: number): number {
		return Math.min(600, Math.max(16, ms * 0.5));
	}

	function stopTimer() {
		if (resumeTimer) {
			clearTimeout(resumeTimer);
			resumeTimer = null;
		}
	}

	function restart() {
		stopTimer();
		parseErrorMsg = null;
		stalled = false;
		tickStreak = 0;
		try {
			const ast = parse(code);
			const api = createDeviceApi(inputs);
			currentApi = api;
			gen = runProgram(ast, api.globals, (e) => {
				api.pushLog('error', `line ${e.line ?? '?'} — preview isn't sure what to do here (${e.message})`);
			});
			bits = api.state.bits;
			neopixels = api.state.neopixels;
			log = api.state.log;
			if (playing) step();
		} catch (e) {
			gen = null;
			parseErrorMsg = e instanceof ParseError ? `Line ${e.line}: ${e.message}` : (e as Error).message;
		}
	}

	function step() {
		if (!gen || !playing || destroyed || !currentApi) return;
		const api = currentApi;
		let result: IteratorResult<Signal, void>;
		try {
			result = gen.next();
		} catch (e) {
			parseErrorMsg = `Preview stopped: ${(e as Error).message}`;
			return;
		}
		bits = api.state.bits;
		neopixels = api.state.neopixels;
		log = api.state.log;
		if (result.done) return;
		const sig = result.value;
		if (sig.type === 'sleep') {
			tickStreak = 0;
			resumeTimer = setTimeout(step, clampMs(sig.ms));
		} else {
			tickStreak++;
			if (tickStreak > 5) {
				stalled = true;
				api.pushLog('error', "This loop doesn't pause — preview stopped it to stay responsive.");
				return;
			}
			resumeTimer = setTimeout(step, 0);
		}
	}

	function togglePlay() {
		playing = !playing;
		if (playing && !stalled) step();
		else stopTimer();
	}

	$effect(() => {
		void code;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(restart, 500);
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});

	onDestroy(() => {
		destroyed = true;
		stopTimer();
	});

	function tapButtonA() {
		inputs.buttonAPressed = true;
		inputs.buttonAHeld = true;
		setTimeout(() => (inputs.buttonAHeld = false), 150);
	}
	function tapButtonB() {
		inputs.buttonBPressed = true;
		inputs.buttonBHeld = true;
		setTimeout(() => (inputs.buttonBHeld = false), 150);
	}
	function tapLogo() {
		inputs.logoTouched = true;
		setTimeout(() => (inputs.logoTouched = false), 200);
	}

	let tiltPad: HTMLDivElement | undefined = $state();
	let tiltDragging = $state(false);
	let tiltPos = $state({ x: 0.5, y: 0.5 });

	function updateTilt(clientX: number, clientY: number) {
		if (!tiltPad) return;
		const rect = tiltPad.getBoundingClientRect();
		const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
		tiltPos = { x: nx, y: ny };
		inputs.accelX = Math.round((nx - 0.5) * 2000);
		inputs.accelY = Math.round((ny - 0.5) * 2000);
	}

	function onTiltDown(e: PointerEvent) {
		tiltDragging = true;
		updateTilt(e.clientX, e.clientY);
	}
	function onTiltMove(e: PointerEvent) {
		if (!tiltDragging) return;
		updateTilt(e.clientX, e.clientY);
	}
	function onTiltUp() {
		tiltDragging = false;
		tiltPos = { x: 0.5, y: 0.5 };
		inputs.accelX = 0;
		inputs.accelY = 0;
	}

	const logColor: Record<LogEntry['kind'], string> = {
		print: 'text-(--color-leaf-green)',
		scroll: 'text-(--color-duck-yellow)',
		radio: 'text-(--color-pond-blue)',
		music: 'text-(--color-duck-yellow)',
		error: 'text-(--color-sunset-coral)'
	};
</script>

<div class="flex flex-col gap-3 rounded-2xl bg-(--color-night-ink) p-4 shadow-lg">
	<div class="flex items-center justify-between">
		<span class="font-mono text-xs uppercase tracking-wider text-white/40">Preview</span>
		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={togglePlay}
				class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 transition hover:bg-white/20"
			>
				{playing ? '⏸ Pause' : '▶ Play'}
			</button>
			<button
				type="button"
				onclick={restart}
				class="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 transition hover:bg-white/20"
			>
				↻ Restart
			</button>
		</div>
	</div>

	<div class="flex justify-center" class:opacity-40={!!parseErrorMsg}>
		<LedMatrix {bits} size={160} />
	</div>

	{#if neopixels && neopixels.length > 0}
		<div class="flex items-center justify-center gap-1.5">
			{#each neopixels as [r, g, b]}
				<span
					class="size-3 rounded-full border border-white/20"
					style="background: rgb({r}, {g}, {b});"
				></span>
			{/each}
		</div>
	{/if}

	{#if parseErrorMsg}
		<p class="rounded-lg bg-(--color-sunset-coral)/15 px-3 py-2 text-xs text-(--color-sunset-coral)">
			🔍 {parseErrorMsg} — the preview can't follow this yet. Flash it to your board to see the real thing!
		</p>
	{:else if stalled}
		<p class="rounded-lg bg-(--color-sunset-coral)/15 px-3 py-2 text-xs text-(--color-sunset-coral)">
			⏸ This loop doesn't pause — preview stopped it to stay responsive.
		</p>
	{/if}

	{#if anyInputs}
		<div class="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
			{#if showButtonA}
				<button
					type="button"
					onclick={tapButtonA}
					class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/20 active:bg-white/30"
				>
					Press A
				</button>
			{/if}
			{#if showButtonB}
				<button
					type="button"
					onclick={tapButtonB}
					class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/20 active:bg-white/30"
				>
					Press B
				</button>
			{/if}
			{#if showLogo}
				<button
					type="button"
					onclick={tapLogo}
					class="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white/70 transition hover:bg-white/20 active:bg-white/30"
				>
					Touch logo
				</button>
			{/if}
		</div>

		{#if showAccel}
			<div class="flex items-center gap-3">
				<span class="w-12 shrink-0 text-[10px] font-bold uppercase tracking-wide text-white/40">Tilt</span>
				<div
					bind:this={tiltPad}
					onpointerdown={onTiltDown}
					onpointermove={onTiltMove}
					onpointerup={onTiltUp}
					onpointerleave={() => tiltDragging && onTiltUp()}
					role="slider"
					tabindex="0"
					aria-label="Tilt the simulated board"
					aria-valuenow={inputs.accelX}
					aria-valuemin={-1000}
					aria-valuemax={1000}
					class="relative size-16 shrink-0 touch-none rounded-lg bg-white/10"
				>
					<span
						class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-duck-yellow)"
						style="left: {tiltPos.x * 100}%; top: {tiltPos.y * 100}%;"
					></span>
				</div>
				<span class="text-[10px] text-white/30">drag to tilt</span>
			</div>
		{/if}

		{#if showLight}
			<label class="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-white/40">
				<span class="w-12 shrink-0">Light</span>
				<input type="range" min="0" max="255" bind:value={inputs.light} class="w-full" />
			</label>
		{/if}
		{#if showMic}
			<label class="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-white/40">
				<span class="w-12 shrink-0">Mic</span>
				<input type="range" min="0" max="255" bind:value={inputs.mic} class="w-full" />
			</label>
		{/if}
		{#if showTemp}
			<label class="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wide text-white/40">
				<span class="w-12 shrink-0">Temp</span>
				<input type="range" min="-10" max="40" bind:value={inputs.temp} class="w-full" />
			</label>
		{/if}
	{/if}

	<div class="h-24 overflow-y-auto rounded-lg bg-black/30 p-2 font-mono text-[11px] leading-relaxed">
		{#if log.length === 0}
			<span class="text-white/25">Board output appears here…</span>
		{:else}
			{#each log as entry (entry.id)}
				<div class={logColor[entry.kind]}>{entry.text}</div>
			{/each}
		{/if}
	</div>

	<p class="text-center text-[10px] text-white/25">Preview — an approximation. Flash to see it for real.</p>
</div>
