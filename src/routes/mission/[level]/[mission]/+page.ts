import { error } from '@sveltejs/kit';
import { getMission, ALL_MISSIONS } from '$lib/missions/registry';
import { TUTORIAL_STOPS, tutorialIndexOf } from '$lib/data/tutorial';
import type { LevelId } from '$lib/missions/types';

export const prerender = false;
export const ssr = false;

export function load({ params, url }: { params: { level: string; mission: string }; url: URL }) {
	const level = Number(params.level) as LevelId;
	const mission = getMission(level, params.mission);
	if (!mission) throw error(404, 'No such mission');

	// `?tutorial=1` threads the guided 10-stop tour order through next/prev
	// navigation instead of the level-sequential order — see /tutorial.
	if (url.searchParams.get('tutorial') === '1') {
		const tIdx = tutorialIndexOf(mission.level, mission.id);
		if (tIdx >= 0) {
			const nextStop = TUTORIAL_STOPS[tIdx + 1];
			const prevStop = TUTORIAL_STOPS[tIdx - 1];
			return {
				mission,
				nextMission: nextStop ? (getMission(nextStop.level, nextStop.id) ?? null) : null,
				prevMission: prevStop ? (getMission(prevStop.level, prevStop.id) ?? null) : null,
				tutorial: { index: tIdx, total: TUTORIAL_STOPS.length }
			};
		}
	}

	const idx = ALL_MISSIONS.findIndex((m) => m.level === mission.level && m.id === mission.id);
	const nextMission = idx >= 0 && idx < ALL_MISSIONS.length - 1 ? ALL_MISSIONS[idx + 1] : null;
	const prevMission = idx > 0 ? ALL_MISSIONS[idx - 1] : null;

	return { mission, nextMission, prevMission, tutorial: null };
}
