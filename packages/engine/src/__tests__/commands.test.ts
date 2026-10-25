import { describe, expect, it } from 'vitest';

import {
  addElapsedTime,
  applyCommand,
  createProgress,
  getAvailableActionIds,
  getAvailableEvidenceIds,
  inspectEvidence,
  linkFacts,
  performAction,
  requestHint,
  resetCase,
  submitReport,
  type CaseDefinition,
  type CaseProgress,
  type Command,
} from '../index';
import { makeCase } from './fixture';

/** Apply commands in order, failing the test if any of them is rejected. */
function play(def: CaseDefinition, ...commands: Command[]): CaseProgress {
  return commands.reduce((progress, command) => {
    const outcome = applyCommand(def, progress, command);
    expect(outcome.result.code, JSON.stringify(command)).toBe('valid');
    return outcome.progress;
  }, createProgress(def));
}

const inspect = (...ids: string[]): Command[] =>
  ids.map((evidenceId) => ({ type: 'inspectEvidence', evidenceId }));

const link = (
  a: string,
  b: string,
  relation: 'contradicts' | 'supports' | 'same_event',
): Command => ({
  type: 'linkFacts',
  factIds: [a, b],
  relation,
});

/** Progress just before the final report: everything discovered. */
function fullyInvestigated(def: CaseDefinition): CaseProgress {
  return play(
    def,
    ...inspect('E1', 'E2', 'E3', 'E4'),
    link('F2a', 'F3', 'contradicts'),
    link('F2b', 'F4', 'supports'),
    { type: 'performAction', actionId: 'A1' },
    ...inspect('E5'),
    link('F1', 'F5', 'same_event'),
  );
}

describe('inspectEvidence', () => {
  it('marks available evidence inspected and activates the case', () => {
    const def = makeCase();
    const { progress, result } = inspectEvidence(def, createProgress(def), 'E1');
    expect(result.code).toBe('valid');
    expect(progress.inspectedEvidenceIds).toEqual(['E1']);
    expect(progress.status).toBe('active');
  });

  it('blocks hidden evidence', () => {
    const def = makeCase();
    const start = createProgress(def);
    const { progress, result } = inspectEvidence(def, start, 'E5');
    expect(result.code).toBe('not_available');
    expect(progress).toBe(start);
  });

  it('rejects inspecting the same evidence twice', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E1'));
    expect(inspectEvidence(def, progress, 'E1').result.code).toBe('already_discovered');
  });
});

describe('linkFacts', () => {
  it('establishes an authored relationship regardless of fact order', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2', 'E3'));
    const forward = linkFacts(def, progress, 'F2a', 'F3', 'contradicts');
    const reverse = linkFacts(def, progress, 'F3', 'F2a', 'contradicts');
    expect(forward.result).toEqual({
      code: 'valid',
      relationshipId: 'R1',
      unlockedDeductionIds: ['D1'],
    });
    expect(reverse.result).toEqual(forward.result);
  });

  it('rejects the wrong relation type without revealing the right one', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2', 'E3'));
    const { progress: next, result } = linkFacts(def, progress, 'F2a', 'F3', 'supports');
    expect(result).toEqual({ code: 'not_established' });
    expect(next).toBe(progress);
  });

  it('rejects unrelated pairs the same way as wrong types', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E1', 'E2'));
    expect(linkFacts(def, progress, 'F1', 'F2a', 'contradicts').result).toEqual({
      code: 'not_established',
    });
  });

  it('requires both facts to come from inspected evidence', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2'));
    expect(linkFacts(def, progress, 'F2a', 'F3', 'contradicts').result.code).toBe('not_available');
  });

  it('rejects linking a fact to itself', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2'));
    expect(linkFacts(def, progress, 'F2a', 'F2a', 'same_event').result.code).toBe('invalid_input');
  });

  it('does not record duplicate discoveries', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2', 'E3'), link('F2a', 'F3', 'contradicts'));
    const again = linkFacts(def, progress, 'F3', 'F2a', 'contradicts');
    expect(again.result.code).toBe('already_discovered');
    expect(again.progress.discoveredRelationshipIds).toEqual(['R1']);
  });

  it('hides relationships whose prerequisites are not met', () => {
    const def = makeCase();
    def.relationships[1]!.requires = { deductionIds: ['D1'] };
    const progress = play(def, ...inspect('E2', 'E4'));
    expect(linkFacts(def, progress, 'F2b', 'F4', 'supports').result.code).toBe('not_established');
  });
});

