import { describe, expect, it } from 'vitest';

import { loadProgress, serializeProgress, solveCase } from '../index';
import { makeCase } from './fixture';

describe('save and load', () => {
  it('round-trips progress', () => {
    const def = makeCase();
    const { progress } = solveCase(def);
    expect(loadProgress(def, serializeProgress(progress))).toEqual({ ok: true, progress });
  });

  it('accepts already-parsed JSON', () => {
    const def = makeCase();
    const { progress } = solveCase(def);
    expect(loadProgress(def, JSON.parse(serializeProgress(progress)))).toEqual({
      ok: true,
      progress,
    });
  });

  it('rejects malformed saves', () => {
    const def = makeCase();
    expect(loadProgress(def, '{not json')).toEqual({ ok: false, code: 'invalid_save' });
    expect(loadProgress(def, { caseId: 'test_case' })).toEqual({ ok: false, code: 'invalid_save' });
  });

  it('rejects saves for another case or content version', () => {
    const def = makeCase();
    const { progress } = solveCase(def);
    expect(loadProgress(def, { ...progress, caseId: 'case_002' })).toEqual({
      ok: false,
      code: 'case_mismatch',
    });
    expect(loadProgress(def, { ...progress, contentVersion: 2 })).toEqual({
      ok: false,
      code: 'content_version_mismatch',
    });
  });

  it('rejects saves that reference unknown IDs', () => {
    const def = makeCase();
    const { progress } = solveCase(def);
    const saved = { ...progress, discoveredRelationshipIds: ['R404'] };
    expect(loadProgress(def, saved)).toEqual({ ok: false, code: 'unknown_ids' });
  });

  it('re-derives deductions on load', () => {
    const def = makeCase();
    const { progress } = solveCase(def);
    const loaded = loadProgress(def, { ...progress, unlockedDeductionIds: [] });
    expect(loaded.ok && loaded.progress.unlockedDeductionIds).toEqual(['D1', 'D2', 'D3']);
  });
});
