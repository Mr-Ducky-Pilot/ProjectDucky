<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		count?: number;
		duration?: number; // ms
		colors?: string[];
		burst?: boolean;
	};

	let {
		count = 60,
		duration = 2400,
		colors = ['#ffd23a', '#ff7a6b', '#4cc1ff', '#7ad44b', '#b18cff', '#ff9b1a'],
		burst = true
	}: Props = $props();

	type Piece = {
		x: number;
		y: number;
		size: number;
		rot: number;
		spin: number;
		dx: number;
		dy: number;
		color: string;
		shape: 'sq' | 'rect' | 'circle';
		delay: number;
		dur: number;
	};

	let visible = $state(true);
	let pieces = $state<Piece[]>([]);

	function rand(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function buildPieces(): Piece[] {
		return Array.from({ length: count }, () => ({
			x: rand(30, 70),
			y: burst ? 50 : -10,
			size: rand(6, 14),
			rot: rand(0, 360),
			spin: rand(-720, 720),
			dx: rand(-60, 60),
			dy: burst ? rand(-80, -20) : rand(60, 120),
			color: colors[Math.floor(Math.random() * colors.length)],
			shape: (['sq', 'rect', 'circle'] as const)[Math.floor(Math.random() * 3)],
			delay: rand(0, 250),
			dur: rand(duration * 0.6, duration)
		}));
	}

	onMount(() => {
		pieces = buildPieces();
		const t = setTimeout(() => {
			visible = false;
		}, duration + 400);
		return () => clearTimeout(t);
	});
</script>

{#if visible}
	<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
		{#each pieces as p (p.x + '-' + p.dx)}
			<span
				class="confetti-piece"
				style="
					left: {p.x}%;
					top: {p.y}%;
					width: {p.shape === 'rect' ? p.size * 1.6 : p.size}px;
					height: {p.shape === 'rect' ? p.size * 0.6 : p.size}px;
					background: {p.color};
					border-radius: {p.shape === 'circle' ? '50%' : '2px'};
					--dx: {p.dx}vw;
					--dy: {p.dy}vh;
					--rot: {p.rot}deg;
					--spin: {p.spin}deg;
					animation-delay: {p.delay}ms;
					animation-duration: {p.dur}ms;
				"
			></span>
		{/each}
	</div>
{/if}

<style>
	.confetti-piece {
		position: absolute;
		display: block;
		transform: rotate(var(--rot));
		animation-name: confetti-fall;
		animation-timing-function: cubic-bezier(0.3, 0.6, 0.5, 1);
		animation-fill-mode: forwards;
		opacity: 0.95;
	}

	@keyframes confetti-fall {
		0% {
			transform: translate(0, 0) rotate(var(--rot));
			opacity: 1;
		}
		100% {
			transform: translate(var(--dx), var(--dy)) rotate(calc(var(--rot) + var(--spin)));
			opacity: 0;
		}
	}
</style>
