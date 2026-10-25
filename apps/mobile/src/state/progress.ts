import {
  applyCommand,
  createProgress,
  type CaseDefinition,
  type CaseProgress,
  type Command,
  type CommandResult,
  type Id,
} from '@casefile/engine';
import { create } from 'zustand';

/**
 * In-memory progress per case. Durable SQLite saves arrive with the storage milestone; until
 * then progress lives for the app session only.
 */
type ProgressState = {
  byCase: Record<string, CaseProgress>;
  /** Facts the player has picked for comparison, per case. Transient UI state, never saved. */
  selectedFacts: Record<string, Id[]>;
  setProgress: (progress: CaseProgress) => void;
  toggleFact: (caseId: string, factId: Id) => void;
  clearSelection: (caseId: string) => void;
};

/** The compare sheet works on exactly two facts. */
export const MAX_SELECTED_FACTS = 2;

export const useProgressStore = create<ProgressState>((set) => ({
  byCase: {},
  selectedFacts: {},
  setProgress: (progress) =>
    set((state) => ({ byCase: { ...state.byCase, [progress.caseId]: progress } })),
  toggleFact: (caseId, factId) =>
    set((state) => {
      const current = state.selectedFacts[caseId] ?? [];
      const next = current.includes(factId)
        ? current.filter((id) => id !== factId)
        : // Picking a third fact replaces the older of the two.
          [...current, factId].slice(-MAX_SELECTED_FACTS);
      return { selectedFacts: { ...state.selectedFacts, [caseId]: next } };
    }),
  clearSelection: (caseId) =>
    set((state) => ({ selectedFacts: { ...state.selectedFacts, [caseId]: [] } })),
}));

/** Progress for a case, or a fresh one if the player hasn't started it. */
export function useCaseProgress(def: CaseDefinition): CaseProgress {
  const saved = useProgressStore((state) => state.byCase[def.id]);
  return saved ?? createProgress(def);
}

const noSelection: Id[] = [];

export function useSelectedFacts(caseId: string): Id[] {
  return useProgressStore((state) => state.selectedFacts[caseId] ?? noSelection);
}

/**
 * Run an engine command against the case's current progress and store the result. The engine
 * decides everything; the UI only renders the returned result code.
 */
export function dispatch(def: CaseDefinition, command: Command): CommandResult {
  const { byCase, setProgress } = useProgressStore.getState();
  const outcome = applyCommand(def, byCase[def.id] ?? createProgress(def), command);
  setProgress(outcome.progress);
  return outcome.result;
}
