import { checkCase, type CaseDefinition } from '@casefile/engine';
import { z } from 'zod';

import { locales, type CaseContent, type Locale } from './index';

/**
 * Live case packs (docs/superpowers/specs/2026-10-31-live-cases-design.md): the formats shared by
 * the app, the server and the scripts, and the pure decisions about them. No I/O here.
 */

const semver = z.string().regex(/^\d+\.\d+\.\d+$/);

export const PackMetaSchema = z.object({
  id: z.string().regex(/^case-\d{3}$/),
  version: z.number().int().min(1),
  minAppVersion: semver,
  caseNumber: z.number().int().min(1),
  access: z.enum(['free', 'premium']),
  startsAt: z.iso.datetime().optional(),
});
export type PackMeta = z.infer<typeof PackMetaSchema>;

export const ManifestEntrySchema = PackMetaSchema.extend({
  audience: z.enum(['all', 'playtest']),
  /** Every file of the pack, pack.json included. */
  files: z.array(
    z.object({
      path: z.string().min(1),
      size: z.number().int().nonnegative(),
      sha256: z.string().regex(/^[0-9a-f]{64}$/),
      md5: z.string().regex(/^[0-9a-f]{32}$/),
    }),
  ),
});
export type ManifestEntry = z.infer<typeof ManifestEntrySchema>;

export const ContentManifestSchema = z.object({
  serverTime: z.iso.datetime(),
  packs: z.array(ManifestEntrySchema),
});
export type ContentManifest = z.infer<typeof ContentManifestSchema>;

export type InstalledPack = { id: string; version: number };

const PackIndexSchema = z.object({
  clockOffsetMs: z.number().nullable(),
  packs: z.array(z.object({ id: z.string(), version: z.number().int() })),
});
export type PackIndex = z.infer<typeof PackIndexSchema>;

/** A pack read from disk: its definition and strings are still unchecked. */
export type LoadedPack = {
  meta: PackMeta;
  definition: unknown;
  strings: Partial<Record<Locale, Record<string, string>>>;
  /** Asset IDs of the files in its media/ folder. */
  mediaAssetIds: string[];
};

/** A playable case: bundled, or from the pack named in `pack`. */
export type RegisteredCase = CaseContent & {
  number: number;
  access: 'free' | 'premium';
  pack: InstalledPack | null;
};

export const packIdFor = (caseId: string): string => caseId.replace(/_/g, '-');

export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function parseManifest(json: unknown): ContentManifest | null {
  const parsed = ContentManifestSchema.safeParse(json);
  return parsed.success ? parsed.data : null;
}

const EMPTY_INDEX: PackIndex = { clockOffsetMs: null, packs: [] };

