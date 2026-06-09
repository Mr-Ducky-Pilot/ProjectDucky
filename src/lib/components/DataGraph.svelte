<script lang="ts">
	type Sample = { t: number; v: number };

	type Props = {
		samples: Sample[];
		id?: string;
		unit?: string;
		color?: string;
		width?: number;
		height?: number;
	};

	let {
		samples,
		id,
		unit = '',
		color = '#4cc1ff',
		width = 600,
		height = 220
	}: Props = $props();

	let canvas: HTMLCanvasElement | undefined = $state();

	$effect(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d')!;
		const W = canvas.width;
		const H = canvas.height;

		ctx.clearRect(0, 0, W, H);

		if (samples.length === 0) {
			ctx.fillStyle = '#5a5f7a';
			ctx.font = '14px system-ui';
			ctx.textAlign = 'center';
			ctx.fillText('Press start — graph will draw here.', W / 2, H / 2);
			return;
		}

		const vs = samples.map((s) => s.v);
		const ts = samples.map((s) => s.t);
		let minV = Math.min(...vs);
		let maxV = Math.max(...vs);
		if (minV === maxV) {
			minV -= 1;
			maxV += 1;
		}
		const padV = (maxV - minV) * 0.1;
		minV -= padV;
		maxV += padV;
		const minT = ts[0];
		const maxT = ts[ts.length - 1] || minT + 1;

		// grid
		ctx.strokeStyle = '#eef0f5';
		ctx.lineWidth = 1;
		for (let i = 1; i < 5; i++) {
			const y = (H / 5) * i;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(W, y);
			ctx.stroke();
		}

		// line
		ctx.strokeStyle = color;
		ctx.lineWidth = 2.5;
		ctx.lineJoin = 'round';
		ctx.beginPath();
		samples.forEach((s, i) => {
			const x = ((s.t - minT) / (maxT - minT || 1)) * (W - 20) + 10;
			const y = H - ((s.v - minV) / (maxV - minV)) * (H - 20) - 10;
			if (i === 0) ctx.moveTo(x, y);
			else ctx.lineTo(x, y);
		});
		ctx.stroke();

		// labels
		ctx.fillStyle = '#5a5f7a';
		ctx.font = '12px system-ui';
		ctx.textAlign = 'left';
		ctx.fillText(`${maxV.toFixed(1)}${unit}`, 6, 14);
		ctx.fillText(`${minV.toFixed(1)}${unit}`, 6, H - 4);
	});
</script>

<canvas
	{id}
	bind:this={canvas}
	{width}
	{height}
	style="width: 100%; max-width: {width}px; height: auto; display: block;"
></canvas>
