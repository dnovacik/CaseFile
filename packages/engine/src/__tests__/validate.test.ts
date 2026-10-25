import { describe, expect, it } from 'vitest';

import { checkCase, solveCase, validateCase, type CaseDefinition } from '../index';
import { makeCase, makeStrings } from './fixture';

const codes = (def: CaseDefinition, options = {}) => validateCase(def, options).map((i) => i.code);

describe('checkCase', () => {
  it('accepts a sound case with all strings present', () => {
    const def = makeCase();
    const result = checkCase(JSON.parse(JSON.stringify(def)), { strings: makeStrings(def) });
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('reports schema errors with their path', () => {
    const json = { ...makeCase(), schemaVersion: 2 } as unknown;
    const result = checkCase(json);
    expect(result.ok).toBe(false);
    expect(result.issues[0]).toMatchObject({
      code: 'schema',
      message: expect.stringContaining('schemaVersion'),
    });
  });

  it('rejects unknown fields', () => {
    const def = makeCase();
    const json = {
      ...def,
      evidence: [{ ...def.evidence[0], secret: true }, ...def.evidence.slice(1)],
    };
    expect(checkCase(json).ok).toBe(false);
  });
});

describe('validateCase', () => {
  it('rejects duplicate IDs across collections', () => {
    const def = makeCase();
    def.deductions[0]!.id = 'E1';
    expect(codes(def)).toContain('duplicate_id');
  });

  it('rejects broken references', () => {
    const def = makeCase();
    def.relationships[0]!.factIds = ['F2a', 'F404'];
    def.deductions[1]!.requires = { relationshipIds: ['R404'] };
    def.actions[0]!.revealsEvidenceIds = ['E404'];
    def.conclusions[0]!.correctChoiceId = 'nobody';
    def.hints![0]!.relationshipId = 'R404';
    expect(codes(def).filter((c) => c === 'missing_ref')).toHaveLength(5);
  });

  it('rejects facts not listed by their evidence', () => {
    const def = makeCase();
    def.evidence[1]!.factIds = ['F2a'];
    expect(codes(def)).toContain('fact_not_listed');
  });

  it('rejects two relationships on the same fact pair', () => {
    const def = makeCase();
    def.relationships.push({ id: 'R9', factIds: ['F3', 'F2a'], type: 'supports' });
    expect(codes(def)).toContain('duplicate_pair');
  });

  it('rejects dependency cycles', () => {
    const def = makeCase();
    def.deductions[0]!.requires = { relationshipIds: ['R1'], deductionIds: ['D3'] };
    expect(codes(def)).toContain('dependency_cycle');
  });

  it('rejects cycles through hidden evidence', () => {
    const def = makeCase();
    def.actions[0]!.requires = { deductionIds: ['D3'] };
    expect(codes(def)).toContain('dependency_cycle');
  });

  it('rejects hidden evidence that no action reveals', () => {
    const def = makeCase();
    def.actions[0]!.revealsEvidenceIds = [];
    expect(codes(def)).toContain('unreachable_evidence');
  });

  it('checks people, supporting proof and presentation', () => {
    const def = makeCase();
    def.people = [{ id: 'P1', nameKey: 'p1.name', roleKey: 'p1.role', assetId: 'portrait_p1' }];
    def.conclusions[0]!.choices[0]!.personId = 'P404';
    def.conclusions[0]!.supportingProofIds = ['F1'];
    def.presentation = {
      difficulty: 'rookie',
      estimatedMinutes: { min: 10, max: 8 },
      cardAssetId: 'card',
      briefing: {
        locationKey: 'b.location',
        dateKey: 'b.date',
        summaryKey: 'b.summary',
        objectiveKeys: ['b.objective'],
      },
      resolutionKey: 'resolution',
    };
    const strings = makeStrings({ ...def, presentation: undefined, people: undefined });
    const result = codes(def, { strings, assetIds: [] });
    expect(result).toEqual(
      expect.arrayContaining([
        'missing_ref',
        'invalid_proof',
        'invalid_estimate',
        'missing_string',
        'missing_asset',
      ]),
    );
  });

  it('rejects a person ID that collides with another ID', () => {
    const def = makeCase();
    def.people = [{ id: 'E1', nameKey: 'p.name', roleKey: 'p.role' }];
    expect(codes(def)).toContain('duplicate_id');
  });

  it('rejects a case without conclusions', () => {
    const def = makeCase();
    def.conclusions = [];
    expect(codes(def)).toContain('no_conclusions');
  });

  it('rejects proof sets that reference facts or actions', () => {
    const def = makeCase();
    def.conclusions[1]!.acceptedProofSets = [['F3']];
    expect(codes(def)).toContain('invalid_proof');
  });

  it('reports missing strings and assets when given', () => {
    const def = makeCase();
    def.evidence[0]!.assetIds = ['photo_e1'];
    const strings = makeStrings(def);
    delete strings['d1.title'];
    const result = codes(def, { strings, assetIds: [] });
    expect(result).toContain('missing_string');
    expect(result).toContain('missing_asset');
  });

  // Evidence revealed by several actions is not a static cycle (any one revealer suffices), so
  // only the full-path simulation catches the case where every revealer depends on that evidence.
  it('rejects a mandatory deduction stranded behind self-dependent evidence', () => {
    const def = makeCase();
    def.actions[0]!.requires = { deductionIds: ['D3'] };
    def.actions.push({
      id: 'A2',
      titleKey: 'a2.title',
      requires: { deductionIds: ['D3'] },
      revealsEvidenceIds: ['E5'],
    });
    const issues = validateCase(def);
    expect(issues.map((i) => i.code)).not.toContain('dependency_cycle');
    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          severity: 'error',
          code: 'unreachable_deduction',
          message: expect.stringContaining('D3'),
        }),
        expect.objectContaining({ severity: 'error', code: 'unsolvable' }),
      ]),
    );
  });

  /** Adds optional D9, which depends on evidence E6 that only self-dependent actions reveal. */
  function withStrandedOptionalDeduction(def: CaseDefinition): CaseDefinition {
    def.evidence.push({
      id: 'E6',
      type: 'document',
      titleKey: 'e6.title',
      bodyKey: 'e6.body',
      initial: false,
      factIds: ['F6'],
    });
    def.facts.push({ id: 'F6', evidenceId: 'E6', textKey: 'f6' });
    def.relationships.push({ id: 'R9', factIds: ['F1', 'F6'], type: 'supports' });
    def.deductions.push({
      id: 'D9',
      titleKey: 'd9.title',
      descriptionKey: 'd9.desc',
      requires: { relationshipIds: ['R9'] },
      mandatory: false,
    });
    def.actions.push(
      {
        id: 'A2',
        titleKey: 'a2.title',
        requires: { deductionIds: ['D9'] },
        revealsEvidenceIds: ['E6'],
      },
      {
        id: 'A3',
        titleKey: 'a3.title',
        requires: { deductionIds: ['D9'] },
        revealsEvidenceIds: ['E6'],
      },
    );
    return def;
  }

  it('only warns for an unreachable optional deduction', () => {
    const issues = validateCase(withStrandedOptionalDeduction(makeCase()));
    expect(issues).toContainEqual(
      expect.objectContaining({ severity: 'warning', code: 'unreachable_deduction' }),
    );
    expect(issues.map((i) => i.code)).not.toContain('unsolvable');
  });

  it('rejects a conclusion whose only proof can never be obtained', () => {
    const def = withStrandedOptionalDeduction(makeCase());
    def.conclusions[1]!.acceptedProofSets = [['D9']];
    expect(codes(def)).toEqual(expect.arrayContaining(['unprovable_conclusion', 'unsolvable']));
  });
});

