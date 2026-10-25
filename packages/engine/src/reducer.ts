import {
  inspectEvidence,
  linkFacts,
  performAction,
  submitReport,
  requestHint,
  type ActionResult,
  type HintResult,
  type HintStage,
  type InspectResult,
  type LinkResult,
  type Outcome,
  type ReportResult,
} from './commands';
import type { CaseDefinition, CaseProgress, Id, RelationType } from './schema';

export type Command =
  | { type: 'inspectEvidence'; evidenceId: Id }
  | { type: 'linkFacts'; factIds: [Id, Id]; relation: RelationType }
  | { type: 'performAction'; actionId: Id }
  | { type: 'requestHint'; stage: HintStage }
  | { type: 'submitReport'; answers: Record<Id, Id>; proofIds: Id[] };

export type CommandResult = InspectResult | LinkResult | ActionResult | HintResult | ReportResult;

/** Single entry point for UI stores: dispatch a command, get the next progress and its result. */
export function applyCommand(
  def: CaseDefinition,
  progress: CaseProgress,
  command: Command,
): Outcome<CommandResult> {
  switch (command.type) {
    case 'inspectEvidence':
      return inspectEvidence(def, progress, command.evidenceId);
    case 'linkFacts':
      return linkFacts(def, progress, command.factIds[0], command.factIds[1], command.relation);
    case 'performAction':
      return performAction(def, progress, command.actionId);
    case 'requestHint':
      return requestHint(def, progress, command.stage);
    case 'submitReport':
      return submitReport(def, progress, command.answers, command.proofIds);
  }
}
