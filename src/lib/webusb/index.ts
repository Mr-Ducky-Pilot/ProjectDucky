import type { IncomingEvent, OutgoingCommand } from './protocol';

export type DeviceStatus = 'idle' | 'requesting' | 'connected' | 'flashing' | 'error';

export type FlashProgress = {
	phase: 'erasing' | 'writing' | 'done';
	pct: number; // 0..1
};

export type FlashSource = string | ArrayBuffer;

export type DeviceAdapter = {
	status: () => DeviceStatus;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	flash: (source: FlashSource, onProgress?: (p: FlashProgress) => void) => Promise<void>;
	send: (command: OutgoingCommand) => Promise<void>;
	on: (cb: (event: IncomingEvent) => void) => () => void;
};

export type AdapterKind = 'real' | 'mock';

export type AdapterInstance = {
	kind: AdapterKind;
	adapter: DeviceAdapter;
	deviceLabel?: string;
	deviceSerial?: string;
};

export function isWebUsbSupported(): boolean {
	return typeof navigator !== 'undefined' && 'usb' in navigator;
}

/**
 * Decide which adapter to use. Order:
 *   1. Forced via `VITE_USE_MOCK_USB=true`
 *   2. WebUSB unavailable in the browser → mock with a warning
 *   3. Default: real DAPjs adapter
 */
export async function createAdapter(forceMock = false): Promise<AdapterInstance> {
	const envWantsMock = import.meta.env.VITE_USE_MOCK_USB === 'true';
	const useMock = forceMock || envWantsMock || !isWebUsbSupported();

	if (useMock) {
		const { createMockAdapter } = await import('./mock');
		return { kind: 'mock', adapter: createMockAdapter() };
	}

	const { createDapAdapter } = await import('./dapjs');
	const adapter = createDapAdapter();
	return {
		kind: 'real',
		adapter,
		get deviceLabel() {
			return adapter.meta?.productName;
		},
		get deviceSerial() {
			return adapter.meta?.serialNumber;
		}
	};
}