function parseIndex(text: string): PackIndex | null {
  try {
    const parsed = PackIndexSchema.safeParse(JSON.parse(text));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/**
 * The installed-pack index. A valid index.json wins; if replacing it was interrupted, the
 * index.json.tmp written just before is used. No files at all is a fresh install; files that
 * exist but can't be read give null, so callers never mistake damage for "nothing installed".
 */
export function chooseIndex(main: string | null, tmp: string | null): PackIndex | null {
  if (main === null && tmp === null) return EMPTY_INDEX;
  return (main !== null ? parseIndex(main) : null) ?? (tmp !== null ? parseIndex(tmp) : null);
}

export const clockOffsetMs = (serverTime: string, now: Date): number =>
  Date.parse(serverTime) - now.getTime();

export const serverNowFrom = (offset: number | null, now: Date): Date | null =>
  offset === null ? null : new Date(now.getTime() + offset);

/** Manifest entries this app should download: allowed for it, and newer than what's installed. */
export function planSync(
  manifest: ContentManifest,
  installed: InstalledPack[],
  opts: { appVersion: string; playtest: boolean },
): ManifestEntry[] {
  return manifest.packs.filter((entry) => {
    if (entry.audience === 'playtest' && !opts.playtest) return false;
    if (compareVersions(entry.minAppVersion, opts.appVersion) > 0) return false;
    const current = installed.find((p) => p.id === entry.id);
    return !current || entry.version > current.version;
  });
}

/** Whether a pack's release date has passed, by the server's clock; never by the phone's. */
export function isReleased(meta: PackMeta, serverNow: Date | null, ignoreSchedule: boolean) {
  if (!meta.startsAt || ignoreSchedule) return true;
  return serverNow !== null && serverNow.getTime() >= Date.parse(meta.startsAt);
}

/** Everything wrong with a pack; empty when it is safe to play. */
export function checkPack(
  pack: LoadedPack,
  bundled: CaseContent[],
  bundledAssetIds: Iterable<string>,
): string[] {
  const errors: string[] = [];
  if (!pack.strings.en) return ['English strings are missing'];
  const assetIds = new Set([...bundledAssetIds, ...pack.mediaAssetIds]);
  let definition: CaseDefinition | null = null;
  for (const locale of locales) {
    const strings = pack.strings[locale];
    if (!strings) continue;
    const result = checkCase(pack.definition, { strings, assetIds });
    for (const issue of result.issues) {
      if (issue.severity === 'error') errors.push(`${locale}: ${issue.message}`);
    }
    if (result.ok) definition = result.definition;
  }
  if (!definition) return errors.length ? errors : ['The case definition is invalid'];
  if (pack.meta.id !== packIdFor(definition.id)) {
    errors.push(`Pack id ${pack.meta.id} does not match case ${definition.id}`);
  }
  const index = bundled.findIndex((c) => c.definition.id === definition.id);
  if (index >= 0) {
    if (JSON.stringify(definition) !== JSON.stringify(bundled[index]!.definition)) {
      errors.push(`It changes bundled case ${definition.id}; packs may only fix its text and art`);
    }
    if (pack.meta.caseNumber !== index + 1) {
      errors.push(
        `Bundled case ${definition.id} is number ${index + 1}, not ${pack.meta.caseNumber}`,
      );
    }
  }
  return errors;
}

/**
 * The cases to play: bundled cases (numbered 1…N in order) plus, per pack id, the newest
 * installed version that this app may show and that passes every check. A broken or gated
 * version falls back to an older installed one. Pack media win over bundled art with the same ID.
 * `candidates` holds each pack's installed versions, newest first.
 */
export function mergeCases(
  bundled: CaseContent[],
  candidates: LoadedPack[][],
  opts: {
    appVersion: string;
    serverNow: Date | null;
    ignoreSchedule: boolean;
    bundledAssetIds: Iterable<string>;
  },
): {
  cases: RegisteredCase[];
  media: Record<string, { packId: string; version: number }>;
  errors: string[];
} {
  const bundledAssetIds = [...opts.bundledAssetIds];
  const errors: string[] = [];
  const media: Record<string, { packId: string; version: number }> = {};
  const result: RegisteredCase[] = bundled.map((content, i) => ({
    ...content,
    number: i + 1,
    access: 'free',
    pack: null,
  }));

  const groups = candidates
    .filter((group) => group.length > 0)
    .sort((a, b) => a[0]!.meta.id.localeCompare(b[0]!.meta.id));
  for (const group of groups) {
    const chosen = group.find((pack) => {
      const { meta } = pack;
      if (compareVersions(meta.minAppVersion, opts.appVersion) > 0) return false;
      if (!isReleased(meta, opts.serverNow, opts.ignoreSchedule)) return false;
      const problems = checkPack(pack, bundled, bundledAssetIds);
      for (const problem of problems) errors.push(`${meta.id} v${meta.version}: ${problem}`);
      return problems.length === 0;
    });
    if (!chosen) continue;

    const parsed = checkCase(chosen.definition);
    if (!parsed.ok) continue;
    const definition = parsed.definition;
    const en = chosen.strings.en!;
    const strings = Object.fromEntries(
      locales.map((locale) => [locale, chosen.strings[locale] ?? en]),
    ) as Record<Locale, Record<string, string>>;
    const registered: RegisteredCase = {
      definition,
      strings,
      number: chosen.meta.caseNumber,
      access: chosen.meta.access,
      pack: { id: chosen.meta.id, version: chosen.meta.version },
    };

    const override = result.findIndex((c) => c.definition.id === definition.id);
    if (override >= 0) {
      result[override] = { ...registered, number: result[override]!.number };
    } else if (result.some((c) => c.number === registered.number)) {
      errors.push(`${chosen.meta.id}: case number ${registered.number} is already taken`);
      continue;
    } else {
      result.push(registered);
    }
    for (const assetId of chosen.mediaAssetIds) {
      media[assetId] = { packId: chosen.meta.id, version: chosen.meta.version };
    }
  }

  return { cases: result.sort((a, b) => a.number - b.number), media, errors };
}
