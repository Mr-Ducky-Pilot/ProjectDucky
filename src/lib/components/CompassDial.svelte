<script lang="ts">
	type Props = {
		heading: number; // 0-360
		size?: number;
	};

	let { heading, size = 220 }: Props = $props();
</script>

<div
	class="card relative grid place-items-center rounded-full p-4"
	style="width: {size}px; height: {size}px;"
>
	<svg viewBox="0 0 200 200" width={size - 24} height={size - 24} aria-hidden="true">
		<circle cx="100" cy="100" r="92" fill="#fff8ec" stroke="#1f2333" stroke-width="2" />
		{#each [0, 45, 90, 135, 180, 225, 270, 315] as deg}
			<line
				x1="100"
				y1="14"
				x2="100"
				y2={deg % 90 === 0 ? 26 : 22}
				stroke="#1f2333"
				stroke-width={deg % 90 === 0 ? 3 : 1.5}
				transform="rotate({deg} 100 100)"
			/>
		{/each}
		<text x="100" y="36" font-size="14" font-weight="800" text-anchor="middle" fill="#e6463a">N</text>
		<text x="166" y="106" font-size="12" font-weight="800" text-anchor="middle" fill="#1f2333">E</text>
		<text x="100" y="174" font-size="12" font-weight="800" text-anchor="middle" fill="#1f2333">S</text>
		<text x="36" y="106" font-size="12" font-weight="800" text-anchor="middle" fill="#1f2333">W</text>

		<g
			transform="rotate({-heading} 100 100)"
			style="transition: transform 200ms ease-out;"
		>
			<polygon points="100,28 108,108 100,118 92,108" fill="#e6463a" />
			<polygon points="100,172 108,108 100,98 92,108" fill="#1f2333" />
			<circle cx="100" cy="108" r="6" fill="#fff8ec" stroke="#1f2333" stroke-width="2" />
		</g>
	</svg>
	<div class="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-(--color-night-ink) px-3 py-1 font-mono text-xs font-bold text-white">
		{Math.round(heading)}°
	</div>
</div>
