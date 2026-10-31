import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { loadPackDir, loadPacksDir } from '../pack-files';

const meta = { id: 'case-099', version: 1, minAppVersion: '1.0.0', caseNumber: 99, access: 'free' };

function writePack(root: string, folder: string, packJson: object) {
  const dir = join(root, folder);
  mkdirSync(join(dir, 'media'), { recursive: true });
  writeFileSync(join(dir, 'pack.json'), JSON.stringify(packJson));
  writeFileSync(join(dir, 'case.json'), JSON.stringify({ id: 'case_099' }));
  writeFileSync(join(dir, 'en.json'), JSON.stringify({ 'c099.title': 'Title' }));
  writeFileSync(join(dir, 'sk.json'), JSON.stringify({ 'c099.title': 'Názov' }));
  writeFileSync(join(dir, 'media', 'case-99-card.webp'), 'webp');
  writeFileSync(join(dir, 'publish.json'), JSON.stringify({ audience: 'playtest' }));
  return dir;
}

describe('loadPackDir', () => {
  it('reads the meta, definition, every locale and the media asset IDs', () => {
    const root = mkdtempSync(join(tmpdir(), 'packs-'));
    const pack = loadPackDir(writePack(root, 'case-099', meta));
    expect(pack.meta).toEqual(meta);
    expect(pack.definition).toEqual({ id: 'case_099' });
    expect(pack.strings).toEqual({ en: { 'c099.title': 'Title' }, sk: { 'c099.title': 'Názov' } });
    expect(pack.mediaAssetIds).toEqual(['case-99-card']);
  });

  it('refuses a pack whose id differs from its folder', () => {
    const root = mkdtempSync(join(tmpdir(), 'packs-'));
    expect(() => loadPackDir(writePack(root, 'case-098', meta))).toThrow(/must match its folder/);
  });

  it('loads every pack folder under a root, and nothing when the root is missing', () => {
    const root = mkdtempSync(join(tmpdir(), 'packs-'));
    writePack(root, 'case-099', meta);
    writeFileSync(join(root, 'README.md'), '# packs');
    expect(loadPacksDir(root).map((p) => p.meta.id)).toEqual(['case-099']);
    expect(loadPacksDir(join(root, 'missing'))).toEqual([]);
  });
});
