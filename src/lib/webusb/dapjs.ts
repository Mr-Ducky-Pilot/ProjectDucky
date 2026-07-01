import { DAPLink, WebUSB } from 'dapjs';
import type { DeviceAdapter, FlashProgress, FlashSource } from './index';
import { decode, encode, type IncomingEvent } from './protocol';

// micro:bit DAPLink USB IDs (same on v1 and v2)
const MICROBIT_VENDOR_ID = 0x0d28;
const MICROBIT_PRODUCT_ID = 0x0204;

const SERIAL_BAUD = 115200;
const SERIAL_POLL_MS = 50;

export type DapAdapterMeta = {
	productName?: string;
	serialNumber?: string;
};

/**
 * Real WebUSB / DAPjs adapter for the micro:bit. Speaks the universal-
 * listener protocol over CMSIS-DAP serial after the firmware is flashed.
 */
export function createDapAdapter(): DeviceAdapter & { meta?: DapAdapterMeta } {
	let usbDevice: USBDevice | null = null;
	let transport: WebUSB | null = null;
	let target: DAPLink | null = null;
	let serialBuffer = '';
	let connected = false;
	let flashing = false;

	const listeners = new Set<(e: IncomingEvent) => void>();
	const meta: DapAdapterMeta = {};

	function emit(e: IncomingEvent) {
		listeners.forEach((l) => l(e));
	}

	function handleSerialChunk(chunk: string) {
		serialBuffer += chunk;
		// Lines are \n-terminated; everything else stays buffered for the next chunk.
		let nl: number;
		while ((nl = serialBuffer.indexOf('\n')) >= 0) {
			const line = serialBuffer.slice(0, nl).replace(/\r$/, '');
			serialBuffer = serialBuffer.slice(nl + 1);
			if (!line) continue;
			const event = decode(line);
			if (event) {
				if (event.type === 'log') console.log('[microbit]', event.text);
				emit(event);
			} else {
				console.log('[microbit raw]', line);
				emit({ type: 'log', text: line });
			}
		}
	}

	return {
		status() {
			if (flashing) return 'flashing';
			if (connected) return 'connected';
			return 'idle';
		},

		async connect() {
			if (!('usb' in navigator)) {
				throw new Error('WebUSB is not supported in this browser. Use Chrome or Edge.');
			}
			usbDevice = await navigator.usb.requestDevice({
				filters: [{ vendorId: MICROBIT_VENDOR_ID, productId: MICROBIT_PRODUCT_ID }]
			});
			meta.productName = usbDevice.productName ?? undefined;
			meta.serialNumber = usbDevice.serialNumber ?? undefined;

			transport = new WebUSB(usbDevice);
			target = new DAPLink(transport);
			await target.connect();
			connected = true;

			// Forward serial data from the device.
			target.on(DAPLink.EVENT_SERIAL_DATA, (data: string) => handleSerialChunk(data));
			try {
				await target.setSerialBaudrate(SERIAL_BAUD);
			} catch {
				// Some boards don't support setting baudrate explicitly — ignore.
			}
			target.startSerialRead(SERIAL_POLL_MS);

			emit({
				type: 'log',
				text: `connected to ${meta.productName ?? 'micro:bit'} (${meta.serialNumber ?? '?'})`
			});
		},

		async disconnect() {
			if (target) {
				try {
					target.stopSerialRead();
				} catch {
					/* noop */
				}
				try {
					await target.disconnect();
				} catch {
					/* noop */
				}
			}
			if (usbDevice && usbDevice.opened) {
				try {
					await usbDevice.close();
				} catch {
					/* noop */
				}
			}
			target = null;
			transport = null;
			usbDevice = null;
			connected = false;
			serialBuffer = '';
		},

		async flash(source: FlashSource, onProgress?: (p: FlashProgress) => void) {
			if (!target) throw new Error('Not connected — connect first.');
			let buffer: ArrayBuffer;
			if (typeof source === 'string') {
				const res = await fetch(source);
				if (!res.ok) {
					throw new Error(
						`Couldn't load firmware (${res.status}). Either the hex isn't built yet or the path is wrong.`
					);
				}
				buffer = await res.arrayBuffer();
			} else {
				buffer = source;
			}

			flashing = true;
			// Stop serial during flash — DAPLink can't do both at once.
			try {
				target.stopSerialRead();
			} catch {
				/* noop */
			}

			const progressHandler = (pct: number) => {
				onProgress?.({
					phase: pct < 0.99 ? 'writing' : 'done',
					pct: Math.max(0, Math.min(1, pct))
				});
			};
			target.on(DAPLink.EVENT_PROGRESS, progressHandler);
			try {
				await target.flash(buffer);
				onProgress?.({ phase: 'done', pct: 1 });
			} finally {
				// dapjs doesn't expose a typed `off` — use the underlying EventEmitter API.
				(target as unknown as { removeListener: (e: string, f: unknown) => void }).removeListener(
					DAPLink.EVENT_PROGRESS,
					progressHandler
				);
				flashing = false;
				try {
					target.startSerialRead(SERIAL_POLL_MS);
				} catch {
					/* noop */
				}
			}
		},

		async send(command) {
			if (!target) throw new Error('Not connected — connect first.');
			const wire = encode(command);
			await target.serialWrite(wire);
		},

		on(cb) {
			listeners.add(cb);
			return () => {
				listeners.delete(cb);
			};
		},

		meta
	};
}
