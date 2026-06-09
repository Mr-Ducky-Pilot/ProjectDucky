/**
 * Wire format spoken between the browser and the "Ducky OS" universal-listener
 * firmware running on the micro:bit. Plain ASCII, line-delimited, so it’s
 * trivial to debug with a serial monitor.
 *
 *   M:0110010110011010110011001\n      set 5×5 LED matrix bitmap (25 chars)
 *   T:C4,200;E4,200;G4,400\n            play tone sequence (note,ms;...)
 *   N:Ducky\n                           scroll this text on the matrix
 *   F:happy\n                           render a named face
 *   S?accel\n                           subscribe to a sensor stream
 *   S!accel\n                           unsubscribe
 *   P:welcome-jingle\n                  trigger a stored mini-program
 *   R:42\n                              radio: send number on channel
 *
 * The device pushes events the same way:
 *
 *   <S accel 0.12,0.04,0.99>\n         streaming sensor sample
 *   <B A down>\n                        button event
 *   <T logo>\n                          touch event
 *   <R 42>\n                            radio packet received
 */

export type Sensor =
	| 'accel'
	| 'mic'
	| 'light'
	| 'temp'
	| 'compass'
	| 'buttons'
	| 'logo-touch'
	| 'radio';

export type OutgoingCommand =
	| { type: 'matrix'; bits: boolean[] /* length 25 */ }
	| { type: 'scroll'; text: string }
	| { type: 'face'; name: 'happy' | 'sad' | 'wink' | 'wave' | 'sleep' }
	| { type: 'tone'; sequence: { note: string; ms: number }[] }
	| { type: 'subscribe'; sensor: Sensor }
	| { type: 'unsubscribe'; sensor: Sensor }
	| { type: 'preset'; name: string }
	| { type: 'light-threshold'; value: number }
	| { type: 'radio-send'; payload: number }
	| { type: 'oled-text'; lines: string[] /* 1–4 lines, joined by | on the wire */ }
	| { type: 'oled-clear' }
	| { type: 'oled-radar'; planeCount: number; blips: Array<{ dx: number; dy: number }> }
	| { type: 'quit' };

export type IncomingEvent =
	| { type: 'sensor'; sensor: Sensor; values: number[] }
	| { type: 'button'; button: 'A' | 'B'; phase: 'down' | 'up' }
	| { type: 'touch'; phase: 'down' | 'up' }
	| { type: 'radio'; payload: number }
	| { type: 'log'; text: string };

export function encode(cmd: OutgoingCommand): string {
	switch (cmd.type) {
		case 'matrix':
			return 'M:' + cmd.bits.map((b) => (b ? '1' : '0')).join('') + '\n';
		case 'scroll':
			return 'N:' + cmd.text.replace(/\n/g, ' ') + '\n';
		case 'face':
			return 'F:' + cmd.name + '\n';
		case 'tone':
			return 'T:' + cmd.sequence.map((n) => `${n.note},${n.ms}`).join(';') + '\n';
		case 'subscribe':
			return 'S?' + cmd.sensor + '\n';
		case 'unsubscribe':
			return 'S!' + cmd.sensor + '\n';
		case 'preset':
			return 'P:' + cmd.name + '\n';
		case 'light-threshold':
			return 'L:' + cmd.value + '\n';
		case 'radio-send':
			return 'R:' + cmd.payload + '\n';
		case 'oled-text':
			return 'O:' + cmd.lines.join('|') + '\n';
		case 'oled-clear':
			return 'O:clear\n';
		case 'oled-radar':
			return 'O:radar:' + cmd.planeCount + ';' + cmd.blips.map((b) => `${b.dx},${b.dy}`).join(';') + '\n';
		case 'quit':
			return 'Q\n';
	}
}

const EVENT_RE = /^<([A-Z])\s+(.+)>$/;

export function decode(line: string): IncomingEvent | null {
	const m = EVENT_RE.exec(line.trim());
	if (!m) return null;
	const [, kind, body] = m;
	switch (kind) {
		case 'S': {
			const [sensor, csv] = body.split(' ');
			return {
				type: 'sensor',
				sensor: sensor as Sensor,
				values: csv?.split(',').map(Number) ?? []
			};
		}
		case 'B': {
			const [button, phase] = body.split(' ');
			return { type: 'button', button: button as 'A' | 'B', phase: phase as 'down' | 'up' };
		}
		case 'T':
			return { type: 'touch', phase: body as 'down' | 'up' };
		case 'R':
			return { type: 'radio', payload: Number(body) };
		case 'L':
			return { type: 'log', text: body };
	}
	return null;
}
