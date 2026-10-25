import { solveCase, submitReport, type CaseProgress } from '@casefile/engine';
import { describe, expect, it } from 'vitest';

import { getCase } from '../index';

const def = getCase('case_002')!.definition;
const answers = { C01: 'mara', C02: 'quarantine' };

function investigated(): CaseProgress {
  const { progress } = solveCase(def);
  return { ...progress, status: 'active' };
}

describe('Case 002 — Last Delivery', () => {
  it('identifies Mara before the hidden evidence, from access and the rota', () => {
    // D04 (only Mara could use the back room) must not depend on the search.
    const d04 = def.deductions.find((d) => d.id === 'D04')!;
    expect(d04.requires.actionIds ?? []).toEqual([]);
    const a01 = def.actions.find((a) => a.id === 'A01')!;
    expect(a01.requires.deductionIds).toContain('D04');
  });

  it('does not accept the recovered parcel alone as proof of who', () => {
    const ready = investigated();
    expect(submitReport(def, ready, answers, ['E05', 'E06', 'E09']).result.code).toBe(
      'not_established',
    );
    expect(submitReport(def, ready, answers, ['E05', 'E06', 'E07', 'E09', 'E10']).result.code).toBe(
      'valid',
    );
  });

  it('treats the café receipt as a red herring', () => {
    const ready = investigated();
    expect(def.relationships.some((r) => r.factIds.includes('F08A'))).toBe(false);
    expect(
      submitReport(def, ready, answers, ['E05', 'E06', 'E07', 'E08', 'E09', 'E10']).result.code,
    ).toBe('not_established');
  });

  it('keeps the sticky note unsigned and free of a confession', () => {
    const strings = getCase('case_002')!.strings;
    expect(strings['c002.f09b']).toContain('unsigned');
    expect(
      Object.keys(strings).some((k) => k.startsWith('c002.f09') && /I moved/.test(strings[k]!)),
    ).toBe(false);
  });
});
