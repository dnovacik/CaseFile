import { createProgress, inspectEvidence, serializeProgress } from '@casefile/engine';
import { getCase } from '@casefile/content';
import { describe, expect, it } from 'vitest';

import { hydrate, staleCaseIds } from './hydrate';
import type { SaveRow } from './types';

const def = getCase('case_001')!.definition;

function rowFor(data: string, overrides: Partial<SaveRow> = {}): SaveRow {
  return { caseId: def.id, contentVersion: def.contentVersion, data, updatedAt: 1, ...overrides };
}

describe('hydrate', () => {
  it('loads a valid save', () => {
    const { progress } = inspectEvidence(def, createProgress(def), 'E01');
    const result = hydrate([def], [rowFor(serializeProgress(progress))]);
    expect(result.progress).toEqual([progress]);
    expect(result.archive).toEqual([]);
  });

  it('archives a save from another content version instead of discarding it', () => {
    const old = { ...createProgress(def), contentVersion: def.contentVersion + 1 };
    const row = rowFor(serializeProgress(old), { contentVersion: old.contentVersion });
    expect(hydrate([def], [row])).toEqual({
      progress: [],
      archive: [{ row, reason: 'content_version_mismatch' }],
    });
  });

  it('archives a corrupt save', () => {
    const row = rowFor('{not json');
    expect(hydrate([def], [row]).archive).toEqual([{ row, reason: 'invalid_save' }]);
  });

  it('archives a save that references unknown evidence', () => {
    const broken = { ...createProgress(def), inspectedEvidenceIds: ['E404'] };
    const row = rowFor(serializeProgress(broken));
    expect(hydrate([def], [row]).archive).toEqual([{ row, reason: 'unknown_ids' }]);
  });

  it('leaves saves for cases that are not bundled untouched', () => {
    const row = rowFor('{}', { caseId: 'case_999' });
    expect(hydrate([def], [row])).toEqual({ progress: [], archive: [] });
  });
});

describe('staleCaseIds', () => {
  const progress = createProgress(def);

  it('finds progress saved against another content version of its case', () => {
    const updated = { ...def, contentVersion: def.contentVersion + 1 };
    expect(staleCaseIds({ [def.id]: progress }, [updated])).toEqual([def.id]);
  });

  it('keeps progress that matches its case, and progress of cases it was not given', () => {
    expect(staleCaseIds({ [def.id]: progress }, [def])).toEqual([]);
    expect(staleCaseIds({ case_999: { ...progress, caseId: 'case_999' } }, [def])).toEqual([]);
  });
});
