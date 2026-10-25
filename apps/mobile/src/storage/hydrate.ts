import { loadProgress, type CaseDefinition, type CaseProgress } from '@casefile/engine';

import type { SaveRow } from './types';

export type Hydration = {
  /** Saves that loaded cleanly, ready for the progress store. */
  progress: CaseProgress[];
  /** Saves that couldn't be loaded; they are archived, never discarded. */
  archive: { row: SaveRow; reason: string }[];
};

/**
 * Decide what to do with every stored save. Loadable saves go to the store. A save for a different
 * content version, or one the engine rejects, is archived so a later migration can recover it and
 * the case starts fresh. Saves for cases that aren't bundled are left untouched, since removing
 * a case from the build must not delete the player's progress.
 */
export function hydrate(definitions: CaseDefinition[], rows: SaveRow[]): Hydration {
  const result: Hydration = { progress: [], archive: [] };
  for (const row of rows) {
    const def = definitions.find((d) => d.id === row.caseId);
    if (!def) continue;
    const loaded = loadProgress(def, row.data);
    if (loaded.ok) result.progress.push(loaded.progress);
    else result.archive.push({ row, reason: loaded.code });
  }
  return result;
}
