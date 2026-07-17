<script lang="ts">
	import { LEVELS } from '$lib/data/journey';

	const specs = [
		['mcu', '2 × micro:bit v2 (nRF52833)'],
		['matrix', '5 × 5 LED grid, per board'],
		['radio', '2.4 GHz, ducks talk to ducks'],
		['serial', '115200 baud over WebUSB'],
		['power', 'USB-C or AA battery pack']
	] as const;

	const builds = [
		{
			n: '01',
			title: 'A walkie-talkie',
			desc: 'Two boards. Tilt one, the other lights up. The radio is already on.',
			tag: 'L3 · SWIM'
		},
		{
			n: '02',
			title: 'A pocket synth',
			desc: 'The mic listens, the matrix dances, the speaker hums. You write the rules.',
			tag: 'L2 · WADDLE'
		},
		{
			n: '03',
			title: 'A mood ring',
			desc: 'Light + temperature in, RGB out. Wear it. Argue about what teal means.',
			tag: 'L1 · HATCH'
		}
	];

	// Tiny pixel-glyphs for the hero (5×5 LED matrix nods).
	const heroGlyphs = [
		[0,1,1,1,0, 1,0,0,0,1, 1,0,0,0,1, 1,0,0,0,1, 0,1,1,1,0], // duck egg
		[0,0,1,0,0, 0,1,1,1,0, 1,1,1,1,1, 0,1,1,1,0, 0,0,1,0,0], // diamond
		[1,0,0,0,1, 0,1,0,1,0, 0,0,1,0,0, 0,1,0,1,0, 1,0,0,0,1]  // X
	];
</script>

