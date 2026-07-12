import { RuntimeErr } from './errors';
import { BUILTINS, pyStr, RANDOM_NS, type NativeFn } from './builtins';
import { FONT_3X5 } from '../data/font3x5';
import { IMAGE_CONSTANTS, imageFromGridString } from './images';

export type LogKind = 'print' | 'scroll' | 'radio' | 'music' | 'error';
export type LogEntry = { kind: LogKind; text: string; id: number };

export type SimDeviceState = {
	bits: boolean[];
	neopixels: [number, number, number][] | null;
	log: LogEntry[];
	fatalError: string | null;
};

export type SimInputs = {
	buttonAPressed: boolean; // discrete "tap" flag, consumed by was_pressed()
	buttonBPressed: boolean;
	buttonAHeld: boolean;
	buttonBHeld: boolean;
	logoTouched: boolean;
	accelX: number;
	accelY: number;
	accelZ: number;
	light: number; // 0-255
	mic: number; // 0-255
	temp: number; // celsius
};

export function createDefaultInputs(): SimInputs {
	return {
		buttonAPressed: false,
		buttonBPressed: false,
		buttonAHeld: false,
		buttonBHeld: false,
		logoTouched: false,
		accelX: 0,
		accelY: 0,
		accelZ: -1000,
		light: 128,
		mic: 40,
		temp: 21
	};
}

/** Marker returned by native functions that need the interpreter to pause. */
export class SleepRequest {
	constructor(public ms: number) {}
}

export type ImageValue = { __isImage: true; bits: boolean[] };

let logIdCounter = 0;
const MAX_LOG_LINES = 60;

function charBits(ch: string): boolean[] {
	const glyph = FONT_3X5[ch.toUpperCase()];
	const bits = new Array(25).fill(false);
	if (!glyph) return bits;
	for (let r = 0; r < 5; r++) {
		const row = glyph[r] ?? '000';
		for (let c = 0; c < 3; c++) bits[r * 5 + (c + 1)] = row[c] === '1';
	}
	return bits;
}

function isImageValue(v: unknown): v is ImageValue {
	return !!v && typeof v === 'object' && (v as any).__isImage === true;
}

export type RadioIO = { send: (payload: unknown) => void; receive: () => unknown };

