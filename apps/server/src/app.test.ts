import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { buildApp } from './app';

const now = () => new Date('2026-10-31T12:00:00.000Z');
const entry = {
  id: 'case-004',
  version: 1,
  minAppVersion: '1.0.0',
  caseNumber: 4,
  access: 'free',
  audience: 'all',
  files: [{ path: 'pack.json', size: 2, sha256: 'a'.repeat(64), md5: 'b'.repeat(32) }],
};

function app(manifest?: string) {
  const contentDir = mkdtempSync(join(tmpdir(), 'casefile-content-'));
  if (manifest !== undefined) writeFileSync(join(contentDir, 'manifest.json'), manifest);
  return buildApp({ contentDir, now });
}

describe('content API', () => {
  it('reports health', async () => {
    const res = await app().inject({ method: 'GET', url: '/v1/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });

  it('serves an empty manifest with the server time when nothing is published', async () => {
    const res = await app().inject({ method: 'GET', url: '/v1/content/manifest' });
    expect(res.statusCode).toBe(200);
    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.json()).toEqual({ serverTime: '2026-10-31T12:00:00.000Z', packs: [] });
  });

  it('serves the published packs', async () => {
    const res = await app(JSON.stringify([entry])).inject({ url: '/v1/content/manifest' });
    expect(res.json()).toEqual({ serverTime: '2026-10-31T12:00:00.000Z', packs: [entry] });
  });

  it('holds a scheduled pack back until its release time, so phones never have it early', async () => {
    const later = { ...entry, id: 'case-005', caseNumber: 5, startsAt: '2026-11-01T09:00:00Z' };
    const released = { ...entry, startsAt: '2026-10-31T09:00:00Z' };
    const res = await app(JSON.stringify([released, later])).inject({
      url: '/v1/content/manifest',
    });
    expect(res.json().packs.map((p: { id: string }) => p.id)).toEqual(['case-004']);
  });

  it('serves no packs, rather than an error, when the manifest file is damaged', async () => {
    const res = await app('{not json').inject({ url: '/v1/content/manifest' });
    expect(res.statusCode).toBe(200);
    expect(res.json().packs).toEqual([]);
  });
});
