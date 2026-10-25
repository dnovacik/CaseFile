import { caseProgressSchema, type CaseDefinition, type CaseProgress } from './schema';
import { indexCase, unlockDeductions } from './state';

export type LoadResult =
  | { ok: true; progress: CaseProgress }
  | {
      ok: false;
      /** `content_version_mismatch` needs a migration; it must never be resolved by resetting. */
      code: 'invalid_save' | 'case_mismatch' | 'content_version_mismatch' | 'unknown_ids';
    };

export function serializeProgress(progress: CaseProgress): string {
  return JSON.stringify(progress);
}

/**
 * Parse saved progress for a case. Rejects saves for another case, another content version or
 * with IDs the definition doesn't know. Re-derives deductions so a save stays consistent with
 * the rules that produced it.
 */
export function loadProgress(def: CaseDefinition, saved: string | unknown): LoadResult {
  let raw: unknown = saved;
  if (typeof saved === 'string') {
    try {
      raw = JSON.parse(saved);
    } catch {
      return { ok: false, code: 'invalid_save' };
    }
  }
  const parsed = caseProgressSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, code: 'invalid_save' };
  const progress = parsed.data;
  if (progress.caseId !== def.id) return { ok: false, code: 'case_mismatch' };
  if (progress.contentVersion !== def.contentVersion) {
    return { ok: false, code: 'content_version_mismatch' };
  }

  const index = indexCase(def);
  const known =
    progress.inspectedEvidenceIds.every((id) => index.evidence.has(id)) &&
    progress.discoveredRelationshipIds.every((id) => index.relationships.has(id)) &&
    progress.unlockedDeductionIds.every((id) => index.deductions.has(id)) &&
    progress.completedActionIds.every((id) => index.actions.has(id));
  if (!known) return { ok: false, code: 'unknown_ids' };

  return { ok: true, progress: unlockDeductions(def, progress).progress };
}
