import {
  createProgress,
  getAvailableActionIds,
  getAvailableEvidenceIds,
  inspectEvidence,
  linkFacts,
  solveCase,
  submitReport,
  type CaseProgress,
} from '@casefile/engine';
import { describe, expect, it } from 'vitest';

import { getCase } from '../index';

const content = getCase('case_003')!;
const def = content.definition;
const answers = { C01: 'service_lift', C02: 'theo' };

function investigated(): CaseProgress {
  const { progress } = solveCase(def);
  return { ...progress, status: 'active' };
}

describe('Case 003 — The Empty Room', () => {
  it('narrows the exit and the helper before the contractor records, from initial evidence only', () => {
    let progress = createProgress(def);
    for (const id of getAvailableEvidenceIds(def, progress)) {
      progress = inspectEvidence(def, progress, id).progress;
    }
    for (const rel of def.relationships.filter((r) =>
      ['R01', 'R02', 'R03', 'R04', 'R05'].includes(r.id),
    )) {
      const outcome = linkFacts(def, progress, rel.factIds[0], rel.factIds[1], rel.type);
      expect(outcome.result.code, rel.id).toBe('valid');
      progress = outcome.progress;
    }
    expect(getAvailableActionIds(def, progress)).toEqual(['A01']);
  });

  it('reveals both contractor records with one action', () => {
    expect(def.actions.find((a) => a.id === 'A01')!.revealsEvidenceIds).toEqual(['E12', 'E13']);
  });

  it('does not accept the lift log and dock stills alone as proof of who', () => {
    const ready = investigated();
    expect(submitReport(def, ready, answers, ['E08', 'E09', 'E12', 'E13']).result.code).toBe(
      'not_established',
    );
    for (const proof of [
      ['E08', 'E09', 'E10', 'E12', 'E13'],
      ['E04', 'E08', 'E09', 'E10', 'E13'],
    ]) {
      expect(submitReport(def, ready, answers, proof).result.code, proof.join()).toBe('valid');
    }
  });

  it('treats the Meridian Trust slip as a red herring', () => {
    const ready = investigated();
    expect(def.relationships.some((r) => r.factIds.includes('F11A'))).toBe(false);
    expect(
      submitReport(def, ready, answers, ['E08', 'E09', 'E10', 'E11', 'E12', 'E13']).result.code,
    ).toBe('not_established');
  });

  it('never shows a face in the dock stills, and never names the helper from a key alone', () => {
    const en = content.strings.en;
    expect(en['c003.f13c']).toMatch(/face/);
    expect(en['c003.d05.description']).toMatch(/not whose hand/);
  });
});
