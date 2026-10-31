import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ManifestEntrySchema } from '../packs';

const script = join(__dirname, '..', '..', 'scripts', 'build-content.mjs');
const meta = { id: 'case-099', version: 1, minAppVersion: '1.0.0', caseNumber: 99, access: 'free' };

function setup(extra: Record<string, string> = {}) {
  const root = mkdtempSync(join(tmpdir(), 'build-content-'));
  const dir = join(root, 'packs', 'case-099');
  mkdirSync(join(dir, 'media'), { recursive: true });
  const files: Record<string, string> = {
    'pack.json': JSON.stringify(meta),
    'case.json': '{"id":"case_099"}',
    'en.json': '{"k":"v"}\r\n',
    'media/x.webp': 'webp-bytes',
    ...extra,
  };
  for (const [path, body] of Object.entries(files)) writeFileSync(join(dir, path), body);
  return { root, files };
}

function build(root: string, published?: unknown) {
  const env = {
    ...process.env,
    CONTENT_PACKS_DIR: join(root, 'packs'),
    CONTENT_OUT_DIR: join(root, 'out'),
  };
  if (published) {
    writeFileSync(join(root, 'published.json'), JSON.stringify(published));
    Object.assign(env, { PUBLISHED_MANIFEST: join(root, 'published.json') });
  }
  execFileSync('node', [script], { env, stdio: 'pipe' });
  return JSON.parse(readFileSync(join(root, 'out', 'manifest.json'), 'utf8')) as unknown[];
}

const hash = (algo: string, body: string) => createHash(algo).update(body).digest('hex');

describe('build-content.mjs', () => {
  it('lists every file byte-for-byte with size and hashes', () => {
    const { root, files } = setup();
    const manifest = build(root);
    expect(manifest).toHaveLength(1);
    const entry = ManifestEntrySchema.parse(manifest[0]);
    expect(entry).toMatchObject({ ...meta, audience: 'all' });
    expect(entry.files.map((f) => f.path)).toEqual([
      'case.json',
      'en.json',
      'media/x.webp',
      'pack.json',
    ]);
    for (const file of entry.files) {
      const body = files[file.path]!;
      expect(file).toEqual({
        path: file.path,
        size: Buffer.byteLength(body),
        sha256: hash('sha256', body),
        md5: hash('md5', body),
      });
    }
    expect(readFileSync(join(root, 'out', 'case-099', '1', 'en.json'), 'utf8')).toBe(
      '{"k":"v"}\r\n',
    );
  });

  it('marks playtest packs and leaves publish.json out of the files', () => {
    const { root } = setup({ 'publish.json': '{"audience":"playtest"}' });
    const entry = ManifestEntrySchema.parse(build(root)[0]);
    expect(entry.audience).toBe('playtest');
    expect(entry.files.some((f) => f.path === 'publish.json')).toBe(false);
  });

  it('refuses to change a version that is already published', () => {
    const { root } = setup();
    const entry = ManifestEntrySchema.parse(build(root)[0]);
    const changed = { ...entry, files: entry.files.map((f) => ({ ...f, sha256: '0'.repeat(64) })) };
    expect(() => build(root, [changed])).toThrow(/already published with other files/);
    expect(build(root, [entry])).toHaveLength(1);
  });
});
