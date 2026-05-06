<script lang="ts">
	import { onMount } from 'svelte';

	export type DuckyMood =
		| 'idle'
		| 'excited'
		| 'thinking'
		| 'celebrating'
		| 'curious'
		| 'sleepy'
		| 'sad';

	type Props = {
		mood?: DuckyMood;
		size?: number;
		bob?: boolean;
		label?: string;
	};

	let { mood = 'idle', size = 160, bob = true, label = 'Ducky' }: Props = $props();

	// Ducky is rendered inline so we can re-color & emote with no asset swap.
	// When real illustrations land, swap this for <img src="/art/ducky/{mood}.svg" />.
	const eyeShape: Record<DuckyMood, 'open' | 'closed' | 'happy' | 'wide'> = {
		idle: 'open',
		excited: 'wide',
		thinking: 'open',
		celebrating: 'happy',
		curious: 'wide',
		sleepy: 'closed',
		sad: 'open'
	};

	const mouthPath: Record<DuckyMood, string> = {
		idle: 'M85 122 Q100 130 115 122',
		excited: 'M82 118 Q100 138 118 118',
		thinking: 'M88 124 Q100 124 112 124',
		celebrating: 'M80 116 Q100 142 120 116',
		curious: 'M90 124 Q100 132 110 124',
		sleepy: 'M88 126 Q100 122 112 126',
		sad: 'M88 128 Q100 118 112 128'
	};

	const cheekColor: Record<DuckyMood, string> = {
		idle: '#ffb5b0',
		excited: '#ff8a82',
		thinking: '#ffc8c4',
		celebrating: '#ff7a6b',
		curious: '#ffb5b0',
		sleepy: '#ffd1cd',
		sad: '#cfd5e6'
	};

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const animationClass = $derived(
		!bob ? '' : mood === 'excited' || mood === 'celebrating' ? 'bob-fast' : 'bob'
	);
</script>

<figure
	class="inline-block select-none"
	style="width: {size}px; height: {size}px;"
	aria-label={label}
>
	<div class={mounted ? animationClass : ''} style="will-change: transform;">
		<svg
			viewBox="0 0 200 200"
			width={size}
			height={size}
			role="img"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
		>
			<!-- soft ground shadow -->
			<ellipse cx="100" cy="186" rx="46" ry="6" fill="#1f2333" opacity="0.12" />

			<!-- body -->
			<ellipse cx="100" cy="118" rx="62" ry="58" fill="#ffd23a" />
			<ellipse cx="100" cy="120" rx="58" ry="54" fill="#ffdd62" />

			<!-- head -->
			<circle cx="100" cy="78" r="48" fill="#ffd23a" />
			<circle cx="100" cy="76" r="44" fill="#ffe07a" />

			<!-- tuft -->
			<path
				d="M85 38 Q100 18 115 38 Q108 30 100 32 Q92 30 85 38"
				fill="#f5b301"
			/>

			<!-- cheeks -->
			<circle cx="74" cy="92" r="9" fill={cheekColor[mood]} opacity="0.65" />
			<circle cx="126" cy="92" r="9" fill={cheekColor[mood]} opacity="0.65" />

			<!-- eyes -->
			{#if eyeShape[mood] === 'closed'}
				<path d="M78 78 Q86 84 94 78" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
				<path d="M106 78 Q114 84 122 78" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
			{:else if eyeShape[mood] === 'happy'}
				<path d="M78 84 Q86 74 94 84" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
				<path d="M106 84 Q114 74 122 84" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
			{:else}
				<g>
					<circle cx="86" cy="80" r={eyeShape[mood] === 'wide' ? 10 : 8} fill="white" />
					<circle cx="114" cy="80" r={eyeShape[mood] === 'wide' ? 10 : 8} fill="white" />
					<circle cx="88" cy="82" r={eyeShape[mood] === 'wide' ? 5 : 4.5} fill="#1f2333" />
					<circle cx="116" cy="82" r={eyeShape[mood] === 'wide' ? 5 : 4.5} fill="#1f2333" />
					<circle cx="89.5" cy="80.5" r="1.5" fill="white" />
					<circle cx="117.5" cy="80.5" r="1.5" fill="white" />
				</g>
			{/if}

			<!-- bill -->
			<ellipse cx="100" cy="108" rx="20" ry="11" fill="#ff9b1a" />
			<ellipse cx="100" cy="106" rx="20" ry="9" fill="#ffb13a" />
			<path
				d={mouthPath[mood]}
				stroke="#b85f00"
				stroke-width="2.5"
				fill="none"
				stroke-linecap="round"
			/>

			<!-- left wing -->
			<path
				d="M52 114 Q42 130 56 152 Q66 142 64 124 Z"
				fill="#f5b301"
			/>

			<!-- feet -->
			<ellipse cx="86" cy="178" rx="10" ry="5" fill="#ff9b1a" />
			<ellipse cx="114" cy="178" rx="10" ry="5" fill="#ff9b1a" />

			<!-- mood-specific accents -->
			{#if mood === 'thinking'}
				<g opacity="0.85">
					<circle cx="158" cy="60" r="6" fill="white" stroke="#1f2333" stroke-width="2" />
					<circle cx="170" cy="42" r="9" fill="white" stroke="#1f2333" stroke-width="2" />
					<text x="166" y="46" font-size="11" font-weight="800" fill="#1f2333">?</text>
				</g>
			{/if}
			{#if mood === 'celebrating'}
				<g>
					<path d="M40 50 L44 42 L48 50 L56 52 L48 56 L44 64 L40 56 L32 52 Z" fill="#ff7a6b" />
					<path d="M158 60 L160 54 L162 60 L168 62 L162 64 L160 70 L158 64 L152 62 Z" fill="#4cc1ff" />
					<circle cx="170" cy="120" r="4" fill="#7ad44b" />
					<circle cx="36" cy="130" r="3.5" fill="#ffd23a" />
				</g>
			{/if}
			{#if mood === 'sleepy'}
				<g opacity="0.85">
					<text x="142" y="44" font-size="22" font-weight="800" fill="#1f2333">z</text>
					<text x="158" y="32" font-size="14" font-weight="800" fill="#1f2333">z</text>
				</g>
			{/if}
		</svg>
	</div>
</figure>
