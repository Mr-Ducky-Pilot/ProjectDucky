import type { IncomingEvent, OutgoingCommand } from './protocol';

export type DeviceStatus = 'idle' | 'requesting' | 'connected' | 'flashing' | 'error';

export type FlashProgress = {
	phase: 'erasing' | 'writing' | 'done';
	pct: number; // 0..1
};

export type DeviceAdapter = {
	status: () => DeviceStatus;
	connect: () => Promise<void>;
	disconnect: () => Promise<void>;
	flash: (hexUrl: string, onProgress?: (p: FlashProgress) => void) => Promise<void>;
	send: (command: OutgoingCommand) => Promise<void>;
	on: (cb: (event: IncomingEvent) => void) => () => void;
};

export async function createAdapter(): Promise<DeviceAdapter> {
	// Vite env switch — flip to false once a real ducky firmware is on the desk.
	const useMock = import.meta.env.VITE_USE_MOCK_USB !== 'false';
	if (useMock) {
		const { createMockAdapter } = await import('./mock');
		return createMockAdapter();
	}
	const { createDapAdapter } = await import('./dapjs');
	return createDapAdapter();
}
