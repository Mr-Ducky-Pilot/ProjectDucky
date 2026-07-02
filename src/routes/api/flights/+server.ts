import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Server-side proxy for opendata.adsb.fi. The upstream API sends no
 * Access-Control-Allow-Origin header, so a direct browser fetch is blocked by
 * CORS in every environment (not just dev) — this route fetches server-side,
 * where CORS doesn't apply, and relays the JSON back same-origin.
 */
export const GET: RequestHandler = async ({ url, fetch }) => {
	const lat = url.searchParams.get('lat');
	const lon = url.searchParams.get('lon');
	const dist = url.searchParams.get('dist') ?? '50';
	if (!lat || !lon) {
		throw error(400, 'lat and lon query params are required');
	}

	const upstream = `https://opendata.adsb.fi/api/v2/lat/${lat}/lon/${lon}/dist/${dist}`;
	let res: Response;
	try {
		res = await fetch(upstream, { signal: AbortSignal.timeout(6000) });
	} catch (err) {
		throw error(504, err instanceof Error ? err.message : 'Upstream request failed');
	}
	if (!res.ok) {
		throw error(res.status, `adsb.fi returned HTTP ${res.status}`);
	}

	const data = await res.json();
	return json(data);
};
