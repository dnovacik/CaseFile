import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

import { locales } from './index';
import { PackMetaSchema, type LoadedPack } from './packs';

/** Node only: reads case packs from content/packs/ (layout in content/packs/README.md). */

const readJson = (file: string): unknown => JSON.parse(readFileSync(file, 'utf8'));

export function loadPackDir(dir: string): LoadedPack {
  const meta = PackMetaSchema.parse(readJson(join(dir, 'pack.json')));
  if (meta.id !== basename(dir)) {
    throw new Error(`${basename(dir)}/pack.json: id is "${meta.id}", must match its folder`);
  }
  const strings: LoadedPack['strings'] = {};
  for (const locale of locales) {
    const file = join(dir, `${locale}.json`);
    if (existsSync(file)) strings[locale] = readJson(file) as Record<string, string>;
  }
  const mediaDir = join(dir, 'media');
  const mediaAssetIds = existsSync(mediaDir)
    ? readdirSync(mediaDir)
        .filter((file) => extname(file) === '.webp')
        .map((file) => basename(file, '.webp'))
        .sort()
    : [];
  return { meta, definition: readJson(join(dir, 'case.json')), strings, mediaAssetIds };
}

/** Every pack folder (one with a pack.json) under root, in folder order. */
export function loadPacksDir(root: string): LoadedPack[] {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .sort()
    .map((name) => join(root, name))
    .filter((dir) => statSync(dir).isDirectory() && existsSync(join(dir, 'pack.json')))
    .map(loadPackDir);
}
