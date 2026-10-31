import { locales } from '@casefile/content';
import {
  chooseIndex,
  clockOffsetMs,
  parseManifest,
  planSync,
  PackMetaSchema,
  type InstalledPack,
  type LoadedPack,
  type ManifestEntry,
  type PackIndex,
} from '@casefile/content/packs';
import { Directory, File, Paths } from 'expo-file-system';

import { API_URL, APP_VERSION, PLAYTEST } from './config';

/**
 * Installed case packs on the phone (docs/superpowers/specs/2026-10-31-live-cases-design.md).
 * Layout: <documents>/packs/index.json lists the installed versions; each lives in
 * <documents>/packs/<id>/<version>/ exactly as published. A version is only listed once every
 * file is downloaded and verified, so a folder the index doesn't name is never read.
 */

const MANIFEST_TIMEOUT_MS = 10_000;
/** Installed versions kept per pack: the newest, and one to fall back to if it fails its checks. */
const KEEP_VERSIONS = 2;

const packsRoot = () => new Directory(Paths.document, 'packs');
const indexFile = () => new File(packsRoot(), 'index.json');
const indexTmpFile = () => new File(packsRoot(), 'index.json.tmp');
const versionDir = (pack: InstalledPack) =>
  new Directory(packsRoot(), pack.id, String(pack.version));

function readText(file: File): string | null {
  try {
    return file.exists ? file.textSync() : null;
  } catch {
    return null;
  }
}

/** The index, or null if it exists but can't be read (then nothing on disk may be deleted). */
function readIndex(): PackIndex | null {
  return chooseIndex(readText(indexFile()), readText(indexTmpFile()));
}

/** Replace the index in one move, so an interruption leaves the old or the new one, never half. */
function writeIndex(index: PackIndex): void {
  const root = packsRoot();
  if (!root.exists) root.create({ intermediates: true });
  const tmp = indexTmpFile();
  tmp.writeSync(JSON.stringify(index));
  tmp.moveSync(indexFile(), { overwrite: true });
}

function readPackDir(pack: InstalledPack): LoadedPack {
  const dir = versionDir(pack);
  const json = (name: string): unknown => JSON.parse(new File(dir, name).textSync());
  const meta = PackMetaSchema.parse(json('pack.json'));
  if (meta.id !== pack.id || meta.version !== pack.version) {
    throw new Error(`pack.json says ${meta.id} v${meta.version}`);
  }
  const strings: LoadedPack['strings'] = {};
  for (const locale of locales) {
    const file = new File(dir, `${locale}.json`);
    if (file.exists) strings[locale] = JSON.parse(file.textSync()) as Record<string, string>;
  }
  const media = new Directory(dir, 'media');
  const mediaAssetIds = media.exists
    ? media
        .list()
        .filter((entry): entry is File => entry instanceof File && entry.extension === '.webp')
        .map((file) => file.name.slice(0, -'.webp'.length))
        .sort()
    : [];
  return { meta, definition: json('case.json'), strings, mediaAssetIds };
}

/**
 * Everything installed, read synchronously so launch can merge packs before saves are restored.
 * `packs` holds each pack's readable versions, newest first. `indexReadable` is false when the
 * index was damaged: packs then load as if none were installed and nothing is swept.
 */
export function loadInstalledSync(): {
  index: PackIndex;
  indexReadable: boolean;
  packs: LoadedPack[][];
  root: string;
} {
  const read = readIndex();
  const index = read ?? { clockOffsetMs: null, packs: [] };
  const byId = new Map<string, LoadedPack[]>();
  for (const pack of [...index.packs].sort((a, b) => b.version - a.version)) {
    try {
      const loaded = readPackDir(pack);
      byId.set(pack.id, [...(byId.get(pack.id) ?? []), loaded]);
    } catch (error) {
      console.warn(`[packs] Could not read ${pack.id} v${pack.version}`, error);
    }
  }
  return { index, indexReadable: read !== null, packs: [...byId.values()], root: packsRoot().uri };
}

