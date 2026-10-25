import type {
  CaseDefinition,
  CaseProgress,
  Conclusion,
  Deduction,
  Evidence,
  Fact,
  FollowUpAction,
  Id,
  Relationship,
  Requirements,
} from './schema';

/** Order-insensitive key for a pair of fact IDs, so (a, b) and (b, a) match the same relationship. */
export function factPairKey(a: Id, b: Id): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export type CaseIndex = {
  evidence: Map<Id, Evidence>;
  facts: Map<Id, Fact>;
  relationships: Map<Id, Relationship>;
  relationshipsByPair: Map<string, Relationship>;
  deductions: Map<Id, Deduction>;
  actions: Map<Id, FollowUpAction>;
  conclusions: Map<Id, Conclusion>;
};

const indexCache = new WeakMap<CaseDefinition, CaseIndex>();

function byId<T extends { id: Id }>(items: T[]): Map<Id, T> {
  return new Map(items.map((item) => [item.id, item]));
}

/** Lookup tables for a case definition. Cached per definition object; definitions are treated as immutable. */
export function indexCase(def: CaseDefinition): CaseIndex {
  const cached = indexCache.get(def);
  if (cached) return cached;
  const index: CaseIndex = {
    evidence: byId(def.evidence),
    facts: byId(def.facts),
    relationships: byId(def.relationships),
    relationshipsByPair: new Map(def.relationships.map((r) => [factPairKey(...r.factIds), r])),
    deductions: byId(def.deductions),
    actions: byId(def.actions),
    conclusions: byId(def.conclusions),
  };
  indexCache.set(def, index);
  return index;
}

export function createProgress(def: CaseDefinition): CaseProgress {
  return {
    caseId: def.id,
    contentVersion: def.contentVersion,
    status: 'new',
    inspectedEvidenceIds: [],
    discoveredRelationshipIds: [],
    unlockedDeductionIds: [],
    completedActionIds: [],
    hintsUsed: 0,
    incorrectSubmissions: 0,
    elapsedSeconds: 0,
  };
}

/** Evidence the player can open: initial items plus anything revealed by a completed action. */
export function getAvailableEvidenceIds(def: CaseDefinition, progress: CaseProgress): Id[] {
  const revealed = new Set(
    def.actions
      .filter((a) => progress.completedActionIds.includes(a.id))
      .flatMap((a) => a.revealsEvidenceIds),
  );
  return def.evidence.filter((e) => e.initial || revealed.has(e.id)).map((e) => e.id);
}

export function isEvidenceAvailable(def: CaseDefinition, progress: CaseProgress, id: Id): boolean {
  return getAvailableEvidenceIds(def, progress).includes(id);
}

/** A fact is usable once the evidence it comes from has been inspected. */
export function isFactVisible(def: CaseDefinition, progress: CaseProgress, factId: Id): boolean {
  const fact = indexCase(def).facts.get(factId);
  return fact !== undefined && progress.inspectedEvidenceIds.includes(fact.evidenceId);
}

export function getVisibleFactIds(def: CaseDefinition, progress: CaseProgress): Id[] {
  return def.facts
    .filter((f) => progress.inspectedEvidenceIds.includes(f.evidenceId))
    .map((f) => f.id);
}

export function requirementsMet(
  def: CaseDefinition,
  progress: CaseProgress,
  requires: Requirements | undefined,
): boolean {
  if (!requires) return true;
  const all = (ids: Id[] | undefined, held: (id: Id) => boolean) => (ids ?? []).every(held);
  return (
    all(requires.relationshipIds, (id) => progress.discoveredRelationshipIds.includes(id)) &&
    all(requires.deductionIds, (id) => progress.unlockedDeductionIds.includes(id)) &&
    all(requires.actionIds, (id) => progress.completedActionIds.includes(id)) &&
    all(requires.factIds, (id) => isFactVisible(def, progress, id))
  );
}

/** Follow-up actions whose requirements are met and that have not been performed yet. */
export function getAvailableActionIds(def: CaseDefinition, progress: CaseProgress): Id[] {
  return def.actions
    .filter((a) => !progress.completedActionIds.includes(a.id))
    .filter((a) => requirementsMet(def, progress, a.requires))
    .map((a) => a.id);
}

/**
 * Unlock every deduction whose requirements hold, repeating until nothing changes, since one
 * deduction can satisfy another. Deductions are visited in authored order, so the result is
 * deterministic. Returns the updated progress and the IDs unlocked by this pass.
 */
export function unlockDeductions(
  def: CaseDefinition,
  progress: CaseProgress,
): { progress: CaseProgress; unlocked: Id[] } {
  let current = progress;
  const unlocked: Id[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (const deduction of def.deductions) {
      if (current.unlockedDeductionIds.includes(deduction.id)) continue;
      if (!requirementsMet(def, current, deduction.requires)) continue;
      current = {
        ...current,
        unlockedDeductionIds: [...current.unlockedDeductionIds, deduction.id],
      };
      unlocked.push(deduction.id);
      changed = true;
    }
  }
  return { progress: current, unlocked };
}
