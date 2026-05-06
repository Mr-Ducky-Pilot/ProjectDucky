import { error } from '@sveltejs/kit';
import { getMission, ALL_MISSIONS } from '$lib/missions/registry';
import type { LevelId } from '$lib/missions/types';

export const prerender = false;
export const ssr = false;

export function load({ params }: { params: { level: string; mission: string } }) {
	const level = Number(params.level) as LevelId;
	const mission = getMission(level, params.mission);
	if (!mission) throw error(404, 'No such mission');

	const idx = ALL_MISSIONS.findIndex((m) => m.level === mission.level && m.id === mission.id);
	const nextMission = idx >= 0 && idx < ALL_MISSIONS.length - 1 ? ALL_MISSIONS[idx + 1] : null;
	const prevMission = idx > 0 ? ALL_MISSIONS[idx - 1] : null;

	return { mission, nextMission, prevMission };
}
