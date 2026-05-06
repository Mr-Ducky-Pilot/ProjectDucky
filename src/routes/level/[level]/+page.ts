import { error } from '@sveltejs/kit';
import { LEVELS } from '$lib/data/journey';
import { missionsForLevel } from '$lib/missions/registry';
import type { LevelId } from '$lib/missions/types';

export const prerender = false;

export function load({ params }: { params: { level: string } }) {
	const id = Number(params.level) as LevelId;
	const level = LEVELS.find((l) => l.id === id);
	if (!level) throw error(404, 'No such level');
	return {
		level,
		missions: missionsForLevel(id)
	};
}
