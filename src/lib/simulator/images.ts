// Bitmap table for the `Image.*` constants used across the L5 sandbox
// templates (confirmed via grep — see design doc), plus a few common
// extras with cheap headroom for kid edits. Approximations, not
// pixel-exact reproductions of the real microbit Image class.

function grid(rows: string): boolean[] {
	return rows
		.replace(/\s+/g, '')
		.split('')
		.map((c) => c !== '0');
}

export const IMAGE_CONSTANTS: Record<string, boolean[]> = {
	HAPPY: grid('00000 09090 00000 90009 09990'),
	SAD: grid('00000 09090 00000 09990 90009'),
	HEART: grid('09090 99999 99999 09990 00900'),
	YES: grid('00000 00009 00090 90900 09000'),
	NO: grid('90009 09090 00900 09090 90009'),
	SURPRISED: grid('09090 00000 00900 09990 90009'),
	ASLEEP: grid('00000 99099 00000 09990 00000'),
	ARROW_E: grid('00900 00090 99999 00090 00900'),
	ARROW_N: grid('00900 09990 90909 00900 00900'),
	ARROW_S: grid('00900 00900 90909 09990 00900'),
	ARROW_W: grid('00900 09000 99999 09000 00900'),
	ALL_LEDS: grid('99999 99999 99999 99999 99999'),
	MUSIC_QUAVER: grid('00099 00090 00090 99090 99990'),
	SMALL_HEART: grid('00000 09090 09990 00900 00000'),
	SILLY: grid('90009 00000 99999 00000 09990'),
	CONFUSED: grid('00000 09090 00000 09090 90909'),
	ANGRY: grid('90009 09090 00000 99999 90909'),
	FABULOUS: grid('99999 99099 00000 09990 09090'),
	MEH: grid('00000 09090 00000 00000 09999'),
	SKULL: grid('09990 90909 99999 09990 09990')
};

/** Parses the `"99099:99099:00000:90009:09990"` grid-string form of `Image(...)`. */
export function imageFromGridString(s: string): boolean[] {
	const rows = s.split(':');
	const bits = new Array(25).fill(false);
	for (let r = 0; r < 5 && r < rows.length; r++) {
		const row = rows[r];
		for (let c = 0; c < 5 && c < row.length; c++) {
			bits[r * 5 + c] = row[c] !== '0';
		}
	}
	return bits;
}
