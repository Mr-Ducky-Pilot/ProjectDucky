import type { DeviceAdapter } from './index';

/**
 * Real DAPjs/WebUSB adapter — stubbed until M0 hardware validation lands.
 * Intentionally throws if invoked, so accidentally flipping VITE_USE_MOCK_USB
 * to "false" before the firmware exists will fail loudly rather than silently.
 */
export function createDapAdapter(): DeviceAdapter {
	throw new Error(
		'Real DAPjs adapter not implemented yet. Keep VITE_USE_MOCK_USB unset (or "true") until M0 hardware validation produces a Ducky firmware hex.'
	);
}
