<script lang="ts">
	import YourTurn from '$lib/components/YourTurn.svelte';
	import { connection } from '$lib/stores/connection';
	import { onMount } from 'svelte';

	type IssData = {
		latitude: number;
		longitude: number;
		altitude: number;
		velocity: number;
		visibility: string;
		timestamp: number;
	};

	type TrailPoint = { lat: number; lon: number };

	let issData = $state<IssData | null>(null);
	let trail = $state<TrailPoint[]>([]);
	let loading = $state(false);
	let fetchError = $state<string | null>(null);
	let lastUpdate = $state<Date | null>(null);
	let canvas = $state<HTMLCanvasElement | null>(null);

	// Canvas dimensions
	const W = 360;
	const H = 180;

	// Equirectangular projection
	function latLonToXY(lat: number, lon: number): { x: number; y: number } {
		return {
			x: ((lon + 180) / 360) * W,
			y: ((90 - lat) / 180) * H
		};
	}

	// Simplified continent outlines as polygon arrays [lon, lat]
	// Using just a very rough outline of major landmasses to keep file size small
	const LAND_PATCHES: [number, number][][] = [
		// North America (rough)
		[[-140,72],[-95,72],[-55,48],[-55,25],[-90,15],[-85,10],[-78,8],[-78,0],[-70,0],[-60,-5],[-50,-5],[-45,-25],[-70,-55],[-75,-52],[-65,-45],[-50,-25],[-50,-5],[-60,-5],[-75,0],[-80,8],[-85,10],[-92,15],[-95,20],[-100,25],[-105,32],[-118,35],[-124,38],[-124,48],[-130,55],[-140,60],[-160,60],[-165,65],[-160,70],[-140,72]],
		// South America (rough)
		[[-80,10],[-75,11],[-60,12],[-50,5],[-35,-5],[-35,-10],[-40,-22],[-43,-23],[-45,-25],[-48,-28],[-50,-32],[-52,-34],[-65,-55],[-70,-52],[-68,-45],[-65,-35],[-60,-28],[-58,-20],[-58,-10],[-62,-5],[-60,0],[-70,5],[-75,10],[-80,10]],
		// Europe (rough)
		[[-10,36],[28,36],[30,42],[36,42],[36,48],[30,55],[25,60],[25,65],[30,70],[15,70],[0,62],[-5,55],[-5,48],[-5,44],[-10,36]],
		// Africa (rough)
		[[-17,16],[51,12],[44,12],[44,0],[40,-10],[35,-20],[30,-35],[18,-35],[17,-30],[12,-18],[8,-5],[8,5],[15,10],[20,15],[25,20],[30,25],[35,30],[38,20],[45,10],[51,12],[51,2],[44,-2],[40,-12],[34,-20],[26,-35],[18,-35],[14,-25],[10,-5],[5,5],[0,5],[-5,5],[-10,0],[-17,10],[-17,16]],
		// Asia (rough)
		[[26,42],[30,42],[36,48],[36,55],[48,55],[60,50],[65,45],[70,40],[80,30],[95,22],[105,18],[108,12],[110,0],[120,5],[130,5],[140,10],[148,45],[145,55],[138,60],[130,65],[100,72],[80,72],[60,68],[45,65],[30,65],[25,65],[25,60],[30,55],[36,55],[48,55],[60,50],[65,42],[70,36],[55,30],[50,28],[45,30],[40,30],[35,35],[30,36],[26,42]],
		// Australia (rough)
		[[115,-22],[115,-32],[120,-34],[130,-34],[138,-35],[145,-38],[150,-38],[152,-28],[148,-20],[142,-15],[135,-12],[130,-15],[122,-18],[115,-22]],
		// Greenland (rough)
		[[-46,60],[-20,60],[-18,72],[-20,76],[-30,83],[-50,83],[-60,80],[-70,75],[-50,60],[-46,60]]
	];

	function drawMap() {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, W, H);

		// Ocean background
		ctx.fillStyle = '#0a1628';
		ctx.fillRect(0, 0, W, H);

		// Latitude grid lines
		ctx.strokeStyle = '#111e30';
		ctx.lineWidth = 0.5;
		for (let lat = -60; lat <= 60; lat += 30) {
			const y = ((90 - lat) / 180) * H;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(W, y);
			ctx.stroke();
		}
		// Longitude grid lines
		for (let lon = -180; lon <= 180; lon += 60) {
			const x = ((lon + 180) / 360) * W;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, H);
			ctx.stroke();
		}

		// Land patches
		ctx.fillStyle = '#1a3050';
		ctx.strokeStyle = '#253d60';
		ctx.lineWidth = 0.5;
		for (const patch of LAND_PATCHES) {
			ctx.beginPath();
			for (let i = 0; i < patch.length; i++) {
				const [lon, lat] = patch[i];
				const { x, y } = latLonToXY(lat, lon);
				if (i === 0) ctx.moveTo(x, y);
				else ctx.lineTo(x, y);
			}
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		// Trail
		if (trail.length > 1) {
			for (let i = 1; i < trail.length; i++) {
				const prev = latLonToXY(trail[i - 1].lat, trail[i - 1].lon);
				const curr = latLonToXY(trail[i].lat, trail[i].lon);
				// Don't draw line if wrapping across antimeridian
				if (Math.abs(trail[i].lon - trail[i - 1].lon) < 90) {
					const alpha = i / trail.length;
					ctx.strokeStyle = `rgba(255,210,58,${alpha * 0.7})`;
					ctx.lineWidth = 1.5;
					ctx.beginPath();
					ctx.moveTo(prev.x, prev.y);
					ctx.lineTo(curr.x, curr.y);
					ctx.stroke();
				}
			}
		}

		// ISS dot
		if (issData) {
			const { x, y } = latLonToXY(issData.latitude, issData.longitude);
			ctx.fillStyle = '#ffd23a';
			ctx.shadowColor = '#ffd23a';
			ctx.shadowBlur = 12;
			ctx.beginPath();
			ctx.arc(x, y, 5, 0, Math.PI * 2);
			ctx.fill();
			ctx.shadowBlur = 0;

			// "ISS" label
			ctx.fillStyle = '#ffd23a';
			ctx.font = 'bold 9px monospace';
			ctx.textAlign = 'left';
			ctx.fillText('ISS', x + 7, y + 3);
		}

		// Equator label
		ctx.fillStyle = '#1e3d5c';
		ctx.font = '8px monospace';
		ctx.textAlign = 'right';
		ctx.fillText('Equator', W - 2, H / 2 - 2);
	}

	async function fetchIss() {
		loading = true;
		fetchError = null;
		try {
			const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
				signal: AbortSignal.timeout(6000)
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			issData = data as IssData;
			trail = [...trail, { lat: data.latitude, lon: data.longitude }].slice(-40);
			lastUpdate = new Date();
			drawMap();
			sendOledUpdate();
		} catch (e) {
			fetchError = e instanceof Error ? e.message : 'Fetch failed';
		}
		loading = false;
	}

	function sendOledUpdate() {
		if (!issData) return;
		const lat = issData.latitude >= 0
			? `${issData.latitude.toFixed(1)}N`
			: `${Math.abs(issData.latitude).toFixed(1)}S`;
		const lon = issData.longitude >= 0
			? `${issData.longitude.toFixed(1)}E`
			: `${Math.abs(issData.longitude).toFixed(1)}W`;
		void connection.send({
			type: 'oled-text',
			lines: ['ISS Live', `Lat: ${lat}`, `Lon: ${lon}`, `${Math.round(issData.altitude)} km up`]
		}).catch(() => {});
	}

	onMount(() => {
		fetchIss();
		const timer = setInterval(fetchIss, 5000);
		return () => clearInterval(timer);
	});

	const speedKmh = $derived(issData ? Math.round(issData.velocity) : 0);
	const inSunlight = $derived(issData?.visibility === 'daylight');
