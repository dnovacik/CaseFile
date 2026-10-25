import { inspectEvidence, linkFacts, performAction, submitReport } from './commands';
import type { CaseDefinition, CaseProgress, Id } from './schema';
import { createProgress, getAvailableActionIds, getAvailableEvidenceIds } from './state';

export type SolverStep =
  | { kind: 'inspect'; evidenceId: Id }
  | { kind: 'link'; relationshipId: Id }
  | { kind: 'action'; actionId: Id }
  | { kind: 'report'; answers: Record<Id, Id>; proofIds: Id[] };

export type Solution = {
  solved: boolean;
  steps: SolverStep[];
  progress: CaseProgress;
  unreachableEvidenceIds: Id[];
  unreachableRelationshipIds: Id[];
  unreachableDeductionIds: Id[];
  unprovableConclusionIds: Id[];
};

/**
 * Deterministic full-path solver: plays the case as an all-knowing player using the real engine
 * commands, repeating until no command makes progress, then submits the authored answers.
 * This proves structural reachability only; whether the reasoning is fair is a human review.
 */
export function solveCase(def: CaseDefinition): Solution {
  let progress = createProgress(def);
  const steps: SolverStep[] = [];
  let changed = true;

  while (changed) {
    changed = false;
    for (const evidenceId of getAvailableEvidenceIds(def, progress)) {
      const outcome = inspectEvidence(def, progress, evidenceId);
      if (outcome.result.code === 'valid') {
        progress = outcome.progress;
        steps.push({ kind: 'inspect', evidenceId });
        changed = true;
      }
    }
    for (const rel of def.relationships) {
      const outcome = linkFacts(def, progress, rel.factIds[0], rel.factIds[1], rel.type);
      if (outcome.result.code === 'valid') {
        progress = outcome.progress;
        steps.push({ kind: 'link', relationshipId: rel.id });
        changed = true;
      }
    }
    for (const actionId of getAvailableActionIds(def, progress)) {
      const outcome = performAction(def, progress, actionId);
      if (outcome.result.code === 'valid') {
        progress = outcome.progress;
        steps.push({ kind: 'action', actionId });
        changed = true;
      }
    }
  }

  const available = new Set(getAvailableEvidenceIds(def, progress));
  const held = (id: Id) =>
    progress.inspectedEvidenceIds.includes(id) || progress.unlockedDeductionIds.includes(id);

  const answers: Record<Id, Id> = {};
  const proofIds = new Set<Id>();
  const unprovableConclusionIds: Id[] = [];
  for (const conclusion of def.conclusions) {
    answers[conclusion.id] = conclusion.correctChoiceId;
    const proof = conclusion.acceptedProofSets.find((set) => set.every(held));
    if (proof) proof.forEach((id) => proofIds.add(id));
    else unprovableConclusionIds.push(conclusion.id);
  }

  let solved = false;
  if (unprovableConclusionIds.length === 0) {
    const report = submitReport(def, progress, answers, [...proofIds]);
    if (report.result.code === 'valid') {
      progress = report.progress;
      steps.push({ kind: 'report', answers, proofIds: [...proofIds] });
      solved = true;
    }
  }

  return {
    solved,
    steps,
    progress,
    unreachableEvidenceIds: def.evidence.filter((e) => !available.has(e.id)).map((e) => e.id),
    unreachableRelationshipIds: def.relationships
      .filter((r) => !progress.discoveredRelationshipIds.includes(r.id))
      .map((r) => r.id),
    unreachableDeductionIds: def.deductions
      .filter((d) => !progress.unlockedDeductionIds.includes(d.id))
      .map((d) => d.id),
    unprovableConclusionIds,
  };
}