/** The newest installed version of each pack. */
function latestInstalled(index: PackIndex): InstalledPack[] {
  const latest = new Map<string, InstalledPack>();
  for (const pack of index.packs) {
    const current = latest.get(pack.id);
    if (!current || pack.version > current.version) latest.set(pack.id, pack);
  }
  return [...latest.values()];
}

async function fetchManifest(): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MANIFEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}/v1/content/manifest`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Download one pack version and verify every file's size and MD5; throws on any mismatch. */
async function installPack(entry: ManifestEntry): Promise<void> {
  const dir = versionDir(entry);
  if (dir.exists) dir.delete();
  dir.create({ intermediates: true });
  for (const file of entry.files) {
    const target = new File(dir, ...file.path.split('/'));
    const parent = target.parentDirectory;
    if (!parent.exists) parent.create({ intermediates: true });
    const url = `${API_URL}/content/${entry.id}/${entry.version}/${file.path}`;
    const downloaded = await File.downloadFileAsync(url, target, { idempotent: true });
    if (downloaded.size !== file.size) {
      throw new Error(`${file.path}: ${downloaded.size} bytes, expected ${file.size}`);
    }
    const md5 = (await downloaded.digest('MD5')).toLowerCase();
    if (md5 !== file.md5) throw new Error(`${file.path}: checksum mismatch`);
  }
}

/** Keep the newest KEEP_VERSIONS versions of each pack. */
function trim(packs: InstalledPack[]): InstalledPack[] {
  const sorted = [...packs].sort((a, b) => a.id.localeCompare(b.id) || b.version - a.version);
  return sorted.filter(
    (pack, i) => sorted.slice(0, i).filter((p) => p.id === pack.id).length < KEEP_VERSIONS,
  );
}

/**
 * Fetch the manifest and install every pack version this app should have and doesn't. Never
 * throws: no network, a bad manifest or a failed download leave what's installed untouched.
 */
export async function syncPacks(): Promise<{
  installed: string[];
  failed: string[];
  clockOffsetMs: number | null;
}> {
  const installed: string[] = [];
  const failed: string[] = [];
  let manifestJson: unknown;
  try {
    manifestJson = await fetchManifest();
  } catch (error) {
    console.log('[packs] No manifest:', String(error));
    return { installed, failed, clockOffsetMs: null };
  }
  const manifest = parseManifest(manifestJson);
  if (!manifest) {
    console.warn('[packs] Ignoring an invalid manifest');
    return { installed, failed, clockOffsetMs: null };
  }
  const offset = clockOffsetMs(manifest.serverTime, new Date());

  try {
    const read = readIndex();
    if (read === null) console.warn('[packs] Installed index unreadable; starting it over');
    const index = read ?? { clockOffsetMs: null, packs: [] };
    const todo = planSync(manifest, latestInstalled(index), {
      appVersion: APP_VERSION,
      playtest: PLAYTEST,
    });
    let packs = index.packs;
    for (const entry of todo) {
      const label = `${entry.id} v${entry.version}`;
      try {
        await installPack(entry);
        packs = [...packs, { id: entry.id, version: entry.version }];
        installed.push(label);
      } catch (error) {
        console.warn(`[packs] Could not install ${label}`, error);
        failed.push(label);
        try {
          const dir = versionDir(entry);
          if (dir.exists) dir.delete();
        } catch {
          // Unlisted folders are swept on a later launch.
        }
      }
    }
    writeIndex({ clockOffsetMs: offset, packs: trim(packs) });
  } catch (error) {
    console.warn('[packs] Could not update installed packs', error);
  }
  return { installed, failed, clockOffsetMs: offset };
}

/** Delete pack version folders the index doesn't list (old versions, interrupted downloads). */
export function sweepUnused(index: PackIndex): void {
  const root = packsRoot();
  if (!root.exists) return;
  const keep = new Set(index.packs.map((p) => `${p.id}/${p.version}`));
  try {
    for (const packDir of root.list()) {
      if (!(packDir instanceof Directory)) continue;
      for (const version of packDir.list()) {
        if (!keep.has(`${packDir.name}/${version.name}`)) version.delete();
      }
      if (packDir.list().length === 0) packDir.delete();
    }
  } catch (error) {
    console.warn('[packs] Could not sweep unused packs', error);
  }
}
