import type { CaseDefinition, CaseProgress, Id, RelationType } from './schema';
import {
  createProgress,
  factPairKey,
  indexCase,
  isEvidenceAvailable,
  isFactVisible,
  requirementsMet,
  unlockDeductions,
} from './state';

/**
 * Player-facing result codes. Results never include hidden solution data: a rejected link or
 * report says only that it was not established, not what the right answer would be.
 */
export type ResultCode =
  | 'valid'
  | 'not_established'
  | 'not_available'
  | 'already_discovered'
  | 'requires_more_investigation'
  | 'invalid_input';

export type Outcome<R extends { code: ResultCode }> = { progress: CaseProgress; result: R };

type Rejection = { code: Exclude<ResultCode, 'valid'> };

function reject(progress: CaseProgress, code: Rejection['code']): Outcome<Rejection> {
  return { progress, result: { code } };
}

function activate(progress: CaseProgress): CaseProgress {
  return progress.status === 'new' ? { ...progress, status: 'active' } : progress;
}

function addUnique(ids: Id[], ...added: Id[]): Id[] {
  return [...ids, ...added.filter((id) => !ids.includes(id))];
}

export type InspectResult = { code: 'valid'; unlockedDeductionIds: Id[] } | Rejection;

export function inspectEvidence(
  def: CaseDefinition,
  progress: CaseProgress,
  evidenceId: Id,
): Outcome<InspectResult> {
  if (!isEvidenceAvailable(def, progress, evidenceId)) return reject(progress, 'not_available');
  if (progress.inspectedEvidenceIds.includes(evidenceId)) {
    return reject(progress, 'already_discovered');
  }
  const inspected = activate({
    ...progress,
    inspectedEvidenceIds: [...progress.inspectedEvidenceIds, evidenceId],
  });
  const { progress: next, unlocked } = unlockDeductions(def, inspected);
  return { progress: next, result: { code: 'valid', unlockedDeductionIds: unlocked } };
}

export type LinkResult =
  { code: 'valid'; relationshipId: Id; unlockedDeductionIds: Id[] } | Rejection;

/**
 * Compare two inspected facts under a relation type. Order-insensitive. A wrong type, an
 * unrelated pair and a pair whose prerequisites are not met all return `not_established`, so the
 * response never reveals which part was wrong.
 */
export function linkFacts(
  def: CaseDefinition,
  progress: CaseProgress,
  factA: Id,
  factB: Id,
  type: RelationType,
): Outcome<LinkResult> {
  if (factA === factB) return reject(progress, 'invalid_input');
  if (!isFactVisible(def, progress, factA) || !isFactVisible(def, progress, factB)) {
    return reject(progress, 'not_available');
  }
  const relationship = indexCase(def).relationshipsByPair.get(factPairKey(factA, factB));
  if (!relationship || relationship.type !== type) return reject(progress, 'not_established');
  if (progress.discoveredRelationshipIds.includes(relationship.id)) {
    return reject(progress, 'already_discovered');
  }
  if (!requirementsMet(def, progress, relationship.requires)) {
    return reject(progress, 'not_established');
  }
  const { progress: next, unlocked } = unlockDeductions(def, {
    ...activate(progress),
    discoveredRelationshipIds: [...progress.discoveredRelationshipIds, relationship.id],
  });
  return {
    progress: next,
    result: { code: 'valid', relationshipId: relationship.id, unlockedDeductionIds: unlocked },
  };
}

export type ActionResult =
  { code: 'valid'; revealedEvidenceIds: Id[]; unlockedDeductionIds: Id[] } | Rejection;

/** Perform a justified follow-up action. Revealed evidence becomes available but is not inspected. */
export function performAction(
  def: CaseDefinition,
  progress: CaseProgress,
  actionId: Id,
): Outcome<ActionResult> {
  const action = indexCase(def).actions.get(actionId);
  if (!action) return reject(progress, 'not_available');
  if (progress.completedActionIds.includes(actionId)) {
    return reject(progress, 'already_discovered');
  }
  if (!requirementsMet(def, progress, action.requires)) {
    return reject(progress, 'requires_more_investigation');
  }
  const { progress: next, unlocked } = unlockDeductions(def, {
    ...activate(progress),
    completedActionIds: [...progress.completedActionIds, actionId],
  });
  return {
    progress: next,
    result: {
      code: 'valid',
      revealedEvidenceIds: action.revealsEvidenceIds,
      unlockedDeductionIds: unlocked,
    },
  };
}

export type HintStage = 1 | 2 | 3;

export type HintResult =
  | { code: 'valid'; stage: 1; nudgeKey: string }
  | { code: 'valid'; stage: 2; factIds: [Id, Id] }
  | { code: 'valid'; stage: 3; relationshipId: Id; unlockedDeductionIds: Id[] }
  | Rejection;

/**
 * The relationship a hint should point at: the first authored hint whose relationship is not yet
 * discovered, whose prerequisites are met and whose facts come from evidence the player can open.
 */
