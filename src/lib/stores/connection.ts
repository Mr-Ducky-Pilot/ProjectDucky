import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import {
	createAdapter,
	type DeviceAdapter,
	type DeviceStatus,
	type FlashProgress
} from '$lib/webusb';
import type { IncomingEvent, OutgoingCommand, Sensor } from '$lib/webusb/protocol';

type ConnState = {
	status: DeviceStatus;
	flash: FlashProgress | null;
	error: string | null;
	mock: boolean;
};

const initial: ConnState = {
	status: 'idle',
	flash: null,
	error: null,
	mock: true
};

const _store = writable<ConnState>(initial);
let adapter: DeviceAdapter | null = null;
const eventListeners = new Set<(e: IncomingEvent) => void>();

async function ensureAdapter(): Promise<DeviceAdapter> {
	if (!adapter) {
		adapter = await createAdapter();
		adapter.on((e) => eventListeners.forEach((l) => l(e)));
	}
	return adapter;
}

function onEvent(cb: (e: IncomingEvent) => void): () => void {
	eventListeners.add(cb);
	return () => {
		eventListeners.delete(cb);
	};
}

export const connection = {
	// Re-expose the writable store interface so `$connection` works in templates.
	subscribe: _store.subscribe,
	status: derived(_store, (s) => s.status),

	async connect() {
		_store.update((s) => ({ ...s, status: 'requesting', error: null }));
		try {
			const a = await ensureAdapter();
			await a.connect();
			_store.update((s) => ({ ...s, status: a.status() }));
		} catch (err) {
			_store.update((s) => ({
				...s,
				status: 'error',
				error: err instanceof Error ? err.message : String(err)
			}));
		}
	},

	async disconnect() {
		if (!adapter) return;
		await adapter.disconnect();
		_store.update((s) => ({ ...s, status: 'idle' }));
	},

	async flash(hexUrl: string) {
		const a = await ensureAdapter();
		_store.update((s) => ({ ...s, status: 'flashing', flash: { phase: 'erasing', pct: 0 } }));
		try {
			await a.flash(hexUrl, (p) => _store.update((s) => ({ ...s, flash: p })));
			_store.update((s) => ({ ...s, status: 'connected', flash: null }));
		} catch (err) {
			_store.update((s) => ({
				...s,
				status: 'error',
				error: err instanceof Error ? err.message : String(err),
				flash: null
			}));
		}
	},

	async send(command: OutgoingCommand) {
		const a = await ensureAdapter();
		await a.send(command);
	},

	/**
	 * Subscribe to a sensor stream from the device. Returns an unsubscribe
	 * function. Named `streamSensor` (not `subscribe`) to avoid colliding with
	 * the store's `subscribe` method that backs `$connection`.
	 */
	async streamSensor(sensor: Sensor, cb: (values: number[]) => void): Promise<() => void> {
		const a = await ensureAdapter();
		const off = onEvent((e) => {
			if (e.type === 'sensor' && e.sensor === sensor) cb(e.values);
		});
		await a.send({ type: 'subscribe', sensor });
		return () => {
			off();
			void a.send({ type: 'unsubscribe', sensor });
		};
	},

	onEvent,

	getState(): ConnState {
		return get(_store);
	}
};

if (browser) {
	// Eagerly create the adapter so the listener is wired up — keeps event flow
	// consistent regardless of which page first interacts with hardware.
	void ensureAdapter();
}
