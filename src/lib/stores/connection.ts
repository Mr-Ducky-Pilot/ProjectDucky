import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import {
	createAdapter,
	isWebUsbSupported,
	type AdapterInstance,
	type AdapterKind,
	type DeviceAdapter,
	type DeviceStatus,
	type FlashProgress,
	type FlashSource
} from '$lib/webusb';
import type { IncomingEvent, OutgoingCommand, Sensor } from '$lib/webusb/protocol';

type ConnState = {
	status: DeviceStatus;
	flash: FlashProgress | null;
	error: string | null;
	kind: AdapterKind;
	deviceLabel: string | null;
	deviceSerial: string | null;
	webusbSupported: boolean;
	preferMock: boolean;
};

const initial: ConnState = {
	status: 'idle',
	flash: null,
	error: null,
	kind: 'real',
	deviceLabel: null,
	deviceSerial: null,
	webusbSupported: false,
	preferMock: false
};

const _store = writable<ConnState>(initial);
let instance: AdapterInstance | null = null;
const eventListeners = new Set<(e: IncomingEvent) => void>();

const offEventInternal = (cb: (e: IncomingEvent) => void) => {
	eventListeners.delete(cb);
};

async function ensureAdapter(): Promise<DeviceAdapter> {
	if (instance) return instance.adapter;
	const preferMock = get(_store).preferMock;
	instance = await createAdapter(preferMock);
	instance.adapter.on((e) => eventListeners.forEach((l) => l(e)));
	_store.update((s) => ({
		...s,
		kind: instance!.kind,
		deviceLabel: instance!.deviceLabel ?? null,
		deviceSerial: instance!.deviceSerial ?? null
	}));
	return instance.adapter;
}

async function teardownAdapter() {
	if (!instance) return;
	try {
		await instance.adapter.disconnect();
	} catch {
		/* noop */
	}
	instance = null;
}

function onEvent(cb: (e: IncomingEvent) => void): () => void {
	eventListeners.add(cb);
	return () => offEventInternal(cb);
}

export const connection = {
	subscribe: _store.subscribe,
	status: derived(_store, (s) => s.status),

	async connect() {
		_store.update((s) => ({ ...s, status: 'requesting', error: null }));
		try {
			const a = await ensureAdapter();
			await a.connect();
			_store.update((s) => ({
				...s,
				status: a.status(),
				deviceLabel: instance?.deviceLabel ?? s.deviceLabel,
				deviceSerial: instance?.deviceSerial ?? s.deviceSerial
			}));
		} catch (err) {
			const msg = err instanceof Error ? err.message : String(err);
			// User cancelling the WebUSB picker is normal — surface it but
			// don't park in the "error" state forever.
			const cancelled = /cancelled|no device selected/i.test(msg);
			_store.update((s) => ({
				...s,
				status: cancelled ? 'idle' : 'error',
				error: cancelled ? null : msg
			}));
		}
	},

	async disconnect() {
		await teardownAdapter();
		_store.update((s) => ({
			...s,
			status: 'idle',
			deviceLabel: null,
			deviceSerial: null
		}));
	},

	/**
	 * Toggle between real WebUSB and the in-browser mock device. Disconnects
	 * any existing adapter so the next `connect()` call rebuilds with the new
	 * preference.
	 */
	async setPreferMock(preferMock: boolean) {
		await teardownAdapter();
		_store.update((s) => ({
			...s,
			preferMock,
			status: 'idle',
			error: null,
			deviceLabel: null,
			deviceSerial: null
		}));
	},

	async flash(source: FlashSource) {
		const a = await ensureAdapter();
		_store.update((s) => ({ ...s, status: 'flashing', flash: { phase: 'erasing', pct: 0 } }));
		try {
			await a.flash(source, (p) => _store.update((s) => ({ ...s, flash: p })));
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
	_store.update((s) => ({ ...s, webusbSupported: isWebUsbSupported() }));
	// Don't eagerly create the adapter — real WebUSB requires the requestDevice
	// call to be inside a user gesture, so we wait for the user to click Connect.
}
