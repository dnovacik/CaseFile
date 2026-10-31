import type { CaseDefinition } from '@casefile/engine';
import { describe, expect, it } from 'vitest';

import { cases, getCase } from '../index';
import {
  checkPack,
  chooseIndex,
  compareVersions,
  isReleased,
  mergeCases,
  packIdFor,
  parseManifest,
  planSync,
  type ContentManifest,
  type LoadedPack,
  type ManifestEntry,
  type PackMeta,
} from '../packs';

const base = getCase('case_001')!;
const assetIdsOf = (def: CaseDefinition) => [
  ...new Set(
    [
      def.presentation?.cardAssetId,
      def.presentation?.briefing.assetId,
      ...(def.people ?? []).map((p) => p.assetId),
      ...def.evidence.flatMap((e) => e.assetIds ?? []),
    ].filter((id): id is string => !!id),
  ),
];
const bundledAssetIds = cases.flatMap((c) => assetIdsOf(c.definition));

function fixture(
  overrides: { meta?: Partial<PackMeta>; en?: Record<string, string> } = {},
): LoadedPack {
  const definition = JSON.parse(JSON.stringify({ ...base.definition, id: 'case_099' }));
  return {
    meta: {
      id: 'case-099',
      version: 1,
      minAppVersion: '1.0.0',
      caseNumber: 99,
      access: 'free',
      ...overrides.meta,
    },
    definition,
    strings: { en: { ...base.strings.en, ...overrides.en }, sk: { ...base.strings.sk } },
    mediaAssetIds: assetIdsOf(base.definition),
  };
}

const entry = (over: Partial<ManifestEntry> = {}): ManifestEntry => ({
  id: 'case-099',
  version: 1,
  minAppVersion: '1.0.0',
  caseNumber: 99,
  access: 'free',
  audience: 'all',
  files: [],
  ...over,
});
const manifest = (packs: ManifestEntry[]): ContentManifest => ({
  serverTime: '2026-10-31T12:00:00.000Z',
  packs,
});
const opts = { appVersion: '1.0.0', serverNow: null, ignoreSchedule: false, bundledAssetIds };

describe('pack helpers', () => {
  it('maps case ids to pack ids and compares versions', () => {
    expect(packIdFor('case_004')).toBe('case-004');
    expect(compareVersions('1.10.0', '1.9.3')).toBeGreaterThan(0);
    expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
  });

  it('falls back to the temporary index, and gives up only when both are unreadable', () => {
    expect(chooseIndex(null, null)).toEqual({ clockOffsetMs: null, packs: [] });
    expect(chooseIndex('{bad', '{"clockOffsetMs":5,"packs":[]}')).toEqual({
      clockOffsetMs: 5,
      packs: [],
    });
    expect(chooseIndex('{bad', '{bad')).toBeNull();
  });

  it('rejects a malformed manifest', () => {
    expect(parseManifest({ nope: 1 })).toBeNull();
    expect(parseManifest(manifest([entry()]))).toEqual(manifest([entry()]));
  });
});

describe('planSync', () => {
  const plan = (packs: ManifestEntry[], playtest = false) =>
    planSync(manifest(packs), [{ id: 'case-005', version: 2 }], { appVersion: '1.2.0', playtest });

  it('downloads only packs that are newer and allowed for this app', () => {
    const newer = entry({ id: 'case-005', version: 3 });
    expect(
      plan([
        newer,
        entry({ id: 'case-005', version: 2 }),
        entry({ id: 'case-006', minAppVersion: '9.0.0' }),
        entry({ id: 'case-007', audience: 'playtest' }),
      ]),
    ).toEqual([newer]);
  });

  it('downloads playtest packs on playtest builds', () => {
    expect(plan([entry({ id: 'case-007', audience: 'playtest' })], true)).toHaveLength(1);
  });
});