describe('deductions', () => {
  it('unlock only when every prerequisite holds', () => {
    const def = makeCase();
    const progress = fullyInvestigated(def);
    expect(progress.unlockedDeductionIds).toEqual(['D1', 'D2', 'D3']);

    const partial = play(def, ...inspect('E1', 'E2', 'E3', 'E4'), link('F2a', 'F3', 'contradicts'));
    expect(partial.unlockedDeductionIds).toEqual(['D1']);
  });

  it('chain through other deductions in a single pass', () => {
    const def = makeCase();
    def.deductions.push({
      id: 'D4',
      titleKey: 'd4.title',
      descriptionKey: 'd4.desc',
      requires: { deductionIds: ['D1'] },
      mandatory: false,
    });
    const progress = play(def, ...inspect('E2', 'E3'));
    const { result } = linkFacts(def, progress, 'F2a', 'F3', 'contradicts');
    expect(result).toMatchObject({ unlockedDeductionIds: ['D1', 'D4'] });
  });
});

describe('performAction', () => {
  it('is gated by its requirements', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2', 'E3'), link('F2a', 'F3', 'contradicts'));
    expect(getAvailableActionIds(def, progress)).toEqual([]);
    expect(performAction(def, progress, 'A1').result.code).toBe('requires_more_investigation');
  });

  it('reveals evidence without inspecting it', () => {
    const def = makeCase();
    const ready = play(
      def,
      ...inspect('E2', 'E3', 'E4'),
      link('F2a', 'F3', 'contradicts'),
      link('F2b', 'F4', 'supports'),
    );
    expect(getAvailableActionIds(def, ready)).toEqual(['A1']);
    const { progress, result } = performAction(def, ready, 'A1');
    expect(result).toEqual({
      code: 'valid',
      revealedEvidenceIds: ['E5'],
      unlockedDeductionIds: [],
    });
    expect(getAvailableEvidenceIds(def, progress)).toContain('E5');
    expect(progress.inspectedEvidenceIds).not.toContain('E5');
    expect(performAction(def, progress, 'A1').result.code).toBe('already_discovered');
  });
});

describe('requestHint', () => {
  it('walks nudge → focus → reveal for the first open relationship', () => {
    const def = makeCase();
    const start = createProgress(def);

    const nudge = requestHint(def, start, 1);
    expect(nudge.result).toEqual({ code: 'valid', stage: 1, nudgeKey: 'hint.r1' });
    const focus = requestHint(def, nudge.progress, 2);
    expect(focus.result).toEqual({ code: 'valid', stage: 2, factIds: ['F2a', 'F3'] });
    const reveal = requestHint(def, focus.progress, 3);
    expect(reveal.result).toEqual({
      code: 'valid',
      stage: 3,
      relationshipId: 'R1',
      unlockedDeductionIds: ['D1'],
    });
    expect(reveal.progress.inspectedEvidenceIds).toEqual(['E2', 'E3']);
    expect(reveal.progress.hintsUsed).toBe(3);

    expect(requestHint(def, reveal.progress, 1).result).toMatchObject({ nudgeKey: 'hint.r2' });
  });

  it('never points at relationships on hidden evidence', () => {
    const def = makeCase();
    const progress = play(
      def,
      ...inspect('E2', 'E3', 'E4'),
      link('F2a', 'F3', 'contradicts'),
      link('F2b', 'F4', 'supports'),
    );
    const { result, progress: next } = requestHint(def, progress, 1);
    expect(result.code).toBe('not_available');
    expect(next.hintsUsed).toBe(0);
  });
});

