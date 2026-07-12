import type { LevelId } from '$lib/missions/types';

export type TutorialStop = { level: LevelId; id: string };

/**
 * A hand-picked 10-stop tour across all 6 levels: single-board, no
 * pairing required, chosen for immediate interactivity (touch, sound,
 * motion, light) so a first-time visitor gets a fast, varied taste of
 * what Ducky can do before committing to the full curriculum. Ends on
 * the L5 sandbox to show off the code-preview simulator.
 */
export const TUTORIAL_STOPS: TutorialStop[] = [
	{ level: 0, id: '01-ducky-says-hi' },
	{ level: 0, id: '04-shake-to-wake' },
	{ level: 0, id: '08-touch-logo' },
	{ level: 0, id: '09-compass-quest' },
	{ level: 1, id: '13-welcome-jingle' },
	{ level: 1, id: '17-dice-roller' },
	{ level: 2, id: '24-button-race' },
	{ level: 2, id: '35-magic-8-ball' },
	{ level: 4, id: '41-pet-greeting-routine' },
	{ level: 5, id: '52-mini-arcade' }
];

export function tutorialIndexOf(level: LevelId, id: string): number {
	return TUTORIAL_STOPS.findIndex((s) => s.level === level && s.id === id);
}

export function tutorialKey(stop: TutorialStop): string {
	return `${stop.level}/${stop.id}`;
}
