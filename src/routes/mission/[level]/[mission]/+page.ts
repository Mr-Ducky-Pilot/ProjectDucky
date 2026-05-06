import { error } from '@sveltejs/kit';
import { getMission } from '$lib/missions/registry';
import type { LevelId } from '$lib/missions/types';

export const prerender = false;
export const ssr = false; // Interactive components touch browser-only APIs.

export function load({ params }: { params: { level: string; mission: string } }) {
	const level = Number(params.level) as LevelId;
	const mission = getMission(level, params.mission);
	if (!mission) throw error(404, 'No such mission');
	return { mission };
}
