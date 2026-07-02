import type { PetSpecies } from '$lib/stores/pet';

/**
 * 5×5 pixel-art icons, one row of '0'/'1' per string, top row first.
 * Draft bitmaps — iterate visually (e.g. via LedMatrix.svelte in
 * /dev/components) before treating these as final art.
 *
 * Only species that actually read at 5×5 monochrome (brightness-only, no
 * colour channel) get an entry. Deliberately NOT included, with reasons:
 *   - panda: its defining feature is black/white colour contrast — lost
 *     entirely on a monochrome matrix, not a resolution problem.
 *   - dragon: needs wings + horns + tail + snout simultaneously legible —
 *     25 pixels isn't enough budget for that many features at once.
 *   - axolotl: signature external gill fronds don't survive to 5×5.
 *   - dog / fox: their floppy/pointy-ear silhouettes are too close to the
 *     cat sprite below to reliably read as a different species at this size.
 * Species without an entry fall back to FALLBACK_SPRITE.
 */
export const PET_SPRITES: Partial<Record<PetSpecies, string[]>> = {
	duck:    ['09900', '99990', '99999', '09990', '00000'], // matches ducky_os.py FACES['duck']
	cat:     ['90009', '99999', '90909', '99999', '90909'],
	bunny:   ['09090', '09090', '99999', '99999', '09990'],
	unicorn: ['00900', '09990', '99999', '99990', '09900'],
	owl:     ['09990', '99999', '90909', '99999', '09090'],
	robot:   ['99999', '90909', '99999', '09090', '09990']
};

/** Generic happy-face fallback for species without a dedicated sprite. */
export const FALLBACK_SPRITE = ['00000', '09090', '00000', '90009', '09990'];

export function spriteFor(species: PetSpecies): string[] {
	return PET_SPRITES[species] ?? FALLBACK_SPRITE;
}
