import { readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import {
  checkCase,
  createProgress,
  getAvailableEvidenceIds,
  solveCase,
  submitReport,
  type CaseProgress,
} from '@casefile/engine';
import { describe, expect, it } from 'vitest';

import { getCase } from '../index';
import caseJson from '../cases/case-001/case.json';

const assetDir = join(__dirname, '..', 'assets', 'cases');
const assetIds = readdirSync(assetDir).map((file) => basename(file, extname(file)));

const content = getCase('case_001')!;
const def = content.definition;
const answers = { C01: 'marcus', C02: 'badge' };

/** Progress after the solver's full investigation, just before the report. */
function investigated(): CaseProgress {
  const { progress } = solveCase(def);
  return { ...progress, status: 'active' };
}

describe('Case 001 — The Missing Watch', () => {
  it('passes every validation check with no warnings', () => {
    const result = checkCase(caseJson, { strings: content.strings, assetIds });
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('has no unused strings', () => {
    const used = JSON.stringify(caseJson);
    const unused = Object.keys(content.strings).filter((key) => !used.includes(`"${key}"`));
    expect(unused).toEqual([]);
  });

  it('is solvable end to end and reaches every deduction', () => {
    const solution = solveCase(def);
    expect(solution.solved).toBe(true);
    expect(solution.unreachableDeductionIds).toEqual([]);
    expect(solution.unreachableRelationshipIds).toEqual([]);
  });

  it('uses all three relation types on the mandatory path', () => {
    const mandatoryRelationships = def.deductions
      .filter((d) => d.mandatory)
      .flatMap((d) => d.requires.relationshipIds ?? []);
    const types = new Set(
      def.relationships.filter((r) => mandatoryRelationships.includes(r.id)).map((r) => r.type),
    );
    expect([...types].sort()).toEqual(['contradicts', 'same_event', 'supports']);
  });

  it('keeps the recovered watch hidden until the justified search', () => {
    const start = createProgress(def);
    expect(getAvailableEvidenceIds(def, start)).not.toContain('E09');
    const revealers = def.actions.filter((a) => a.revealsEvidenceIds.includes('E09'));
    expect(revealers.map((a) => a.id)).toEqual(['A01']);
    expect(revealers[0]!.requires.deductionIds).toEqual(['D01', 'D02']);
    expect(revealers[0]!.justificationKey).toBeDefined();
  });

  it('does not identify Marcus from badge ownership alone', () => {
    // Naming Marcus needs D04: by his own account the badge and jacket never left him.
    const c01 = def.conclusions.find((c) => c.id === 'C01')!;
    expect(c01.requiresDeductionIds).toContain('D04');
    const d04 = def.deductions.find((d) => d.id === 'D04')!;
    expect(d04.requires.relationshipIds).toEqual(['R05']);

    // The badge log alone is not enough proof for "who".
    const ready = investigated();
    expect(submitReport(def, ready, answers, ['E05']).result.code).toBe('not_established');
    expect(submitReport(def, ready, answers, ['E05', 'E09']).result.code).toBe('valid');
  });

  it('accepts relevant extra evidence but rejects padding with irrelevant evidence', () => {
    const ready = investigated();
    expect(submitReport(def, ready, answers, ['E02', 'E05', 'E06', 'E08', 'E09']).result.code).toBe(
      'valid',
    );
    expect(submitReport(def, ready, answers, ['E05', 'E09', 'F02A']).result.code).toBe(
      'not_available',
    );
    // The corridor photo identifies nobody, so citing it (or selecting everything) fails.
    expect(submitReport(def, ready, answers, ['E05', 'E07', 'E09']).result.code).toBe(
      'not_established',
    );
    const everything = [...ready.inspectedEvidenceIds, ...ready.unlockedDeductionIds];
    expect(everything).toContain('E07');
    expect(submitReport(def, ready, answers, everything).result.code).toBe('not_established');
  });

  it('rejects the wrong suspect or entry method', () => {
    const ready = investigated();
    for (const suspect of ['adrian', 'elena', 'thomas']) {
      expect(
        submitReport(def, ready, { ...answers, C01: suspect }, ['E05', 'E09']).result.code,
      ).toBe('not_established');
    }
    expect(
      submitReport(def, ready, { ...answers, C02: 'emergency_key' }, ['E05', 'E09']).result.code,
    ).toBe('not_established');
  });

  it('gives every photograph a text description of its clues', () => {
    for (const item of def.evidence.filter((e) => e.type === 'photograph')) {
      expect(content.strings[item.bodyKey]!.length).toBeGreaterThan(200);
    }
  });
});