describe('solveCase', () => {
  it('plays the fixture to a solved report', () => {
    const solution = solveCase(makeCase());
    expect(solution.solved).toBe(true);
    expect(solution.progress.status).toBe('solved');
    expect(solution.unreachableDeductionIds).toEqual([]);
    expect(solution.steps.at(-1)).toEqual({
      kind: 'report',
      answers: { C1: 'marcus', C2: 'badge' },
      proofIds: ['E3', 'E5'],
    });
  });

  it('is deterministic', () => {
    expect(solveCase(makeCase()).steps).toEqual(solveCase(makeCase()).steps);
  });

  it('flags a relationship that can never be established', () => {
    const def = makeCase();
    def.relationships.push({
      id: 'R9',
      factIds: ['F1', 'F4'],
      type: 'supports',
      requires: { relationshipIds: ['R404'] },
    });
    const solution = solveCase(def);
    expect(solution.unreachableRelationshipIds).toEqual(['R9']);
    expect(solution.solved).toBe(true);
  });

  it('flags an optional deduction that can never unlock', () => {
    const def = makeCase();
    def.relationships.push({ id: 'R9', factIds: ['F1', 'F4'], type: 'supports' });
    def.deductions.push({
      id: 'D9',
      titleKey: 'd9.title',
      descriptionKey: 'd9.desc',
      requires: { relationshipIds: ['R9'], factIds: ['F5'], actionIds: ['A404'] },
      mandatory: false,
    });
    expect(solveCase(def).unreachableDeductionIds).toEqual(['D9']);
  });

  it('fails when a mandatory deduction is unreachable', () => {
    const def = makeCase();
    def.deductions[2]!.requires = { relationshipIds: ['R3'], actionIds: ['A404'] };
    const solution = solveCase(def);
    expect(solution.solved).toBe(false);
    expect(solution.unreachableDeductionIds).toEqual(['D3']);
  });
});
