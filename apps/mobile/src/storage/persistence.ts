import { serializeProgress } from '@casefile/engine';

import { getCases, useRegistry } from '@/content/registry';
import { isLocale, useLocaleStore } from '@/i18n';
import {
  isMotionPreference,
  parseSound,
  serializeSound,
  usePreferencesStore,
} from '@/state/preferences';
import { useProgressStore } from '@/state/progress';

import { createBackend } from './backend';
import { hydrate, staleCaseIds } from './hydrate';
import type { SaveRow } from './types';

let started = false;

const LOCALE_SETTING = 'locale';
const SOUND_SETTING = 'sound';
const MOTION_SETTING = 'motion';

/**
 * Load saved progress, the chosen language and preferences into their stores, then autosave every change. Runs once at startup, before
 * the splash screen hides, so the library never flashes an unsaved state.
 */
export function startPersistence() {
  if (started) return;
  started = true;

  const backend = createBackend();

  // Until the player picks a language, the store keeps following the device language.
  const savedLocale = backend.loadSetting(LOCALE_SETTING);
  if (isLocale(savedLocale)) useLocaleStore.setState({ locale: savedLocale });
  useLocaleStore.subscribe((state, previous) => {
    if (state.locale !== previous.locale) backend.saveSetting(LOCALE_SETTING, state.locale);
  });

  const savedMotion = backend.loadSetting(MOTION_SETTING);
  usePreferencesStore.setState({
    sound: parseSound(backend.loadSetting(SOUND_SETTING)),
    ...(isMotionPreference(savedMotion) ? { motion: savedMotion } : {}),
  });
  usePreferencesStore.subscribe((state, previous) => {
    if (state.sound !== previous.sound) {
      backend.saveSetting(SOUND_SETTING, serializeSound(state.sound));
    }
    if (state.motion !== previous.motion) backend.saveSetting(MOTION_SETTING, state.motion);
  });

  // Saves of cases this build doesn't know yet (a pack that hasn't switched on) wait here, untouched.
  let pending: SaveRow[] = backend.loadAll();

  /** Bring saved progress in line with the active cases; runs at start and whenever packs change. */
  const applyCases = () => {
    const definitions = getCases().map((c) => c.definition);
    const byCase = { ...useProgressStore.getState().byCase };

    // A pack changed a case's structure: archive the old progress rather than reuse it.
    for (const caseId of staleCaseIds(byCase, definitions)) {
      const old = byCase[caseId]!;
      backend.archive(
        {
          caseId,
          contentVersion: old.contentVersion,
          data: serializeProgress(old),
          updatedAt: Date.now(),
        },
        'content_version_mismatch',
      );
      delete byCase[caseId];
      console.warn(`[storage] Archived progress for ${caseId}: the case was updated.`);
    }

    const known = new Set(definitions.map((d) => d.id));
    const ready = pending.filter((row) => known.has(row.caseId));
    pending = pending.filter((row) => !known.has(row.caseId));
    const { progress, archive } = hydrate(definitions, ready);
    for (const { row, reason } of archive) {
      backend.archive(row, reason);
      console.warn(`[storage] Archived save for ${row.caseId} (${reason}); starting it fresh.`);
    }
    for (const p of progress) byCase[p.caseId] = p;
    useProgressStore.setState({ byCase });
  };

  applyCases();
  useRegistry.subscribe((state, previous) => {
    if (state.cases !== previous.cases) applyCases();
  });

  // Every engine command produces a new progress object, so a reference check finds what changed.
  useProgressStore.subscribe((state, previous) => {
    if (state.byCase === previous.byCase) return;
    for (const [caseId, next] of Object.entries(state.byCase)) {
      if (next === previous.byCase[caseId]) continue;
      backend.save({
        caseId,
        contentVersion: next.contentVersion,
        data: serializeProgress(next),
        updatedAt: Date.now(),
      });
    }
  });
}
