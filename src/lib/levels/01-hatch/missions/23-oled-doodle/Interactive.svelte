<script lang="ts">
	import { connection } from '$lib/stores/connection';
	import YourTurn from '$lib/components/YourTurn.svelte';

	const W = 48;
	const H = 48;
	const CELL = 6;

	let drawing = $state(false);
	let brush = $state(15);
	let canvas: HTMLCanvasElement | undefined = $state();
	let lastSend = 0;
	let queue: { x: number; y: number; c: number }[] = [];

	function paintAt(clientX: number, clientY: number) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const cx = Math.floor(((clientX - rect.left) / rect.width) * W);
		const cy = Math.floor(((clientY - rect.top) / rect.height) * H);
		if (cx < 0 || cy < 0 || cx >= W || cy >= H) return;

		const ctx = canvas.getContext('2d')!;
		const c = brush;
		const px = cx * CELL;
		const py = cy * CELL;
		ctx.fillStyle = `rgba(255, 210, 58, ${c / 15})`;
		ctx.fillRect(px, py, CELL, CELL);

		// Map browser 48×48 to OLED 96×96 (×2 scale)
		queue.push({ x: cx * 2, y: cy * 2, c });
		queue.push({ x: cx * 2 + 1, y: cy * 2, c });
		queue.push({ x: cx * 2, y: cy * 2 + 1, c });
		queue.push({ x: cx * 2 + 1, y: cy * 2 + 1, c });
		flush();
	}

	function flush() {
		const now = performance.now();
		if (now - lastSend < 60 || queue.length === 0) return;
		const batch = queue.splice(0, 20);
		lastSend = now;
		void connection.send({ type: 'oled-pixels', pixels: batch }).catch(() => {});
	}

	function clear() {
		queue = [];
		if (canvas) {
			const ctx = canvas.getContext('2d')!;
			ctx.fillStyle = '#1c1f2e';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}
		void connection.send({ type: 'oled-clear' }).catch(() => {});
	}

	$effect(() => {
		if (canvas) {
			canvas.width = W * CELL;
			canvas.height = H * CELL;
			clear();
		}
	});

	$effect(() => {
		const id = setInterval(flush, 80);
		return () => clearInterval(id);
	});
</script>

<div class="flex flex-col items-center gap-4">
	<canvas
		bind:this={canvas}
		class="rounded-2xl shadow-soft touch-none"
		style="width: 280px; height: 280px;"
		onpointerdown={(e) => {
			drawing = true;
			(e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
			paintAt(e.clientX, e.clientY);
		}}
		onpointermove={(e) => drawing && paintAt(e.clientX, e.clientY)}
		onpointerup={() => (drawing = false)}
	></canvas>

	<div class="flex items-center gap-3">
		<label class="text-xs uppercase tracking-wider text-night-soft">Brush</label>
		<input type="range" min="1" max="15" bind:value={brush} class="w-32" />
		<span class="text-sm font-bold text-night-ink">{brush}/15</span>
		<button class="rounded-full bg-mist px-3 py-1 text-sm font-bold text-night-ink" onclick={clear}>
			Clear
		</button>
	</div>

	<YourTurn
		title="Sketch challenge"
		challenges={[
			'Draw a face that fills the screen.',
			'Write your initials big — others should recognise them.',
			'Draw the Ducky logo from memory.'
		]}
	/>
</div>