export function getHintTarget(def: CaseDefinition, progress: CaseProgress): Id | undefined {
  const index = indexCase(def);
  return (def.hints ?? []).find((hint) => {
    const relationship = index.relationships.get(hint.relationshipId);
    if (!relationship || progress.discoveredRelationshipIds.includes(relationship.id)) return false;
    if (!requirementsMet(def, progress, relationship.requires)) return false;
    return relationship.factIds.every((factId) => {
      const fact = index.facts.get(factId);
      return fact !== undefined && isEvidenceAvailable(def, progress, fact.evidenceId);
    });
  })?.relationshipId;
}

/**
 * Three hint stages for the current target: 1 returns the authored nudge, 2 names the two facts
 * to compare, 3 establishes the relationship outright (inspecting its evidence if needed).
 */
export function requestHint(
  def: CaseDefinition,
  progress: CaseProgress,
  stage: HintStage,
): Outcome<HintResult> {
  const targetId = getHintTarget(def, progress);
  if (targetId === undefined) return reject(progress, 'not_available');
  const index = indexCase(def);
  const relationship = index.relationships.get(targetId)!;
  const counted = { ...activate(progress), hintsUsed: progress.hintsUsed + 1 };

  if (stage === 1) {
    const hint = def.hints!.find((h) => h.relationshipId === targetId)!;
    return { progress: counted, result: { code: 'valid', stage, nudgeKey: hint.nudgeKey } };
  }
  if (stage === 2) {
    return { progress: counted, result: { code: 'valid', stage, factIds: relationship.factIds } };
  }
  const evidenceIds = relationship.factIds.map((factId) => index.facts.get(factId)!.evidenceId);
  const { progress: next, unlocked } = unlockDeductions(def, {
    ...counted,
    inspectedEvidenceIds: addUnique(counted.inspectedEvidenceIds, ...evidenceIds),
    discoveredRelationshipIds: [...counted.discoveredRelationshipIds, targetId],
  });
  return {
    progress: next,
    result: { code: 'valid', stage, relationshipId: targetId, unlockedDeductionIds: unlocked },
  };
}

export type ReportResult = { code: 'valid' } | Rejection;

/**
 * Submit the final report: one choice per conclusion plus a shared set of selected proofs
 * (inspected evidence and unlocked deduction IDs).
 *
 * The report is accepted when every answer is correct, each conclusion has at least one accepted
 * proof set fully contained in the selection, and nothing irrelevant is selected (every selected
 * ID belongs to an accepted proof set or a conclusion's supporting proof). The last rule stops
 * "select everything" from passing.
 * A rejected report counts as an incorrect submission and keeps all other progress.
 */
export function submitReport(
  def: CaseDefinition,
  progress: CaseProgress,
  answers: Record<Id, Id>,
  selectedProofIds: Id[],
): Outcome<ReportResult> {
  if (progress.status === 'solved') return reject(progress, 'already_discovered');

  const mandatory = def.deductions.filter((d) => d.mandatory).map((d) => d.id);
  const required = [...mandatory, ...def.conclusions.flatMap((c) => c.requiresDeductionIds)];
  if (!required.every((id) => progress.unlockedDeductionIds.includes(id))) {
    return reject(progress, 'requires_more_investigation');
  }

  const index = indexCase(def);
  const answersComplete = def.conclusions.every((c) =>
    c.choices.some((choice) => choice.id === answers[c.id]),
  );
  if (!answersComplete || Object.keys(answers).some((id) => !index.conclusions.has(id))) {
    return reject(progress, 'invalid_input');
  }
  const proofHeld = (id: Id) =>
    progress.inspectedEvidenceIds.includes(id) || progress.unlockedDeductionIds.includes(id);
  if (!selectedProofIds.every(proofHeld)) return reject(progress, 'not_available');

  const selected = new Set(selectedProofIds);
  const relevant = new Set(
    def.conclusions.flatMap((c) => [
      ...c.acceptedProofSets.flat(),
      ...(c.supportingProofIds ?? []),
    ]),
  );
  const correct =
    def.conclusions.every(
      (c) =>
        answers[c.id] === c.correctChoiceId &&
        c.acceptedProofSets.some((set) => set.every((id) => selected.has(id))),
    ) && selectedProofIds.every((id) => relevant.has(id));

  if (!correct) {
    return {
      progress: { ...activate(progress), incorrectSubmissions: progress.incorrectSubmissions + 1 },
      result: { code: 'not_established' },
    };
  }
  return { progress: { ...progress, status: 'solved' }, result: { code: 'valid' } };
}

/** Deliberately clear all progress for a case. */
export function resetCase(def: CaseDefinition): CaseProgress {
  return createProgress(def);
}

export function addElapsedTime(progress: CaseProgress, seconds: number): CaseProgress {
  if (seconds <= 0 || progress.status === 'solved') return progress;
  return { ...progress, elapsedSeconds: progress.elapsedSeconds + seconds };
}
