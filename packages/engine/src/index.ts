export * from './schema';
export {
  createProgress,
  factPairKey,
  getAvailableActionIds,
  getAvailableEvidenceIds,
  getVisibleFactIds,
  isEvidenceAvailable,
  isFactVisible,
  requirementsMet,
} from './state';
export {
  addElapsedTime,
  getHintTarget,
  inspectEvidence,
  linkFacts,
  performAction,
  resetCase,
  submitReport,
  requestHint,
  type ActionResult,
  type HintResult,
  type HintStage,
  type InspectResult,
  type LinkResult,
  type Outcome,
  type ReportResult,
  type ResultCode,
} from './commands';
export { applyCommand, type Command, type CommandResult } from './reducer';
export { loadProgress, serializeProgress, type LoadResult } from './save';
export { solveCase, type Solution, type SolverStep } from './solver';
export {
  checkCase,
  validateCase,
  type CheckResult,
  type ValidationIssue,
  type ValidationOptions,
} from './validate';
