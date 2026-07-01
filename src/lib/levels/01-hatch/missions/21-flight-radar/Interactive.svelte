<script lang="ts">
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	// ── Airports ─────────────────────────────────────────────────────────────
	const AIRPORTS = [
		{ name: 'London Heathrow', code: 'LHR', lat: 51.477, lon: -0.461 },
		{ name: 'New York JFK', code: 'JFK', lat: 40.641, lon: -73.778 },
		{ name: 'Los Angeles LAX', code: 'LAX', lat: 33.943, lon: -118.408 },
		{ name: 'Dubai DXB', code: 'DXB', lat: 25.253, lon: 55.365 },
		{ name: 'Tokyo Narita', code: 'NRT', lat: 35.765, lon: 140.386 },
		{ name: 'Sydney', code: 'SYD', lat: -33.946, lon: 151.177 },
		{ name: 'Amsterdam', code: 'AMS', lat: 52.309, lon: 4.764 },
		{ name: 'Singapore', code: 'SIN', lat: 1.359, lon: 103.989 },
		{ name: 'Toronto Pearson', code: 'YYZ', lat: 43.677, lon: -79.630 },
		{ name: 'Paris CDG', code: 'CDG', lat: 49.009, lon: 2.548 }
	];

	const RADAR_RANGE_NM = 50;
	const RADAR_RANGE_KM = RADAR_RANGE_NM * 1.852;

	type Plane = {
		callsign: string;
		lat: number;
		lon: number;
		altFt: number;
		speed: number;
		track: number;
		dx: number;
		dy: number;
		distKm: number;
	};

	let airport = $state(AIRPORTS[0]);
	let planes = $state<Plane[]>([]);
	let loading = $state(false);
	let fetchError = $state<string | null>(null);
	let lastUpdate = $state<Date | null>(null);
	let sweepAngle = $state(0);
	let canvas = $state<HTMLCanvasElement | null>(null);

	// ── Maths helpers ─────────────────────────────────────────────────────────
	function distKm(lat1: number, lon1: number, lat2: number, lon2: number) {
		const R = 6371;
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const a = Math.sin(dLat / 2) ** 2
			+ Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180)
			* Math.sin(dLon / 2) ** 2;
		return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	}

	function bearing(lat1: number, lon1: number, lat2: number, lon2: number) {
		const dLon = (lon2 - lon1) * Math.PI / 180;
		const x = Math.sin(dLon) * Math.cos(lat2 * Math.PI / 180);
		const y = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180)
			- Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos(dLon);
		return (Math.atan2(x, y) * 180 / Math.PI + 360) % 360;
	}

	function altColor(ft: number): string {
		if (ft > 30000) return '#7ad44b';
		if (ft > 10000) return '#ffd23a';
		return '#ff7a6b';
	}

	// ── API fetch ─────────────────────────────────────────────────────────────
	async function fetchFlights() {
		loading = true;
		fetchError = null;
		try {
			const res = await fetch(
				`https://opendata.adsb.fi/api/v2/lat/${airport.lat}/lon/${airport.lon}/dist/${RADAR_RANGE_NM}`,
				{ signal: AbortSignal.timeout(6000) }
			);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const ac: any[] = data.ac ?? [];

			const R_PX = 148;
			planes = ac
				.filter((a) => a.lat != null && a.lon != null)
				.map((a) => {
					const d = distKm(airport.lat, airport.lon, a.lat, a.lon);
					const b = bearing(airport.lat, airport.lon, a.lat, a.lon);
					const frac = Math.min(d / RADAR_RANGE_KM, 1.0);
					const ang = b * Math.PI / 180;
					return {
						callsign: String(a.flight ?? a.r ?? a.hex ?? '???').trim(),
						lat: a.lat,
						lon: a.lon,
						altFt: Number(a.alt_baro ?? a.alt_geom ?? 0),
						speed: Number(a.gs ?? 0),
						track: Number(a.track ?? 0),
						dx: Math.round(frac * R_PX * Math.sin(ang)),
						dy: Math.round(-frac * R_PX * Math.cos(ang)),
						distKm: d
					};
				})
				.sort((a, b) => a.distKm - b.distKm)
				.slice(0, 60);

			lastUpdate = new Date();
		} catch (e) {
			fetchError = e instanceof Error ? e.message : 'Fetch failed';
		}
		loading = false;
	}

	// ── Canvas drawing ────────────────────────────────────────────────────────
	function drawRadar() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;
		const SIZE = 340;
		const cx = SIZE / 2;
		const cy = SIZE / 2;
		const R = 148;

		ctx.clearRect(0, 0, SIZE, SIZE);

		// Dark background circle
		ctx.fillStyle = '#060d1a';
		ctx.beginPath();
		ctx.arc(cx, cy, R + 12, 0, Math.PI * 2);
		ctx.fill();

		// Range rings
		[0.25, 0.5, 0.75, 1.0].forEach((frac) => {
			ctx.strokeStyle = frac === 1.0 ? '#1a3d28' : '#0d2218';
			ctx.lineWidth = frac === 1.0 ? 1.5 : 1;
			ctx.beginPath();
			ctx.arc(cx, cy, R * frac, 0, Math.PI * 2);
			ctx.stroke();
		});

		// Crosshair lines
		ctx.strokeStyle = '#0d2218';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
		ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
		ctx.stroke();

		// Range labels
		ctx.fillStyle = '#1e4a30';
		ctx.font = '10px monospace';
		ctx.textAlign = 'center';
		const km25 = Math.round(RADAR_RANGE_KM * 0.25);
		const km50 = Math.round(RADAR_RANGE_KM * 0.5);
		ctx.fillText(`${km25}km`, cx + 4, cy - R * 0.25 + 12);
		ctx.fillText(`${km50}km`, cx + 4, cy - R * 0.5 + 12);

		// Sweep sector
		const sweepRad = sweepAngle * Math.PI / 180 - Math.PI / 2;
		const span = Math.PI / 9; // 20 degrees
		ctx.save();
		ctx.globalAlpha = 0.18;
		ctx.fillStyle = '#00e550';
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.arc(cx, cy, R, sweepRad - span, sweepRad);
		ctx.closePath();
		ctx.fill();
		ctx.restore();

		// Sweep leading edge
		ctx.save();
		ctx.globalAlpha = 0.9;
		ctx.strokeStyle = '#00e550';
		ctx.lineWidth = 1.5;
		ctx.shadowColor = '#00e550';
		ctx.shadowBlur = 4;
		ctx.beginPath();
		ctx.moveTo(cx, cy);
		ctx.lineTo(cx + (R + 8) * Math.cos(sweepRad), cy + (R + 8) * Math.sin(sweepRad));
		ctx.stroke();
		ctx.restore();

		// NSEW labels
		ctx.fillStyle = '#2a6040';
		ctx.font = 'bold 11px monospace';
		ctx.textAlign = 'center';
		ctx.fillText('N', cx, cy - R - 5);
		ctx.fillText('S', cx, cy + R + 14);
		ctx.textAlign = 'left';
		ctx.fillText('E', cx + R + 5, cy + 4);
		ctx.textAlign = 'right';
		ctx.fillText('W', cx - R - 3, cy + 4);

		// Airport centre
		ctx.fillStyle = '#4cc1ff';
		ctx.beginPath();
		ctx.arc(cx, cy, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = '#4cc1ff';
		ctx.font = 'bold 11px monospace';
		ctx.textAlign = 'left';
		ctx.fillText(airport.code, cx + 8, cy + 4);

		// Plane blips
		for (const plane of planes) {
			const px = cx + plane.dx;
			const py = cy + plane.dy;
			const color = altColor(plane.altFt);
			const trackRad = plane.track * Math.PI / 180;

			ctx.save();
			ctx.translate(px, py);
			ctx.rotate(trackRad);
			ctx.fillStyle = color;
			ctx.shadowColor = color;
			ctx.shadowBlur = 5;
			ctx.beginPath();
			ctx.moveTo(0, -7);
			ctx.lineTo(-4, 5);
			ctx.lineTo(0, 2);
			ctx.lineTo(4, 5);
			ctx.closePath();
			ctx.fill();
			ctx.restore();

			// Callsign label
			ctx.fillStyle = color;
			ctx.font = '9px monospace';
			ctx.textAlign = 'left';
			ctx.fillText(plane.callsign, px + 8, py + 3);
		}
	}

	// ── Lifecycle ─────────────────────────────────────────────────────────────
	onMount(() => {
		let animFrame: number;

		function animate() {
			sweepAngle = (sweepAngle + 1.2) % 360;
			drawRadar();
			animFrame = requestAnimationFrame(animate);
		}
		animate();

		fetchFlights();
		const fetchTimer = setInterval(fetchFlights, 2000);

		return () => {
			cancelAnimationFrame(animFrame);
			clearInterval(fetchTimer);
		};
	});

	function changeAirport(code: string) {
		const found = AIRPORTS.find((a) => a.code === code);
		if (found) {
			airport = found;
			planes = [];
			fetchFlights();
		}
	}

	const nearest = $derived(planes[0] ?? null);
	const highest = $derived(planes.length > 0 ? planes.reduce((a, b) => a.altFt > b.altFt ? a : b) : null);
	const fastest = $derived(planes.length > 0 ? planes.reduce((a, b) => a.speed > b.speed ? a : b) : null);
