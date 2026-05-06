import type { DeviceAdapter, DeviceStatus, FlashProgress, FlashSource } from './index';
import type { IncomingEvent, OutgoingCommand } from './protocol';

/**
 * Pretend-device adapter. Lets the entire UI be exercised end-to-end without
 * a real micro:bit on the desk. Synthesizes plausible sensor streams so meters,
 * compass dials, and graphs visibly do something.
 */
export function createMockAdapter(): DeviceAdapter {
	let _status: DeviceStatus = 'idle';
	const listeners = new Set<(e: IncomingEvent) => void>();
	const subs = new Set<string>();
	const intervals = new Map<string, ReturnType<typeof setInterval>>();

	function emit(e: IncomingEvent) {
		listeners.forEach((l) => l(e));
	}

	function startStream(sensor: string) {
		if (intervals.has(sensor)) return;
		const id = setInterval(() => {
			let values: number[];
			const t = Date.now() / 1000;
			switch (sensor) {
				case 'accel':
					values = [Math.sin(t * 1.7) * 0.4, Math.cos(t * 1.3) * 0.4, 0.95 + Math.sin(t) * 0.05];
					break;
				case 'mic':
					// random-walk-ish 0..255
					values = [Math.max(0, Math.min(255, 70 + Math.random() * 60))];
					break;
				case 'light':
					values = [Math.round(120 + Math.sin(t / 3) * 60)];
					break;
				case 'temp':
					values = [22 + Math.sin(t / 9) * 1.4];
					break;
				case 'compass':
					values = [(t * 30) % 360];
					break;
				default:
					values = [0];
			}
			emit({ type: 'sensor', sensor: sensor as never, values });
		}, 90);
		intervals.set(sensor, id);
	}

	function stopStream(sensor: string) {
		const id = intervals.get(sensor);
		if (id) clearInterval(id);
		intervals.delete(sensor);
	}

	return {
		status: () => _status,

		async connect() {
			_status = 'requesting';
			await new Promise((r) => setTimeout(r, 700));
			_status = 'connected';
			emit({ type: 'log', text: 'mock device connected' });
		},

		async disconnect() {
			intervals.forEach((id) => clearInterval(id));
			intervals.clear();
			subs.clear();
			_status = 'idle';
		},

		async flash(_source: FlashSource, onProgress?: (p: FlashProgress) => void) {
			_status = 'flashing';
			for (let i = 0; i <= 10; i++) {
				await new Promise((r) => setTimeout(r, 220));
				onProgress?.({
					phase: i < 4 ? 'erasing' : i < 10 ? 'writing' : 'done',
					pct: i / 10
				});
			}
			_status = 'connected';
			// Simulate the board booting and emitting its ready signal
			setTimeout(() => emit({ type: 'log', text: 'Ducky OS ready' }), 400);
		},

		async send(command: OutgoingCommand) {
			// echo back as a log so devs can see the wire traffic in /dev/components
			emit({ type: 'log', text: `→ ${command.type}` });
			if (command.type === 'subscribe') {
				subs.add(command.sensor);
				startStream(command.sensor);
			}
			if (command.type === 'unsubscribe') {
				subs.delete(command.sensor);
				stopStream(command.sensor);
			}
			if (command.type === 'radio-send') {
				// loopback for solo dev
				setTimeout(() => emit({ type: 'radio', payload: command.payload }), 120);
			}
		},

		on(cb) {
			listeners.add(cb);
			return () => listeners.delete(cb);
		}
	};
}
