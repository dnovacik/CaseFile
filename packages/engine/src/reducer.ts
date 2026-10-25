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

/** The result type each command returns. */
export type CommandResultMap = {
  inspectEvidence: InspectResult;
  linkFacts: LinkResult;
  performAction: ActionResult;
  requestHint: HintResult;
  submitReport: ReportResult;
};

export type CommandResult = CommandResultMap[Command['type']];

/** Single entry point for UI stores: dispatch a command, get the next progress and its result. */
export function applyCommand<C extends Command>(
  def: CaseDefinition,
  progress: CaseProgress,
  command: C,
): Outcome<CommandResultMap[C['type']]> {
  return run(def, progress, command) as Outcome<CommandResultMap[C['type']]>;
}

// TypeScript can't narrow a generic switch, so the typed wrapper above delegates to this.
function run(
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