describe('submitReport', () => {
  const answers = { C1: 'marcus', C2: 'badge' };

  it('requires mandatory deductions first', () => {
    const def = makeCase();
    const progress = play(def, ...inspect('E2', 'E3'), link('F2a', 'F3', 'contradicts'));
    const { result, progress: next } = submitReport(def, progress, answers, ['E3']);
    expect(result.code).toBe('requires_more_investigation');
    expect(next.incorrectSubmissions).toBe(0);
  });

  it('accepts correct answers with an accepted proof set', () => {
    const def = makeCase();
    const { result, progress } = submitReport(def, fullyInvestigated(def), answers, ['E3', 'E5']);
    expect(result.code).toBe('valid');
    expect(progress.status).toBe('solved');
  });

  it('rejects a wrong answer, counts it and allows a retry', () => {
    const def = makeCase();
    const ready = fullyInvestigated(def);
    const wrong = submitReport(def, ready, { C1: 'elena', C2: 'badge' }, ['E3', 'E5']);
    expect(wrong.result).toEqual({ code: 'not_established' });
    expect(wrong.progress.incorrectSubmissions).toBe(1);
    expect(wrong.progress.unlockedDeductionIds).toEqual(ready.unlockedDeductionIds);

    const retry = submitReport(def, wrong.progress, answers, ['E3', 'E5']);
    expect(retry.result.code).toBe('valid');
    expect(retry.progress.incorrectSubmissions).toBe(1);
  });

  it('rejects correct answers without a complete proof set', () => {
    const def = makeCase();
    expect(submitReport(def, fullyInvestigated(def), answers, ['E3']).result.code).toBe(
      'not_established',
    );
  });

  it('rejects selections padded with irrelevant proof', () => {
    const def = makeCase();
    const result = submitReport(def, fullyInvestigated(def), answers, ['E3', 'E5', 'E4']).result;
    expect(result.code).toBe('not_established');
  });

  it('accepts relevant supporting proof alongside an accepted set', () => {
    const def = makeCase();
    def.conclusions[0]!.supportingProofIds = ['E4', 'D2'];
    const ready = fullyInvestigated(def);
    expect(submitReport(def, ready, answers, ['E3', 'E5', 'E4', 'D2']).result.code).toBe('valid');
    expect(submitReport(def, ready, answers, ['E4', 'D2']).result.code).toBe('not_established');
  });

  it('rejects proof the player has not obtained', () => {
    const def = makeCase();
    const ready = play(
      def,
      ...inspect('E1', 'E2', 'E3', 'E4'),
      link('F2a', 'F3', 'contradicts'),
      link('F2b', 'F4', 'supports'),
    );
    def.deductions[2]!.mandatory = false;
    def.conclusions[0]!.requiresDeductionIds = [];
    expect(submitReport(def, ready, answers, ['E3', 'E5']).result.code).toBe('not_available');
  });

  it('rejects incomplete or unknown answers as invalid input', () => {
    const def = makeCase();
    const ready = fullyInvestigated(def);
    expect(submitReport(def, ready, { C1: 'marcus' }, ['E3', 'E5']).result.code).toBe(
      'invalid_input',
    );
    expect(submitReport(def, ready, { ...answers, C9: 'x' }, ['E3', 'E5']).result.code).toBe(
      'invalid_input',
    );
  });
});

describe('time and reset', () => {
  it('tracks elapsed time until solved', () => {
    const def = makeCase();
    const progress = addElapsedTime(createProgress(def), 42);
    expect(progress.elapsedSeconds).toBe(42);
    const solved = { ...progress, status: 'solved' as const };
    expect(addElapsedTime(solved, 10)).toBe(solved);
  });

  it('resets to a fresh state', () => {
    const def = makeCase();
    expect(resetCase(def)).toEqual(createProgress(def));
  });
});
