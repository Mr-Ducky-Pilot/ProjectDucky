import type { Component } from 'svelte';
import type { LevelId, Mission, MissionMeta } from './types';

/**
 * Auto-discover missions from the filesystem. Adding a mission =
 *   src/lib/levels/<level>/missions/<id>/{mission.meta.ts, concept.md, Interactive.svelte?}
 * No manual registration needed.
 */

const metaModules = import.meta.glob<{ default: MissionMeta }>(
	'/src/lib/levels/*/missions/*/mission.meta.ts',
	{ eager: true }
);

const conceptModules = import.meta.glob<string>(
	'/src/lib/levels/*/missions/*/concept.md',
	{ eager: true, query: '?raw', import: 'default' }
);

const codeModules = import.meta.glob<string>(
	'/src/lib/levels/*/missions/*/code.md',
	{ eager: true, query: '?raw', import: 'default' }
);

// Lazy: returns a loader so Interactive components are split into their own chunk.
const interactiveModules = import.meta.glob<{ default: Component }>(
	'/src/lib/levels/*/missions/*/Interactive.svelte'
);

function dirOf(path: string) {
	return path.slice(0, path.lastIndexOf('/'));
}

const MISSIONS: Mission[] = Object.entries(metaModules)
	.map(([metaPath, mod]) => {
		const dir = dirOf(metaPath);
		const conceptPath = `${dir}/concept.md`;
		const codePath = `${dir}/code.md`;
		const interactivePath = `${dir}/Interactive.svelte`;
		return {
			...mod.default,
			conceptMarkdown: conceptModules[conceptPath] ?? '',
			codeMarkdown: codeModules[codePath],
			interactive: interactiveModules[interactivePath]
		};
	})
	.sort((a, b) => (a.level - b.level) * 100 + (a.order - b.order));

export const ALL_MISSIONS: readonly Mission[] = MISSIONS;

export function missionsForLevel(level: LevelId): Mission[] {
	return MISSIONS.filter((m) => m.level === level);
}

export function getMission(level: LevelId, missionId: string): Mission | undefined {
	return MISSIONS.find((m) => m.level === level && m.id === missionId);
}
