<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pet, PetColor, PetPattern, PetAccessory, PetSpecies } from '$lib/stores/pet';
	import { petAvatar, SPECIES_INFO } from '$lib/stores/pet';

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
		/** Override pet config; otherwise reads from the pet store. Species defaults to duck if omitted. */
		pet?: Partial<Pick<Pet, 'name' | 'species' | 'color' | 'pattern' | 'accessory'>>;
		/** If true, ignore store and use defaults — for marketing/landing pages. */
		generic?: boolean;
	};

	let {
		mood = 'idle',
		size = 160,
		bob = true,
		label = 'Pet',
		pet,
		generic = false
	}: Props = $props();

	const defaultColor: PetColor = SPECIES_INFO.duck.defaultColor;

	const config = $derived(
		generic
			? {
					name: '',
					species: 'duck' as PetSpecies,
					color: defaultColor,
					pattern: 'plain' as PetPattern,
					accessory: 'none' as PetAccessory
				}
			: (pet ?? $petAvatar)
	);

	const species = $derived((config.species ?? 'duck') as PetSpecies);
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

	/** Generic non-bill mouth path used for cat/dog/bunny/etc. */
	const smilePath: Record<DuckyMood, string> = {
		idle: 'M88 112 Q100 120 112 112',
		excited: 'M84 108 Q100 126 116 108',
		thinking: 'M92 114 Q100 114 108 114',
		celebrating: 'M82 106 Q100 130 118 106',
		curious: 'M90 114 Q100 122 110 114',
		sleepy: 'M92 116 Q100 112 108 116',
		sad: 'M90 120 Q100 110 110 120'
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

	// Shade helper — used for wing/tuft/accents.
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
	const bellyLight = $derived(shade(color.secondary, 22));

	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});

	const animationClass = $derived(
		!bob ? '' : mood === 'excited' || mood === 'celebrating' ? 'bob-fast' : 'bob'
	);

	// Eye position offsets per species (some need bigger/closer eyes)
	const eyeRadius = $derived(eyeShape[mood] === 'wide' ? 10 : 8);
	const pupilRadius = $derived(eyeShape[mood] === 'wide' ? 5 : 4.5);
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

			<!-- ─── Behind-body decorations (tails, wings) ─── -->
			{#if species === 'fox'}
				<!-- fluffy tail behind body -->
				<path
					d="M160 130 Q186 110 184 80 Q200 96 188 138 Q176 158 152 154 Z"
					fill={color.primary}
				/>
				<path d="M178 96 Q190 88 184 78 Q176 86 178 96 Z" fill="#fff8ec" />
			{:else if species === 'unicorn'}
				<!-- flowing tail -->
				<path
					d="M158 130 Q190 124 180 100 Q174 130 158 142 Z"
					fill="#ff9bd5"
				/>
				<path
					d="M162 138 Q192 142 184 116 Q176 142 162 150 Z"
					fill="#b18cff"
				/>
			{/if}

			<!-- ─── Body ─── -->
			<ellipse cx="100" cy="118" rx="62" ry="58" fill={color.primary} />
			<ellipse cx="100" cy="120" rx="58" ry="54" fill={color.secondary} />

			<!-- penguin & panda belly patch -->
			{#if species === 'penguin'}
				<ellipse cx="100" cy="130" rx="40" ry="44" fill="#fff8ec" />
			{:else if species === 'panda'}
				<ellipse cx="100" cy="132" rx="38" ry="38" fill="#fff8ec" />
			{:else if species === 'fox'}
				<ellipse cx="100" cy="138" rx="32" ry="28" fill="#fff8ec" />
			{:else if species === 'dragon'}
				<ellipse cx="100" cy="138" rx="30" ry="26" fill={bellyLight} />
				<!-- belly ridges -->
				<path d="M76 130 L124 130 M76 142 L124 142 M82 154 L118 154" stroke={accent} stroke-width="1.5" opacity="0.4" />
			{/if}

			<!-- ─── Head ─── -->
			{#if species === 'robot'}
				<rect x="56" y="36" width="88" height="80" rx="14" fill={color.primary} />
				<rect x="60" y="40" width="80" height="72" rx="12" fill={color.secondary} />
				<!-- screen panel -->
				<rect x="68" y="58" width="64" height="42" rx="8" fill="#1f2333" opacity="0.18" />
			{:else}
				<circle cx="100" cy="78" r="48" fill={color.primary} />
				<circle cx="100" cy="76" r="44" fill={color.secondary} />
			{/if}

			<!-- panda face mask -->
			{#if species === 'panda'}
				<ellipse cx="100" cy="76" r="44" rx="44" ry="44" fill="#fff8ec" />
			{/if}

			<!-- ─── Pattern overlay ─── -->
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

			<!-- ─── Top of head: tufts / ears / horns / antennae ─── -->
			{#if species === 'duck'}
				<path d="M85 38 Q100 18 115 38 Q108 30 100 32 Q92 30 85 38" fill={accent} />
			{:else if species === 'cat'}
				<!-- two triangular ears -->
				<path d="M62 56 L72 22 L92 46 Z" fill={color.primary} />
				<path d="M138 56 L128 22 L108 46 Z" fill={color.primary} />
				<path d="M68 50 L74 32 L84 46 Z" fill="#ff9bb5" />
				<path d="M132 50 L126 32 L116 46 Z" fill="#ff9bb5" />
			{:else if species === 'dog'}
				<!-- floppy ears hanging at sides of head -->
				<ellipse cx="58" cy="78" rx="14" ry="28" fill={accent} />
				<ellipse cx="142" cy="78" rx="14" ry="28" fill={accent} />
				<ellipse cx="58" cy="80" rx="9" ry="22" fill={shade(color.primary, -10)} />
				<ellipse cx="142" cy="80" rx="9" ry="22" fill={shade(color.primary, -10)} />
			{:else if species === 'bunny'}
				<!-- two long upright ears -->
				<ellipse cx="80" cy="22" rx="9" ry="26" fill={color.primary} />
				<ellipse cx="120" cy="22" rx="9" ry="26" fill={color.primary} />
				<ellipse cx="80" cy="24" rx="4" ry="20" fill="#ff9bb5" />
				<ellipse cx="120" cy="24" rx="4" ry="20" fill="#ff9bb5" />
			{:else if species === 'fox'}
				<!-- pointy fox ears -->
				<path d="M62 56 L74 14 L96 46 Z" fill={color.primary} />
				<path d="M138 56 L126 14 L104 46 Z" fill={color.primary} />
				<path d="M70 48 L78 28 L88 44 Z" fill="#1f2333" />
				<path d="M130 48 L122 28 L112 44 Z" fill="#1f2333" />
			{:else if species === 'panda'}
				<!-- round black ears -->
				<circle cx="64" cy="44" r="14" fill="#1f2333" />
				<circle cx="136" cy="44" r="14" fill="#1f2333" />
				<circle cx="64" cy="44" r="7" fill="#3a3f54" />
				<circle cx="136" cy="44" r="7" fill="#3a3f54" />
			{:else if species === 'dragon'}
				<!-- horns -->
				<path d="M76 40 L70 16 L84 36 Z" fill={color.bill} />
				<path d="M124 40 L130 16 L116 36 Z" fill={color.bill} />
				<!-- spike ridge -->
				<path
					d="M88 36 L94 28 L100 36 L106 28 L112 36 Z"
					fill={accent}
				/>
			{:else if species === 'axolotl'}
				<!-- frilly gills on either side -->
				<g fill="#ff5fa2">
					<circle cx="52" cy="64" r="8" />
					<circle cx="46" cy="76" r="9" />
					<circle cx="52" cy="90" r="8" />
					<circle cx="148" cy="64" r="8" />
					<circle cx="154" cy="76" r="9" />
					<circle cx="148" cy="90" r="8" />
				</g>
				<g fill="#ff9bd5">
					<circle cx="54" cy="62" r="4" />
					<circle cx="48" cy="74" r="4" />
					<circle cx="54" cy="88" r="4" />
					<circle cx="146" cy="62" r="4" />
					<circle cx="152" cy="74" r="4" />
					<circle cx="146" cy="88" r="4" />
				</g>
				<!-- tiny pom on head -->
				<circle cx="100" cy="34" r="6" fill="#ff5fa2" />
				<circle cx="100" cy="34" r="3" fill="#ff9bd5" />
			{:else if species === 'penguin'}
				<!-- no top piece, just a tiny tuft -->
				<path d="M94 34 Q100 24 106 34 Z" fill={shade(color.primary, -10)} />
			{:else if species === 'owl'}
				<!-- ear tufts -->
				<path d="M70 46 L62 22 L82 38 Z" fill={accent} />
				<path d="M130 46 L138 22 L118 38 Z" fill={accent} />
			{:else if species === 'unicorn'}
				<!-- mane swoop -->
				<path
					d="M58 70 Q44 50 70 36 Q72 56 84 56 Z"
					fill="#ff9bd5"
				/>
				<path
					d="M62 86 Q44 78 56 62 Q66 76 76 76 Z"
					fill="#b18cff"
				/>
				<!-- horn -->
				<path d="M100 8 L108 38 L92 38 Z" fill="#ffd23a" stroke="#b88500" stroke-width="1.5" />
				<line x1="96" y1="22" x2="104" y2="22" stroke="#b88500" stroke-width="1" />
				<line x1="94" y1="30" x2="106" y2="30" stroke="#b88500" stroke-width="1" />
			{:else if species === 'robot'}
				<!-- antenna -->
				<line x1="100" y1="36" x2="100" y2="18" stroke="#1f2333" stroke-width="3" stroke-linecap="round" />
				<circle cx="100" cy="14" r="5" fill="#4cc1ff" />
				<circle cx="100" cy="14" r="2" fill="white" />
				<!-- corner bolts -->
				<circle cx="64" cy="44" r="3" fill="#1f2333" />
				<circle cx="136" cy="44" r="3" fill="#1f2333" />
				<circle cx="64" cy="108" r="3" fill="#1f2333" />
				<circle cx="136" cy="108" r="3" fill="#1f2333" />
			{/if}

			<!-- panda eye patches (drawn before eyes) -->
			{#if species === 'panda'}
				<ellipse cx="86" cy="80" rx="13" ry="15" fill="#1f2333" transform="rotate(-12 86 80)" />
				<ellipse cx="114" cy="80" rx="13" ry="15" fill="#1f2333" transform="rotate(12 114 80)" />
			{/if}

			<!-- owl eye discs -->
			{#if species === 'owl'}
				<circle cx="86" cy="80" r="16" fill="#fff8ec" stroke={accent} stroke-width="2" />
				<circle cx="114" cy="80" r="16" fill="#fff8ec" stroke={accent} stroke-width="2" />
			{/if}

			<!-- ─── Cheeks ─── -->
			{#if species !== 'panda' && species !== 'robot' && species !== 'owl' && species !== 'penguin'}
				<circle cx="74" cy="92" r="9" fill={cheekColor[mood]} opacity="0.65" />
				<circle cx="126" cy="92" r="9" fill={cheekColor[mood]} opacity="0.65" />
			{/if}

			<!-- ─── Eyes ─── -->
			{#if eyeShape[mood] === 'closed'}
				<path d="M78 78 Q86 84 94 78" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
				<path d="M106 78 Q114 84 122 78" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
			{:else if eyeShape[mood] === 'happy'}
				<path d="M78 84 Q86 74 94 84" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
				<path d="M106 84 Q114 74 122 84" stroke="#1f2333" stroke-width="3.5" fill="none" stroke-linecap="round" />
			{:else if species === 'robot'}
				<rect x="78" y="74" width="16" height="14" rx="3" fill="#4cc1ff" />
				<rect x="106" y="74" width="16" height="14" rx="3" fill="#4cc1ff" />
				<rect x="82" y="78" width="6" height="6" fill="white" />
				<rect x="110" y="78" width="6" height="6" fill="white" />
			{:else}
				<g>
					<circle cx="86" cy="80" r={eyeRadius} fill="white" />
					<circle cx="114" cy="80" r={eyeRadius} fill="white" />
					<circle cx="88" cy="82" r={pupilRadius} fill="#1f2333" />
					<circle cx="116" cy="82" r={pupilRadius} fill="#1f2333" />
					<circle cx="89.5" cy="80.5" r="1.5" fill="white" />
					<circle cx="117.5" cy="80.5" r="1.5" fill="white" />
				</g>
			{/if}

			<!-- ─── Mouth / bill / beak / nose ─── -->
			{#if species === 'duck'}
				<ellipse cx="100" cy="108" rx="20" ry="11" fill={color.bill} />
				<ellipse cx="100" cy="106" rx="20" ry="9" fill={billLight} />
				<path d={mouthPath[mood]} stroke={billDark} stroke-width="2.5" fill="none" stroke-linecap="round" />
			{:else if species === 'cat'}
				<!-- pink triangle nose -->
				<path d="M94 104 L106 104 L100 110 Z" fill="#ff5fa2" />
				<path d="M100 110 Q100 116 96 118 M100 110 Q100 116 104 118" stroke="#1f2333" stroke-width="2" fill="none" stroke-linecap="round" />
				<path d={smilePath[mood]} stroke="#1f2333" stroke-width="2.5" fill="none" stroke-linecap="round" />
				<!-- whiskers -->
				<g stroke="#1f2333" stroke-width="1.2" stroke-linecap="round" opacity="0.6">
					<line x1="60" y1="106" x2="80" y2="110" />
					<line x1="60" y1="114" x2="80" y2="114" />
					<line x1="140" y1="106" x2="120" y2="110" />
					<line x1="140" y1="114" x2="120" y2="114" />
				</g>
			{:else if species === 'dog'}
				<!-- oval black nose -->
				<ellipse cx="100" cy="106" rx="8" ry="6" fill="#1f2333" />
				<ellipse cx="98" cy="104" rx="2" ry="1.5" fill="white" opacity="0.6" />
				<path d="M100 112 L100 118" stroke="#1f2333" stroke-width="2" />
				<path d={smilePath[mood]} stroke="#1f2333" stroke-width="2.5" fill="none" stroke-linecap="round" />
				<!-- tongue -->
				{#if mood === 'excited' || mood === 'celebrating'}
					<ellipse cx="100" cy="124" rx="5" ry="6" fill="#ff5fa2" />
				{/if}
			{:else if species === 'bunny'}
				<!-- pink Y-nose -->
				<path d="M96 106 L104 106 L100 112 Z" fill="#ff5fa2" />
				<path d="M100 112 L100 118" stroke="#1f2333" stroke-width="1.8" />
				<path d="M100 118 Q94 122 92 118 M100 118 Q106 122 108 118" stroke="#1f2333" stroke-width="1.8" fill="none" stroke-linecap="round" />
				<!-- buck teeth -->
				{#if mood === 'excited' || mood === 'celebrating' || mood === 'curious'}
					<rect x="96" y="122" width="3.5" height="6" fill="white" stroke="#1f2333" stroke-width="0.8" />
					<rect x="100.5" y="122" width="3.5" height="6" fill="white" stroke="#1f2333" stroke-width="0.8" />
				{/if}
			{:else if species === 'fox'}
				<!-- snout -->
				<path d="M84 100 Q100 122 116 100 Q108 116 100 116 Q92 116 84 100 Z" fill="#fff8ec" />
				<ellipse cx="100" cy="110" rx="5" ry="4" fill="#1f2333" />
				<path d={smilePath[mood]} stroke="#1f2333" stroke-width="2.5" fill="none" stroke-linecap="round" transform="translate(0 2)" />
			{:else if species === 'panda'}
				<ellipse cx="100" cy="106" rx="6" ry="4" fill="#1f2333" />
				<path d="M100 110 L100 116" stroke="#1f2333" stroke-width="2" />
				<path d={smilePath[mood]} stroke="#1f2333" stroke-width="2.5" fill="none" stroke-linecap="round" transform="translate(0 2)" />
			{:else if species === 'dragon'}
				<!-- snout muzzle -->
				<ellipse cx="100" cy="110" rx="22" ry="13" fill={color.secondary} />
				<ellipse cx="100" cy="108" rx="22" ry="11" fill={bellyLight} />
				<!-- nostrils -->
				<circle cx="92" cy="106" r="1.6" fill={accent} />
				<circle cx="108" cy="106" r="1.6" fill={accent} />
				<path d={mouthPath[mood]} stroke={accent} stroke-width="2.5" fill="none" stroke-linecap="round" />
				<!-- tiny fangs -->
				{#if mood === 'excited' || mood === 'celebrating'}
					<path d="M93 124 L95 130 L97 124 Z" fill="white" stroke="#1f2333" stroke-width="0.8" />
					<path d="M103 124 L105 130 L107 124 Z" fill="white" stroke="#1f2333" stroke-width="0.8" />
				{/if}
			{:else if species === 'axolotl'}
				<!-- flat smile, no nose -->
				<circle cx="92" cy="100" r="1.5" fill="#1f2333" opacity="0.6" />
				<circle cx="108" cy="100" r="1.5" fill="#1f2333" opacity="0.6" />
				<path d={smilePath[mood]} stroke="#1f2333" stroke-width="3" fill="none" stroke-linecap="round" />
			{:else if species === 'penguin'}
				<!-- triangular beak -->
				<path d="M88 106 L112 106 L100 122 Z" fill={color.bill} />
				<path d="M88 106 L112 106 L100 114 Z" fill={billLight} />
				<line x1="88" y1="106" x2="112" y2="106" stroke={billDark} stroke-width="1.5" />
			{:else if species === 'owl'}
				<!-- diamond beak -->
				<path d="M100 96 L108 106 L100 116 L92 106 Z" fill={color.bill} />
				<path d="M100 96 L108 106 L100 110 L92 106 Z" fill={billLight} />
			{:else if species === 'unicorn'}
				<!-- soft pony muzzle -->
				<ellipse cx="100" cy="110" rx="18" ry="11" fill={bellyLight} />
				<ellipse cx="93" cy="108" rx="1.5" ry="2" fill="#1f2333" opacity="0.6" />
				<ellipse cx="107" cy="108" rx="1.5" ry="2" fill="#1f2333" opacity="0.6" />
				<path d={smilePath[mood]} stroke="#ff5fa2" stroke-width="2.5" fill="none" stroke-linecap="round" />
			{:else if species === 'robot'}
				<!-- LED grill mouth -->
				<rect x="80" y="98" width="40" height="10" rx="3" fill="#1f2333" opacity="0.18" />
				{#each [0, 1, 2, 3, 4] as i}
					<circle
						cx={86 + i * 7}
						cy="103"
						r="2"
						fill={mood === 'excited' || mood === 'celebrating'
							? '#7ad44b'
							: mood === 'sad'
								? '#ff7a6b'
								: '#4cc1ff'}
					/>
				{/each}
			{/if}

			<!-- ─── Side ornament (wing / arm / flipper) ─── -->
			{#if species === 'duck'}
				<path d="M52 114 Q42 130 56 152 Q66 142 64 124 Z" fill={accent} />
			{:else if species === 'cat' || species === 'fox' || species === 'panda' || species === 'bunny'}
				<!-- small paw -->
				<ellipse cx="56" cy="140" rx="10" ry="8" fill={species === 'panda' ? '#1f2333' : accent} />
			{:else if species === 'penguin'}
				<!-- flipper -->
				<ellipse cx="50" cy="130" rx="10" ry="24" fill={color.primary} transform="rotate(12 50 130)" />
			{:else if species === 'dragon'}
				<!-- tiny wing -->
				<path d="M50 108 Q34 96 30 124 Q44 122 56 130 Z" fill={accent} />
				<path d="M40 116 Q44 122 56 126" stroke={shade(accent, -20)} stroke-width="1.5" fill="none" />
			{:else if species === 'owl'}
				<path d="M52 120 Q42 144 60 160 Q66 148 64 128 Z" fill={accent} />
			{:else if species === 'robot'}
				<rect x="44" y="118" width="14" height="34" rx="3" fill={accent} />
				<rect x="142" y="118" width="14" height="34" rx="3" fill={accent} />
				<circle cx="51" cy="118" r="4" fill={shade(accent, -20)} />
				<circle cx="149" cy="118" r="4" fill={shade(accent, -20)} />
			{/if}

			<!-- ─── Feet ─── -->
			{#if species === 'duck' || species === 'penguin'}
				<ellipse cx="86" cy="178" rx="10" ry="5" fill={color.bill} />
				<ellipse cx="114" cy="178" rx="10" ry="5" fill={color.bill} />
			{:else if species === 'robot'}
				<rect x="76" y="174" width="20" height="8" rx="2" fill={shade(accent, -20)} />
				<rect x="104" y="174" width="20" height="8" rx="2" fill={shade(accent, -20)} />
			{:else if species === 'axolotl'}
				<!-- four tiny limbs -->
				<ellipse cx="68" cy="170" rx="8" ry="5" fill={color.primary} />
				<ellipse cx="132" cy="170" rx="8" ry="5" fill={color.primary} />
			{:else}
				<!-- generic paws/feet -->
				<ellipse cx="86" cy="176" rx="11" ry="6" fill={accent} />
				<ellipse cx="114" cy="176" rx="11" ry="6" fill={accent} />
				<!-- toe beans -->
				<circle cx="82" cy="176" r="1.5" fill={shade(accent, 20)} />
				<circle cx="86" cy="174" r="1.5" fill={shade(accent, 20)} />
				<circle cx="90" cy="176" r="1.5" fill={shade(accent, 20)} />
				<circle cx="110" cy="176" r="1.5" fill={shade(accent, 20)} />
				<circle cx="114" cy="174" r="1.5" fill={shade(accent, 20)} />
				<circle cx="118" cy="176" r="1.5" fill={shade(accent, 20)} />
			{/if}

			<!-- ─── Accessory ─── -->
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

			<!-- ─── Mood-specific accents ─── -->
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