export function createDeviceApi(inputs: SimInputs, radioIO?: RadioIO) {
	const state: SimDeviceState = {
		bits: new Array(25).fill(false),
		neopixels: null,
		log: [],
		fatalError: null
	};

	function pushLog(kind: LogKind, text: string) {
		state.log = [...state.log.slice(-(MAX_LOG_LINES - 1)), { kind, text, id: logIdCounter++ }];
	}

	function setBits(bits: boolean[]) {
		state.bits = bits.slice(0, 25);
	}

	const display = {
		show: ((args) => {
			const v = args[0];
			if (isImageValue(v)) {
				setBits(v.bits);
			} else if (typeof v === 'string') {
				setBits(charBits(v[0] ?? ' '));
				if (v.length > 1) pushLog('scroll', v);
			} else {
				throw new RuntimeErr('display.show() needs an Image or a short string');
			}
			return null;
		}) as NativeFn,
		scroll: ((args) => {
			const s = pyStr(args[0]);
			pushLog('scroll', s);
			setBits(charBits(s[0] ?? ' '));
			return null;
		}) as NativeFn,
		clear: (() => {
			setBits(new Array(25).fill(false));
			return null;
		}) as NativeFn,
		set_pixel: ((args) => {
			const idx = Number(args[1]) * 5 + Number(args[0]);
			const bits = state.bits.slice();
			if (idx >= 0 && idx < 25) bits[idx] = Number(args[2]) > 0;
			setBits(bits);
			return null;
		}) as NativeFn,
		get_pixel: ((args) => {
			const idx = Number(args[1]) * 5 + Number(args[0]);
			return state.bits[idx] ? 9 : 0;
		}) as NativeFn,
		read_light_level: (() => inputs.light) as NativeFn,
		on: (() => null) as NativeFn,
		off: (() => {
			setBits(new Array(25).fill(false));
			return null;
		}) as NativeFn
	};

	const ImageCtor = ((args: unknown[]) => ({
		__isImage: true,
		bits: imageFromGridString(String(args[0]))
	})) as unknown as NativeFn & Record<string, ImageValue>;
	for (const [name, bits] of Object.entries(IMAGE_CONSTANTS)) {
		(ImageCtor as any)[name] = { __isImage: true, bits };
	}

	// Built-in tune constants (music.WAWAWAWAA etc.) — exact notes don't
	// matter since the preview only logs/animates, never synthesizes audio.
	const BUILTIN_TUNES: Record<string, string[]> = {
		WAWAWAWAA: ['C4:2', 'B3:2', 'A3:2', 'G3:2', 'F3:2', 'E3:2', 'D3:2', 'C3:8'],
		POWER_UP: ['C4:1', 'E4:1', 'G4:1', 'C5:4'],
		JUMP_UP: ['C4:1', 'D4:1', 'E4:1'],
		BA_DING: ['C5:2', 'E5:4']
	};

	const music: Record<string, unknown> = {
		play: ((args, kwargs) => {
			const notes = args[0];
			const list = Array.isArray(notes) ? notes : [notes];
			pushLog('music', `♪ ${list.map(pyStr).join(' ')}`);
			if (kwargs['wait'] === false) return null;
			return new SleepRequest(Math.min(600, list.length * 150));
		}) as NativeFn,
		pitch: ((args) => {
			pushLog('music', `♪ ${Math.round(Number(args[0]))}Hz`);
			return new SleepRequest(Math.min(600, Number(args[1]) || 0));
		}) as NativeFn
	};
	for (const [name, tune] of Object.entries(BUILTIN_TUNES)) music[name] = tune;

	const radio = {
		on: (() => null) as NativeFn,
		off: (() => null) as NativeFn,
		config: (() => null) as NativeFn,
		send: ((args) => {
			pushLog('radio', `sent: ${pyStr(args[0])}`);
			radioIO?.send(args[0]);
			return null;
		}) as NativeFn,
		// Single-board preview (no radioIO passed): no peer to receive from —
		// see the sandbox design doc's "Known limitation". The paired L3
		// preview passes a cross-wired radioIO so two simulated boards can
		// actually talk to each other.
		receive: (() => radioIO?.receive() ?? null) as NativeFn
	};

	const accelerometer = {
		get_x: (() => inputs.accelX) as NativeFn,
		get_y: (() => inputs.accelY) as NativeFn,
		get_z: (() => inputs.accelZ) as NativeFn,
		get_strength: (() =>
			Math.round(Math.sqrt(inputs.accelX ** 2 + inputs.accelY ** 2 + inputs.accelZ ** 2))) as NativeFn
	};

	const microphone = { sound_level: (() => inputs.mic) as NativeFn };

	const button_a = {
		was_pressed: (() => {
			const p = inputs.buttonAPressed;
			inputs.buttonAPressed = false;
			return p;
		}) as NativeFn,
		is_pressed: (() => inputs.buttonAHeld) as NativeFn
	};
	const button_b = {
		was_pressed: (() => {
			const p = inputs.buttonBPressed;
			inputs.buttonBPressed = false;
			return p;
		}) as NativeFn,
		is_pressed: (() => inputs.buttonBHeld) as NativeFn
	};
	const pin_logo = { is_touched: (() => inputs.logoTouched) as NativeFn };

	function makeNeoPixel(n: number) {
		const pixels: [number, number, number][] = Array.from({ length: n }, () => [0, 0, 0]);
		return {
			__neopixel: true,
			length: n,
			__getitem__: (i: number) => pixels[i],
			__setitem__: (i: number, val: unknown) => {
				if (Array.isArray(val) && val.length >= 3) pixels[i] = [Number(val[0]), Number(val[1]), Number(val[2])];
			},
			show: (() => {
				state.neopixels = pixels.map((p) => [...p] as [number, number, number]);
				return null;
			}) as NativeFn,
			fill: ((args) => {
				const val = args[0];
				if (Array.isArray(val) && val.length >= 3) {
					for (let i = 0; i < pixels.length; i++) pixels[i] = [Number(val[0]), Number(val[1]), Number(val[2])];
				}
				return null;
			}) as NativeFn
		};
	}

	const neopixelNs = {
		NeoPixel: ((args) => makeNeoPixel(Number(args[1]) || 1)) as NativeFn
	};

	const startTime = Date.now();

	const utimeNs = {
		ticks_ms: (() => Date.now() - startTime) as NativeFn,
		ticks_diff: ((args) => Number(args[0]) - Number(args[1])) as NativeFn
	};

	const globals: Record<string, unknown> = {
		...BUILTINS,
		display,
		Image: ImageCtor,
		music,
		radio,
		accelerometer,
		microphone,
		button_a,
		button_b,
		pin_logo,
		neopixel: neopixelNs,
		utime: utimeNs,
		pin0: { __pin: 'P0' },
		pin1: { __pin: 'P1' },
		pin2: { __pin: 'P2' },
		random: RANDOM_NS,
		temperature: (() => Math.round(inputs.temp)) as NativeFn,
		running_time: (() => Date.now() - startTime) as NativeFn,
		sleep: ((args) => new SleepRequest(Number(args[0]) || 0)) as NativeFn,
		print: ((args) => {
			pushLog('print', args.map(pyStr).join(' '));
			return null;
		}) as NativeFn
	};

	return { globals, state, pushLog };
}
