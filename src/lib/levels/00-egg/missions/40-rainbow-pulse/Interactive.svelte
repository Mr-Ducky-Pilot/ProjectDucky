<script lang="ts">
	let phase = $state(0);
	$effect(() => {
		const id = setInterval(() => (phase = (phase + 1) % 64), 80);
		return () => clearInterval(id);
	});

	const radius = $derived(38 + 18 * Math.sin((phase * Math.PI) / 16));
	const inner = $derived(Math.max(6, radius - 16));
</script>

<div class="flex flex-col items-center gap-4">
	<svg viewBox="0 0 200 200" width="220" height="220" aria-hidden="true">
		<defs>
			<radialGradient id="pulse" cx="50%" cy="50%" r="50%">
				<stop offset="0%" stop-color="#ffd23a" stop-opacity="1" />
				<stop offset="60%" stop-color="#ff7a6b" stop-opacity="0.6" />
				<stop offset="100%" stop-color="#4cc1ff" stop-opacity="0" />
			</radialGradient>
		</defs>
		<circle cx="100" cy="100" r={radius} fill="url(#pulse)" />
		<circle cx="100" cy="100" r={inner} fill="#fff8ec" opacity="0.4" />
	</svg>
	<p class="max-w-xs text-center text-sm text-(--color-night-soft)">
		Breathe in as the glow grows. Breathe out as it shrinks. After a minute, see how you feel.
	</p>
</div>
