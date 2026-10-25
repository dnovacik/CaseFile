import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { cases } from '../index';

// art.ts uses Metro-only image requires, so read it as text instead of importing it.
const artSource = readFileSync(join(__dirname, '..', 'art.ts'), 'utf8');
const entries = [...artSource.matchAll(/'([^']+)': require\('\.\/(assets\/[^']+)'\)/g)].map(
  ([, id, path]) => ({ id: id!, path: path! }),
);
const assetFiles = readdirSync(join(__dirname, '..', 'assets', 'cases'));

describe('art map', () => {
  it('has an entry for every asset file, and every entry points at a real file', () => {
    expect(entries.map((e) => e.id).sort()).toEqual(
      assetFiles.map((file) => basename(file, extname(file))).sort(),
    );
    for (const entry of entries) {
      expect(existsSync(join(__dirname, '..', entry.path)), entry.path).toBe(true);
    }
  });

  it('covers every asset a case references', () => {
    const ids = new Set(entries.map((e) => e.id));
    for (const { definition } of cases) {
      const referenced = [
        definition.presentation?.cardAssetId,
        definition.presentation?.briefing.assetId,
        ...definition.evidence.flatMap((e) => e.assetIds ?? []),
        ...(definition.people ?? []).map((p) => p.assetId),
      ].filter((id): id is string => id !== undefined);
      expect(referenced.filter((id) => !ids.has(id))).toEqual([]);
    }
  });
});
