<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pet, PetColor, PetPattern, PetAccessory } from '$lib/stores/pet';
	import { petAvatar } from '$lib/stores/pet';

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
		/** Override pet config; otherwise reads from the pet store. */
		pet?: Pick<Pet, 'name' | 'color' | 'pattern' | 'accessory'>;
		/** If true, ignore store and use defaults — for marketing/landing pages. */
		generic?: boolean;
	};

	let {
		mood = 'idle',
		size = 160,
		bob = true,
		label = 'Ducky',
		pet,
		generic = false
	}: Props = $props();

	const defaultColor: PetColor = { primary: '#ffd23a', secondary: '#ffe07a', bill: '#ff9b1a' };

	const config = $derived(
		generic
			? { name: '', color: defaultColor, pattern: 'plain' as PetPattern, accessory: 'none' as PetAccessory }
			: (pet ?? $petAvatar)
	);

	const color = $derived(config.color ?? defaultColor);
	const pattern = $derived(config.pattern ?? 'plain');
	const accessory = $derived(config.accessory ?? 'none');

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

	// Darker shade of primary used for wing + tuft
	function shade(hex: string, amount: number): string {
		const c = hex.replace('#', '');
		const r = Math.max(0, Math.min(255, parseInt(c.slice(0, 2), 16) + amount));
		const g = Math.max(0, Math.min(255, parseInt(c.slice(2, 4), 16) + amount));
		const b = Math.max(0, Math.min(255, parseInt(c.slice(4, 6), 16) + amount));
		return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
	}

	const accent = $derived(shade(color.primary, -28));
	const billLight = $derived(shade(color.bill, 18));
	const billDark = $derived(shade(color.bill, -50));

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
	aria-label={config.name ? `${label} — ${config.name}` : label}
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
			<defs>
				<clipPath id="pet-body-clip">
					<ellipse cx="100" cy="118" rx="62" ry="58" />
					<circle cx="100" cy="78" r="48" />
				</clipPath>
			</defs>

			<!-- soft ground shadow -->
			<ellipse cx="100" cy="186" rx="46" ry="6" fill="#1f2333" opacity="0.12" />

			<!-- body -->
			<ellipse cx="100" cy="118" rx="62" ry="58" fill={color.primary} />
			<ellipse cx="100" cy="120" rx="58" ry="54" fill={color.secondary} />

			<!-- head -->
			<circle cx="100" cy="78" r="48" fill={color.primary} />
			<circle cx="100" cy="76" r="44" fill={color.secondary} />

			<!-- pattern overlay -->
			<g clip-path="url(#pet-body-clip)" opacity="0.55">
				{#if pattern === 'spots'}
					<circle cx="70" cy="130" r="6" fill={accent} />
					<circle cx="125" cy="140" r="5" fill={accent} />
					<circle cx="100" cy="155" r="7" fill={accent} />
					<circle cx="58" cy="150" r="4" fill={accent} />
				{:else if pattern === 'stripes'}
					<path d="M50 120 Q100 130 150 120" stroke={accent} stroke-width="4" fill="none" />
					<path d="M48 140 Q100 152 152 140" stroke={accent} stroke-width="4" fill="none" />
					<path d="M52 160 Q100 170 148 160" stroke={accent} stroke-width="4" fill="none" />
				{:else if pattern === 'star'}
					<path d="M100 130 L106 146 L122 146 L110 156 L114 172 L100 162 L86 172 L90 156 L78 146 L94 146 Z" fill={accent} />
				{:else if pattern === 'heart'}
					<path d="M100 168 C75 150 75 130 90 130 C100 130 100 142 100 142 C100 142 100 130 110 130 C125 130 125 150 100 168 Z" fill={accent} />
				{/if}
			</g>

			<!-- tuft -->
			<path
				d="M85 38 Q100 18 115 38 Q108 30 100 32 Q92 30 85 38"
				fill={accent}
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
			<ellipse cx="100" cy="108" rx="20" ry="11" fill={color.bill} />
			<ellipse cx="100" cy="106" rx="20" ry="9" fill={billLight} />
			<path
				d={mouthPath[mood]}
				stroke={billDark}
				stroke-width="2.5"
				fill="none"
				stroke-linecap="round"
			/>

			<!-- left wing -->
			<path d="M52 114 Q42 130 56 152 Q66 142 64 124 Z" fill={accent} />

			<!-- feet -->
			<ellipse cx="86" cy="178" rx="10" ry="5" fill={color.bill} />
			<ellipse cx="114" cy="178" rx="10" ry="5" fill={color.bill} />

			<!-- accessory -->
			{#if accessory === 'bow'}
				<g transform="translate(100 36)">
					<path d="M-14 0 L-2 -6 L-2 6 Z" fill="#ff5fa2" />
					<path d="M14 0 L2 -6 L2 6 Z" fill="#ff5fa2" />
					<circle r="3" fill="#ff8ec3" />
				</g>
			{:else if accessory === 'cap'}
				<g>
					<ellipse cx="100" cy="38" rx="42" ry="8" fill="#1f4f8a" />
					<path d="M62 38 Q60 14 100 14 Q140 14 138 38 Z" fill="#2b6fb8" />
					<rect x="98" y="14" width="4" height="14" fill="#ffd23a" />
				</g>
			{:else if accessory === 'glasses'}
				<g fill="none" stroke="#1f2333" stroke-width="3">
					<circle cx="86" cy="80" r="13" />
					<circle cx="114" cy="80" r="13" />
					<line x1="99" y1="80" x2="101" y2="80" />
				</g>
			{:else if accessory === 'crown'}
				<g>
					<path d="M70 36 L78 18 L86 30 L100 14 L114 30 L122 18 L130 36 Z" fill="#ffcf3f" stroke="#b88500" stroke-width="2" />
					<circle cx="100" cy="22" r="3" fill="#ff5fa2" />
					<circle cx="80" cy="28" r="2.5" fill="#7ad44b" />
					<circle cx="120" cy="28" r="2.5" fill="#4cc1ff" />
				</g>
			{:else if accessory === 'scarf'}
				<g>
					<path d="M62 140 Q100 158 138 140 L138 154 Q100 172 62 154 Z" fill="#ff7a6b" />
					<path d="M138 144 L150 162 L142 168 L130 152 Z" fill="#cf5040" />
				</g>
			{/if}

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