<!-- ============== HERO ============== -->
<section class="hero">
	<div class="hero-grid" aria-hidden="true"></div>

	<div class="hero-inner">
		<div class="hero-meta">
			<span class="dot"></span>
			<span class="mono">open_source / v0.1 / micro:bit_v2</span>
		</div>

		<h1 class="hero-title">
			<span class="line">A computer</span>
			<span class="line">you can <em>hold</em>.</span>
			<span class="line accent">Two ducks.</span>
			<span class="line accent">One afternoon.</span>
		</h1>

		<p class="hero-sub">
			Ducky is a hardware STEM kit for ages 10–18. Real chips, real radios,
			zero accounts. Plug one in and start in the browser.
		</p>

		<div class="hero-cta">
			<a href="/journey" class="btn btn-primary">
				<span>start the journey</span>
				<span class="arrow">→</span>
			</a>
			<a href="/tutorial" class="btn btn-secondary">
				<span>⚡</span> 15-stop quick tour
			</a>
			<a href="/connect" class="btn btn-secondary">
				<span class="mono">$</span> connect a micro:bit
			</a>
			<a href="/pet" class="btn btn-secondary">
				<span>🦆</span> meet your duck
			</a>
		</div>

		<div class="hero-glyphs" aria-hidden="true">
			{#each heroGlyphs as glyph}
				<div class="glyph">
					{#each glyph as cell}
						<span class="px" class:on={cell === 1}></span>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div class="hero-status mono" aria-hidden="true">
		<span>chrome ✓</span>
		<span>edge ✓</span>
		<span class="off">safari ✗</span>
		<span class="off">firefox ✗</span>
		<span class="sep">·</span>
		<span>no login</span>
		<span>no tracking</span>
	</div>
</section>

<!-- ============== JOURNEY (numbered editorial grid) ============== -->
<section class="section">
	<header class="section-head">
		<div class="kicker mono">01 / the path</div>
		<h2 class="section-title">Six stages, all unlocked.</h2>
		<p class="section-lede">
			No gates, no XP. Pick where you want to be — wander, skip, double back.
		</p>
	</header>

	<ol class="levels">
		{#each LEVELS as level}
			<li class="level" class:locked={!level.available}>
				<a
					class="level-link"
					href={level.available ? `/level/${level.id}` : '/journey'}
				>
					<div class="level-num mono">L{level.id}</div>
					<div class="level-emoji" aria-hidden="true">{level.emoji}</div>
					<div class="level-body">
						<div class="level-title">{level.title}</div>
						<div class="level-blurb">{level.blurb}</div>
					</div>
					<div class="level-state mono">
						{level.available ? 'open →' : 'soon'}
					</div>
				</a>
			</li>
		{/each}
	</ol>
</section>

<!-- ============== HARDWARE SPEC ============== -->
<section class="section section-dark">
	<header class="section-head">
		<div class="kicker mono">02 / hardware</div>
		<h2 class="section-title light">It’s a chip. Not a chatbot.</h2>
		<p class="section-lede light">
			Everything in the box is real. Solderless, screwless, robust enough to drop.
		</p>
	</header>

	<dl class="specs">
		{#each specs as [k, v]}
			<div class="spec">
				<dt class="mono">{k}</dt>
				<dd>{v}</dd>
			</div>
		{/each}
	</dl>
</section>

<!-- ============== WHAT YOU'LL BUILD ============== -->
<section class="section">
	<header class="section-head">
		<div class="kicker mono">03 / what you’ll build</div>
		<h2 class="section-title">Not a quiz. Not a tutorial.</h2>
		<p class="section-lede">
			Small objects with personality. Each mission is a thing you keep.
		</p>
	</header>

	<div class="builds">
		{#each builds as b}
			<article class="build">
				<div class="build-n mono">{b.n}</div>
				<div class="build-tag mono">{b.tag}</div>
				<h3 class="build-title">{b.title}</h3>
				<p class="build-desc">{b.desc}</p>
			</article>
		{/each}
	</div>
</section>

<!-- ============== TENETS (the "why different" reframed) ============== -->
<section class="section">
	<div class="tenets">
		<div class="tenet">
			<div class="tenet-rule"></div>
			<h3>You can break it.</h3>
			<p>Your code runs on the metal. If you brick it, re-flash. Failure is part of the loop.</p>
		</div>
		<div class="tenet">
			<div class="tenet-rule"></div>
			<h3>It needs a friend.</h3>
			<p>Half the missions assume two ducks in the room. Solo works. Pairs are better.</p>
		</div>
		<div class="tenet">
			<div class="tenet-rule"></div>
			<h3>It grows up with you.</h3>
			<p>Start with no code. End writing MicroPython. Same hardware all the way through.</p>
		</div>
	</div>
</section>

<!-- ============== TERMINAL CTA ============== -->
<section class="section">
	<div class="terminal">
		<div class="terminal-bar mono">
			<span class="d"></span><span class="d"></span><span class="d"></span>
			<span class="t">/ducky/connect</span>
		</div>
		<pre class="terminal-body mono"><span class="prompt">~/ducky $</span> plug in a micro:bit
<span class="muted">waiting for device...</span>
<span class="prompt">~/ducky $</span> <a href="/connect" class="terminal-link">./connect<span class="cursor">_</span></a></pre>
	</div>

	<footer class="foot mono">
		<span>ducky · open source</span>
		<span class="sep">·</span>
		<a href="https://github.com/Mr-Ducky-Pilot/projectducky">github</a>
		<span class="sep">·</span>
		<span>made for curious humans</span>
	</footer>
</section>

<style>
	/* ----- type & base ----- */
	.mono {
		font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 600;
		letter-spacing: 0.02em;
	}

	/* ============== HERO ============== */
	.hero {
		position: relative;
		background: #0a0d18;
		color: #f4f1e6;
		padding: 5rem 1.25rem 4rem;
		overflow: hidden;
		isolation: isolate;
		margin-top: -1px; /* meet the layout bar cleanly */
	}
	@media (min-width: 768px) {
		.hero {
			padding: 7rem 2rem 6rem;
		}
	}

	.hero-grid {
		position: absolute;
		inset: 0;
		z-index: -1;
		background-image:
			linear-gradient(rgba(122, 212, 75, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(122, 212, 75, 0.08) 1px, transparent 1px);
		background-size: 32px 32px;
		mask-image: radial-gradient(ellipse at 70% 0%, black 30%, transparent 75%);
	}

	.hero-inner {
		max-width: 1100px;
		margin: 0 auto;
		position: relative;
	}

	.hero-meta {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.4rem 0.9rem;
		border: 1px solid rgba(244, 241, 230, 0.18);
		background: rgba(244, 241, 230, 0.04);
		font-size: 0.72rem;
		text-transform: lowercase;
		color: #c7c3b3;
	}
	.dot {
		width: 7px;
		height: 7px;
		background: #7ad44b;
		box-shadow: 0 0 12px #7ad44b;
		display: inline-block;
		animation: blink 2s ease-in-out infinite;
	}

	.hero-title {
		margin: 1.5rem 0 0;
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(2.75rem, 9vw, 6.5rem);
		line-height: 0.94;
		letter-spacing: -0.045em;
		color: #f7f4e7;
	}
	.hero-title .line {
		display: block;
	}
	.hero-title em {
		font-style: italic;
		font-weight: 900;
		background: linear-gradient(180deg, #ffd23a 0%, #f5b301 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.hero-title .accent {
		color: #7ad44b;
	}

	.hero-sub {
		margin: 1.75rem 0 0;
		max-width: 38ch;
		font-size: 1.1rem;
		line-height: 1.55;
		color: #c7c3b3;
	}

	.hero-cta {
		margin-top: 2rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding: 0.95rem 1.4rem;
		font-weight: 800;
		font-size: 1rem;
		text-decoration: none;
		border-radius: 2px;
		transition: transform 0.12s ease, background 0.15s ease, color 0.15s ease;
	}
	.btn-primary {
		background: #7ad44b;
		color: #0a0d18;
		box-shadow: 4px 4px 0 #f4f1e6;
	}
	.btn-primary:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #f4f1e6;
	}
	.btn-secondary {
		background: transparent;
		color: #f4f1e6;
		border: 1px solid rgba(244, 241, 230, 0.3);
	}
	.btn-secondary:hover {
		background: rgba(244, 241, 230, 0.06);
		border-color: #7ad44b;
		color: #7ad44b;
	}
	.btn .arrow {
		transition: transform 0.15s ease;
	}
	.btn-primary:hover .arrow {
		transform: translateX(3px);
	}

	.hero-glyphs {
		position: absolute;
		right: 0;
		top: 0;
		display: none;
		gap: 1.25rem;
	}
	@media (min-width: 1024px) {
		.hero-glyphs {
			display: flex;
		}
	}
	.glyph {
		display: grid;
		grid-template-columns: repeat(5, 10px);
		grid-template-rows: repeat(5, 10px);
		gap: 3px;
		padding: 12px;
		border: 1px solid rgba(244, 241, 230, 0.12);
	}
	.px {
		width: 10px;
		height: 10px;
		background: rgba(244, 241, 230, 0.06);
	}
	.px.on {
		background: #ffd23a;
		box-shadow: 0 0 6px rgba(255, 210, 58, 0.6);
	}

	.hero-status {
		margin: 3.5rem auto 0;
		max-width: 1100px;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 1.25rem;
		font-size: 0.72rem;
		color: rgba(244, 241, 230, 0.55);
		border-top: 1px dashed rgba(244, 241, 230, 0.15);
		padding-top: 1.5rem;
	}
	.hero-status .off {
		color: rgba(244, 241, 230, 0.25);
	}
	.hero-status .sep {
		color: rgba(244, 241, 230, 0.2);
	}

	/* ============== SECTIONS ============== */
	.section {
		padding: 5rem 1.25rem;
		max-width: 1100px;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.section {
			padding: 7rem 2rem;
		}
	}
	.section-dark {
		background: #0a0d18;
		color: #f4f1e6;
		max-width: none;
		margin: 0;
	}
	.section-dark .section-head {
		max-width: 1100px;
		margin: 0 auto;
	}

	.section-head {
		margin-bottom: 3rem;
		max-width: 56ch;
	}
	.kicker {
		font-size: 0.72rem;
		text-transform: uppercase;
		color: #7a7460;
		margin-bottom: 0.85rem;
		display: block;
	}
	.section-dark .kicker {
		color: #7ad44b;
	}
	.section-title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: clamp(1.85rem, 4.5vw, 3.25rem);
		line-height: 1.02;
		letter-spacing: -0.035em;
		margin: 0;
		color: #1c1f2e;
	}
	.section-title.light {
		color: #f4f1e6;
	}
	.section-lede {
		margin-top: 1rem;
		font-size: 1.1rem;
		line-height: 1.55;
		color: #5a5f7a;
		max-width: 44ch;
	}
	.section-lede.light {
		color: #c7c3b3;
	}

	/* ============== LEVELS ============== */
	.levels {
		list-style: none;
		padding: 0;
		margin: 0;
		border-top: 2px solid #1c1f2e;
	}
	.level {
		border-bottom: 1px solid rgba(28, 31, 46, 0.12);
	}
	.level:last-child {
		border-bottom: 2px solid #1c1f2e;
	}
	.level-link {
		display: grid;
		grid-template-columns: 4.5rem 3rem 1fr auto;
		gap: 1rem;
		align-items: center;
		padding: 1.5rem 0;
		color: inherit;
		text-decoration: none;
		transition: background 0.15s ease, padding 0.15s ease;
	}
	.level-link:hover {
		background: #fff8ec;
		padding-left: 1rem;
		padding-right: 1rem;
	}
	.level.locked .level-link {
		opacity: 0.45;
	}
	.level-num {
		font-size: 0.85rem;
		color: #7a7460;
	}
	.level-emoji {
		font-size: 1.8rem;
		line-height: 1;
	}
	.level-title {
		font-family: var(--font-display);
		font-weight: 800;
		font-size: 1.4rem;
		letter-spacing: -0.02em;
	}
	.level-blurb {
		color: #5a5f7a;
		font-size: 0.95rem;
		margin-top: 0.15rem;
	}
	.level-state {
		font-size: 0.78rem;
		color: #1c1f2e;
		text-transform: lowercase;
	}
	.level.locked .level-state {
		color: #7a7460;
	}
	@media (max-width: 640px) {
		.level-link {
			grid-template-columns: 2.5rem 1fr auto;
			padding: 1.25rem 0;
		}
		.level-num {
			display: none;
		}
		.level-blurb {
			display: none;
		}
	}

	/* ============== SPECS ============== */
	.specs {
		max-width: 1100px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0;
		border-top: 1px solid rgba(244, 241, 230, 0.15);
	}
	@media (min-width: 768px) {
		.specs {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.spec {
		padding: 1.5rem 1rem;
		border-bottom: 1px solid rgba(244, 241, 230, 0.15);
		border-right: 1px solid rgba(244, 241, 230, 0.15);
	}
	.spec:nth-child(2n) {
		border-right: 0;
	}
	@media (min-width: 768px) {
		.spec:nth-child(2n) {
			border-right: 1px solid rgba(244, 241, 230, 0.15);
		}
		.spec:nth-child(3n) {
			border-right: 0;
		}
	}
	.spec dt {
		font-size: 0.7rem;
		text-transform: uppercase;
		color: #7ad44b;
		margin-bottom: 0.5rem;
	}
	.spec dd {
		font-family: var(--font-display);
		font-weight: 700;
		font-size: 1.05rem;
		color: #f4f1e6;
		margin: 0;
	}

	/* ============== BUILDS ============== */
	.builds {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0;
		border: 2px solid #1c1f2e;
	}
	@media (min-width: 768px) {
		.builds {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.build {
		padding: 2rem;
		border-bottom: 2px solid #1c1f2e;
		position: relative;
		background: #fff8ec;
		transition: background 0.15s ease, transform 0.15s ease;
	}
	.build:last-child {
		border-bottom: 0;
	}
	@media (min-width: 768px) {
		.build {
			border-bottom: 0;
			border-right: 2px solid #1c1f2e;
		}
		.build:last-child {
			border-right: 0;
		}
	}
	.build:hover {
		background: #ffd23a;
	}
	.build-n {
		font-size: 0.85rem;
		color: #7a7460;
		position: absolute;
		top: 1rem;
		left: 1rem;
	}
	.build-tag {
		font-size: 0.7rem;
		color: #1c1f2e;
		text-transform: uppercase;
		display: inline-block;
		margin-bottom: 0.5rem;
		padding: 0.2rem 0.5rem;
		background: #1c1f2e;
		color: #f4f1e6;
	}
	.build-title {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1.6rem;
		letter-spacing: -0.025em;
		margin: 0.5rem 0 0.75rem;
		color: #1c1f2e;
	}
	.build-desc {
		color: #3a3f55;
		line-height: 1.5;
		margin: 0;
	}

	/* ============== TENETS ============== */
	.tenets {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}
	@media (min-width: 768px) {
		.tenets {
			grid-template-columns: repeat(3, 1fr);
			gap: 3rem;
		}
	}
	.tenet h3 {
		font-family: var(--font-display);
		font-weight: 900;
		font-size: 1.5rem;
		letter-spacing: -0.025em;
		margin: 0 0 0.6rem;
	}
	.tenet p {
		color: #5a5f7a;
		line-height: 1.55;
		margin: 0;
		max-width: 32ch;
	}
	.tenet-rule {
		width: 2.5rem;
		height: 4px;
		background: #1c1f2e;
		margin-bottom: 1rem;
	}
	.tenet:nth-child(1) .tenet-rule {
		background: #ff7a6b;
	}
	.tenet:nth-child(2) .tenet-rule {
		background: #4cc1ff;
	}
	.tenet:nth-child(3) .tenet-rule {
		background: #7ad44b;
	}

	/* ============== TERMINAL CTA ============== */
	.terminal {
		background: #0a0d18;
		border: 2px solid #1c1f2e;
		max-width: 760px;
		margin: 0 auto;
		font-size: 0.95rem;
	}
	.terminal-bar {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 0.9rem;
		background: #1c1f2e;
		font-size: 0.7rem;
		color: #c7c3b3;
	}
	.terminal-bar .d {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #3a3f55;
	}
	.terminal-bar .d:nth-child(1) {
		background: #ff7a6b;
	}
	.terminal-bar .d:nth-child(2) {
		background: #ffd23a;
	}
	.terminal-bar .d:nth-child(3) {
		background: #7ad44b;
	}
	.terminal-bar .t {
		margin-left: auto;
	}
	.terminal-body {
		padding: 1.5rem 1.25rem;
		margin: 0;
		color: #f4f1e6;
		line-height: 1.7;
		white-space: pre-wrap;
		word-break: break-word;
	}
	.prompt {
		color: #7ad44b;
	}
	.muted {
		color: #5a5f7a;
	}
	.terminal-link {
		color: #ffd23a;
		text-decoration: none;
		border-bottom: 1px dashed currentColor;
	}
	.terminal-link:hover {
		color: #fff;
	}
	.cursor {
		display: inline-block;
		margin-left: 2px;
		color: #7ad44b;
		animation: blink 1s steps(1) infinite;
	}

	.foot {
		max-width: 760px;
		margin: 2.5rem auto 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem 1rem;
		font-size: 0.72rem;
		color: #7a7460;
	}
	.foot a {
		color: #1c1f2e;
		text-decoration: underline;
	}
	.foot .sep {
		color: #c7c3b3;
	}

	/* ----- animations ----- */
	@keyframes blink {
		0%, 49% { opacity: 1; }
		50%, 100% { opacity: 0.2; }
	}

	@media (prefers-reduced-motion: reduce) {
		.dot, .cursor {
			animation: none;
		}
	}
</style>
