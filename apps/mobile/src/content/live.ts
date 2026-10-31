import { cases as bundled } from '@casefile/content';
import { mergeCases, serverNowFrom } from '@casefile/content/packs';
import { File } from 'expo-file-system';

import { APP_VERSION } from './config';
import { loadInstalledSync, sweepUnused, syncPacks } from './packStore';
import { bundledAssetIds, setRegistry } from './registry';

/** Merge the installed packs with the bundled cases and make them the cases the app plays. */
function activateInstalled(): void {
  const { index, indexReadable, packs, root } = loadInstalledSync();
  const merged = mergeCases(bundled, packs, {
    appVersion: APP_VERSION,
    serverNow: serverNowFrom(index.clockOffsetMs, new Date()),
    ignoreSchedule: false,
    bundledAssetIds,
  });
  for (const error of merged.errors) console.warn(`[packs] ${error}`);
  const media = Object.fromEntries(
    Object.entries(merged.media).map(([assetId, { packId, version }]) => [
      assetId,
      new File(root, packId, String(version), 'media', `${assetId}.webp`).uri,
    ]),
  );
  setRegistry(merged.cases, media);
  if (indexReadable) sweepUnused(index);
}

/** At launch, before saves are restored: play from what's already installed. Never throws. */
export function loadPacksAtLaunch(): void {
  try {
    activateInstalled();
  } catch (error) {
    console.warn('[packs] Could not load installed packs; playing bundled cases only', error);
  }
}

let refreshing: Promise<void> | null = null;

/**
 * Check for new packs and, if no case is open (`isCalm`), switch to them. When a case is open,
 * new packs stay installed and are switched on by the next call made while calm.
 */
export function refreshPacks(isCalm: () => boolean): Promise<void> {
  refreshing ??= (async () => {
    try {
      await syncPacks();
      if (isCalm()) activateInstalled();
    } catch (error) {
      console.warn('[packs] Refresh failed', error);
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}
