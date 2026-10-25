import type { CaseProgress } from '@casefile/engine';

/**
 * Case rating rewards independent reasoning, never speed (docs/GDD.md): three stars with no hints
 * and no wrong reports, two with at most two of either combined, otherwise one.
 */
export function caseRating(progress: CaseProgress): 1 | 2 | 3 {
  const assists = progress.hintsUsed + progress.incorrectSubmissions;
  if (assists === 0) return 3;
  if (assists <= 2) return 2;
  return 1;
}