</script>

<div class="flex flex-col gap-5">
	<!-- Airport picker -->
	<div class="flex flex-wrap items-center gap-3">
		<label for="airport-select" class="text-sm font-extrabold text-(--color-night-soft)">Airport:</label>
		<select
			id="airport-select"
			value={airport.code}
			onchange={(e) => changeAirport(e.currentTarget.value)}
			class="rounded-xl border-2 border-(--color-mist) bg-white px-3 py-2 text-sm font-bold"
		>
			{#each AIRPORTS as a}
				<option value={a.code}>{a.name} ({a.code})</option>
			{/each}
		</select>

		{#if loading}
			<span class="text-xs text-(--color-night-soft)">Scanning sky…</span>
		{:else if planes.length > 0}
			<span class="rounded-full bg-(--color-leaf-green)/15 px-3 py-1 text-xs font-bold text-(--color-leaf-deep)">
				{planes.length} planes detected
			</span>
		{/if}
	</div>

	<!-- Radar canvas -->
	<div class="flex justify-center">
		<div class="relative rounded-3xl overflow-hidden" style="background:#060d1a; width:340px; height:340px;">
			<canvas
				bind:this={canvas}
				width={340}
				height={340}
			></canvas>
			{#if loading && planes.length === 0}
				<div class="absolute inset-0 flex items-center justify-center">
					<p class="font-mono text-sm" style="color:#1a5030">Contacting satellite…</p>
				</div>
			{/if}
		</div>
	</div>

	{#if fetchError}
		<div class="rounded-2xl p-3 text-center text-sm font-bold"
			style="background: color-mix(in srgb, var(--color-sunset-coral) 10%, transparent); color: var(--color-sunset-coral)">
			Couldn't reach flight data: {fetchError}. Check your internet connection.
		</div>
	{/if}

	<!-- Stats row -->
	{#if planes.length > 0}
		<div class="grid grid-cols-3 gap-3">
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Nearest</p>
				<p class="font-mono text-base font-extrabold" style="color:#4cc1ff">{nearest?.callsign ?? '—'}</p>
				<p class="text-xs text-(--color-night-soft)">{nearest ? Math.round(nearest.distKm) + ' km' : ''}</p>
			</div>
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Highest</p>
				<p class="font-mono text-base font-extrabold" style="color:#7ad44b">{highest?.callsign ?? '—'}</p>
				<p class="text-xs text-(--color-night-soft)">{highest ? Math.round(highest.altFt / 1000) + 'k ft' : ''}</p>
			</div>
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Fastest</p>
				<p class="font-mono text-base font-extrabold" style="color:#ffd23a">{fastest?.callsign ?? '—'}</p>
				<p class="text-xs text-(--color-night-soft)">{fastest ? fastest.speed + ' kts' : ''}</p>
			</div>
		</div>

		<!-- Plane list table -->
		<div class="rounded-2xl border-2 border-(--color-mist) overflow-hidden">
			<table class="w-full text-sm">
				<thead>
					<tr class="bg-(--color-mist)">
						<th class="px-3 py-2 text-left text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Callsign</th>
						<th class="px-3 py-2 text-right text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Altitude</th>
						<th class="px-3 py-2 text-right text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Speed</th>
						<th class="px-3 py-2 text-right text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Distance</th>
					</tr>
				</thead>
				<tbody>
					{#each planes.slice(0, 12) as plane}
						<tr class="border-t border-(--color-mist)">
							<td class="px-3 py-2 font-mono font-bold" style="color: {altColor(plane.altFt)}">{plane.callsign}</td>
							<td class="px-3 py-2 text-right font-mono text-xs text-(--color-night-soft)">{plane.altFt.toLocaleString()} ft</td>
							<td class="px-3 py-2 text-right font-mono text-xs text-(--color-night-soft)">{plane.speed} kts</td>
							<td class="px-3 py-2 text-right font-mono text-xs text-(--color-night-soft)">{Math.round(plane.distKm)} km</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}

	<!-- Altitude legend -->
	<div class="flex flex-wrap justify-center gap-4 text-xs font-bold">
		<span style="color:#7ad44b">▲ Cruising (&gt;30k ft)</span>
		<span style="color:#ffd23a">▲ Climbing/descending (10–30k ft)</span>
		<span style="color:#ff7a6b">▲ Low (&lt;10k ft)</span>
	</div>

	{#if lastUpdate}
		<p class="text-center text-xs text-(--color-night-soft)">
			Last updated: {lastUpdate.toLocaleTimeString()} · Refreshes every 2 seconds
		</p>
	{/if}

	<YourTurn challenges={[
		'Watch the radar for 30 seconds — how many planes can you count in range at once?',
		'Find the plane with the highest altitude — what is it, and is it cruising or still climbing?',
		'Switch to a different airport and compare — which one is busier right now?'
	]} />
</div>
