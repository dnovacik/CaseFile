import { createProgress, type CaseDefinition, type CaseProgress } from '@casefile/engine';
import { create } from 'zustand';

/**
 * In-memory progress per case. Durable SQLite saves arrive with the storage milestone; until
 * then progress lives for the app session only.
 */
type ProgressState = {
  byCase: Record<string, CaseProgress>;
  setProgress: (progress: CaseProgress) => void;
};

export const useProgressStore = create<ProgressState>((set) => ({
  byCase: {},
  setProgress: (progress) =>
    set((state) => ({ byCase: { ...state.byCase, [progress.caseId]: progress } })),
}));

/** Progress for a case, or a fresh one if the player hasn't started it. */
export function useCaseProgress(def: CaseDefinition): CaseProgress {
  const saved = useProgressStore((state) => state.byCase[def.id]);
  return saved ?? createProgress(def);
}