describe('checkPack', () => {
  it('accepts a complete pack', () => {
    expect(checkPack(fixture(), cases, bundledAssetIds)).toEqual([]);
  });

  it('reports a missing English string', () => {
    const pack = fixture();
    delete pack.strings.en![base.definition.titleKey];
    expect(checkPack(pack, cases, bundledAssetIds).length).toBeGreaterThan(0);
  });

  it('reports a missing asset', () => {
    const pack = { ...fixture(), mediaAssetIds: [] };
    expect(checkPack(pack, cases, [])).not.toEqual([]);
  });

  it('reports a pack id that does not match its case', () => {
    expect(checkPack(fixture({ meta: { id: 'case-098' } }), cases, bundledAssetIds)).not.toEqual(
      [],
    );
  });

  it('refuses to change a bundled case definition', () => {
    const pack = fixture({ meta: { id: 'case-001' } });
    pack.definition = { ...base.definition, contentVersion: base.definition.contentVersion + 1 };
    expect(checkPack(pack, cases, bundledAssetIds)).not.toEqual([]);
  });
});

describe('isReleased', () => {
  const meta = fixture({ meta: { startsAt: '2026-11-01T00:00:00Z' } }).meta;
  it('uses server time and stays hidden without it', () => {
    expect(isReleased(meta, new Date('2026-10-31T00:00:00Z'), false)).toBe(false);
    expect(isReleased(meta, new Date('2026-11-02T00:00:00Z'), false)).toBe(true);
    expect(isReleased(meta, null, false)).toBe(false);
    expect(isReleased(meta, null, true)).toBe(true);
    expect(isReleased(fixture().meta, null, false)).toBe(true);
  });
});

describe('mergeCases', () => {
  it('adds a pack after the bundled cases, with its media', () => {
    const result = mergeCases(cases, [[fixture()]], opts);
    expect(result.errors).toEqual([]);
    expect(result.cases.map((c) => c.number)).toEqual([...cases.map((_, i) => i + 1), 99]);
    expect(result.cases.at(-1)!.pack).toEqual({ id: 'case-099', version: 1 });
    expect(result.media['case-01-card']).toEqual({ packId: 'case-099', version: 1 });
  });

  it('keeps bundled art bundled', () => {
    expect(mergeCases(cases, [], opts).media).toEqual({});
  });

  it('falls back to the previous version when the newest one is broken', () => {
    const broken = fixture({ meta: { version: 2 } });
    delete broken.strings.en![base.definition.titleKey];
    const result = mergeCases(cases, [[broken, fixture()]], opts);
    expect(result.cases.at(-1)!.pack).toEqual({ id: 'case-099', version: 1 });
    expect(result.errors.join('\n')).toMatch(/case-099 v2/);
  });

  it('hides packs that need a newer app or are not released yet', () => {
    const later = fixture({ meta: { minAppVersion: '2.0.0' } });
    const scheduled = fixture({ meta: { id: 'case-099', startsAt: '2030-01-01T00:00:00Z' } });
    expect(mergeCases(cases, [[later]], opts).cases).toHaveLength(cases.length);
    expect(mergeCases(cases, [[scheduled]], opts).cases).toHaveLength(cases.length);
  });

  it('rejects a pack whose case number is already taken', () => {
    const clash = fixture({ meta: { caseNumber: 2 } });
    const result = mergeCases(cases, [[clash]], opts);
    expect(result.cases).toHaveLength(cases.length);
    expect(result.errors.join('\n')).toMatch(/number 2/);
  });

  it('keeps the lower pack id when two packs claim one number', () => {
    const a = fixture();
    const b = fixture({ meta: { id: 'case-100' } });
    b.definition = { ...(b.definition as CaseDefinition), id: 'case_100' };
    const result = mergeCases(cases, [[b], [a]], opts);
    expect(result.cases.filter((c) => c.number === 99).map((c) => c.pack?.id)).toEqual([
      'case-099',
    ]);
    expect(result.errors).toHaveLength(1);
  });

  it('lets a pack correct the text of a bundled case', () => {
    const fix = fixture({
      meta: { id: 'case-001', caseNumber: 1 },
      en: { [base.definition.titleKey]: 'Fixed' },
    });
    fix.definition = JSON.parse(JSON.stringify(base.definition));
    const result = mergeCases(cases, [[fix]], opts);
    expect(result.errors).toEqual([]);
    const first = result.cases[0]!;
    expect(first.number).toBe(1);
    expect(first.strings.en[base.definition.titleKey]).toBe('Fixed');
    expect(first.pack).toEqual({ id: 'case-001', version: 1 });
  });
});
