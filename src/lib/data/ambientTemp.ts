import { connection } from '$lib/stores/connection';

const FRESH_MS = 4000;

/**
 * Subscribe to the external Grove ambient-temperature sensor. The firmware
 * can't reliably detect whether the sensor is physically wired up (a
 * floating analog pin doesn't error, it just reads garbage), so "available"
 * here is a liveness heuristic: true once a reading has arrived, false again
 * if none has arrived recently. Missions use this to prefer the real sensor
 * when it's present and fall back to the CPU-proxy `temperature()` reading
 * otherwise, with a UI hint to connect it.
 */
export async function streamAmbientTemp(
	onReading: (celsius: number) => void,
	onAvailability: (available: boolean) => void
): Promise<() => void> {
	let watchdog: ReturnType<typeof setTimeout> | null = null;
	let available = false;

	function markStale() {
		if (available) {
			available = false;
			onAvailability(false);
		}
	}

	const off = await connection.streamSensor('ambient-temp', ([v]) => {
		if (watchdog) clearTimeout(watchdog);
		if (!available) {
			available = true;
			onAvailability(true);
		}
		onReading(v);
		watchdog = setTimeout(markStale, FRESH_MS);
	});

	return () => {
		if (watchdog) clearTimeout(watchdog);
		off();
	};
}