</script>

<div class="flex flex-col gap-5">
	<!-- World map canvas -->
	<div class="overflow-hidden rounded-3xl" style="background:#0a1628;">
		<canvas
			bind:this={canvas}
			width={W}
			height={H}
			class="w-full"
			style="aspect-ratio: 2/1; image-rendering: crisp-edges;"
		></canvas>
	</div>

	{#if loading && !issData}
		<p class="text-center text-xs text-(--color-night-soft)">Contacting tracking station…</p>
	{/if}

	{#if fetchError}
		<div class="rounded-2xl p-3 text-center text-sm font-bold"
			style="background: color-mix(in srgb, var(--color-sunset-coral) 10%, transparent); color: var(--color-sunset-coral)">
			Couldn't reach ISS tracker: {fetchError}. Check your internet connection.
		</div>
	{/if}

	<!-- Live stats -->
	{#if issData}
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Latitude</p>
				<p class="font-mono text-lg font-extrabold">
					{issData.latitude >= 0 ? issData.latitude.toFixed(2) + '°N' : Math.abs(issData.latitude).toFixed(2) + '°S'}
				</p>
			</div>
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Longitude</p>
				<p class="font-mono text-lg font-extrabold">
					{issData.longitude >= 0 ? issData.longitude.toFixed(2) + '°E' : Math.abs(issData.longitude).toFixed(2) + '°W'}
				</p>
			</div>
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Altitude</p>
				<p class="font-mono text-lg font-extrabold">{Math.round(issData.altitude)} km</p>
			</div>
			<div class="card rounded-2xl p-3 text-center">
				<p class="text-xs font-extrabold tracking-wide text-(--color-night-soft) uppercase">Speed</p>
				<p class="font-mono text-lg font-extrabold">{speedKmh.toLocaleString()} km/h</p>
			</div>
		</div>

		<div class="flex items-center gap-3 rounded-2xl p-3"
			style={inSunlight
				? 'background: color-mix(in srgb, var(--color-duck-yellow) 10%, transparent);'
				: 'background: color-mix(in srgb, var(--color-night-ink) 30%, transparent);'}>
			<span class="text-2xl">{inSunlight ? '☀️' : '🌑'}</span>
			<div>
				<p class="text-sm font-extrabold" style={inSunlight ? 'color: var(--color-duck-yellow)' : 'color: #8888aa'}>
					{inSunlight ? 'In sunlight' : 'In Earth\'s shadow'}
				</p>
				<p class="text-xs text-(--color-night-soft)">
					{inSunlight ? 'Astronauts can see the sun right now' : 'The ISS is passing through night — it\'s eclipsed by Earth'}
				</p>
			</div>
		</div>

		<div class="rounded-2xl bg-(--color-pond-blue)/10 p-3">
			<p class="mb-1 text-xs font-extrabold tracking-widest text-(--color-pond-deep) uppercase">Fun facts</p>
			<p class="text-sm text-(--color-night-soft)">
				At {speedKmh.toLocaleString()} km/h, the ISS travels the distance from London to New York in about 23 minutes.
				It completes a full orbit every ~90 minutes and sees 16 sunrises every day.
			</p>
		</div>
	{/if}

	{#if lastUpdate}
		<p class="text-center text-xs text-(--color-night-soft)">
			Updated: {lastUpdate.toLocaleTimeString()} · Refreshes every 5 seconds
		</p>
	{/if}

	<YourTurn challenges={[
		'Watch for 2 minutes — can you see the ISS moving across the map in real time?',
		'Note the current latitude — is the ISS closer to the north pole, south pole, or equator?',
		'At 27,600 km/h, calculate how many km the ISS travels while you count to 10.'
	]} />
</div>
