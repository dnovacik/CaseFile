import { readdirSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import {
  createProgress,
  getAvailableEvidenceIds,
  solveCase,
  submitReport,
  type CaseProgress,
} from '@casefile/engine';
import { describe, expect, it } from 'vitest';

import { cases, locales } from '../index';

const assetIds = readdirSync(join(__dirname, '..', 'assets', 'cases')).map((file) =>
  basename(file, extname(file)),
);

// Fair-play rules every bundled case must meet. Case-specific checks live in case-NNN.test.ts.
describe.each(cases.map((c) => [c.definition.id, c] as const))('%s', (_, content) => {
  const def = content.definition;
  const answers = Object.fromEntries(def.conclusions.map((c) => [c.id, c.correctChoiceId]));

  /** Progress after the solver's full investigation, just before the report. */
  function investigated(): CaseProgress {
    const { progress } = solveCase(def);
    return { ...progress, status: 'active' };
  }

  it.each(locales)('passes every validation check with no warnings in %s', async (locale) => {
    const { checkCase } = await import('@casefile/engine');
    const result = checkCase(JSON.parse(JSON.stringify(def)), {
      strings: content.strings[locale],
      assetIds,
    });
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('has no unused strings', () => {
    const used = JSON.stringify(def);
    const unused = Object.keys(content.strings.en).filter((key) => !used.includes(`"${key}"`));
    expect(unused).toEqual([]);
  });

  it.each(locales)('translates exactly the English keys into %s, none left blank', (locale) => {
    const strings = content.strings[locale];
    expect(Object.keys(strings).sort()).toEqual(Object.keys(content.strings.en).sort());
    expect(Object.keys(strings).filter((key) => !strings[key]!.trim())).toEqual([]);
  });

  it('is solvable end to end and reaches every deduction', () => {
    const solution = solveCase(def);
    expect(solution.solved).toBe(true);
    expect(solution.unreachableDeductionIds).toEqual([]);
    expect(solution.unreachableRelationshipIds).toEqual([]);
  });

  it('uses all three relation types on the mandatory path', () => {
    const mandatory = def.deductions
      .filter((d) => d.mandatory)
      .flatMap((d) => d.requires.relationshipIds ?? []);
    const types = new Set(
      def.relationships.filter((r) => mandatory.includes(r.id)).map((r) => r.type),
    );
    expect([...types].sort()).toEqual(['contradicts', 'same_event', 'supports']);
  });

  it('hides non-initial evidence until a justified action reveals it', () => {
    const start = getAvailableEvidenceIds(def, createProgress(def));
    for (const evidence of def.evidence.filter((e) => !e.initial)) {
      expect(start).not.toContain(evidence.id);
      const revealers = def.actions.filter((a) => a.revealsEvidenceIds.includes(evidence.id));
      expect(revealers.length).toBeGreaterThan(0);
      for (const action of revealers) {
        expect(action.justificationKey).toBeDefined();
        expect(action.requires.deductionIds?.length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it('accepts the authored answers with the first accepted proof sets', () => {
    const proof = [...new Set(def.conclusions.flatMap((c) => c.acceptedProofSets[0]!))];
    expect(submitReport(def, investigated(), answers, proof).result.code).toBe('valid');
  });

  it('rejects every wrong answer', () => {
    const ready = investigated();
    const proof = [...new Set(def.conclusions.flatMap((c) => c.acceptedProofSets[0]!))];
    for (const conclusion of def.conclusions) {
      for (const choice of conclusion.choices.filter((c) => c.id !== conclusion.correctChoiceId)) {
        const wrong = { ...answers, [conclusion.id]: choice.id };
        expect(submitReport(def, ready, wrong, proof).result.code, choice.id).toBe(
          'not_established',
        );
      }
    }
  });

  it('fails a report that selects every piece of evidence', () => {
    const ready = investigated();
    const everything = [...ready.inspectedEvidenceIds, ...ready.unlockedDeductionIds];
    expect(submitReport(def, ready, answers, everything).result.code).toBe('not_established');
  });

  it('gives every photograph a text description of its clues', () => {
    for (const item of def.evidence.filter((e) => e.type === 'photograph')) {
      for (const locale of locales) {
        expect(content.strings[locale][item.bodyKey]!.length).toBeGreaterThan(200);
      }
    }
  });
});
