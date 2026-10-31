import { serializeProgress } from '@casefile/engine';

import { cases } from '@/content/cases';
import { isLocale, useLocaleStore } from '@/i18n';
import {
  isMotionPreference,
  parseSound,
  serializeSound,
  usePreferencesStore,
} from '@/state/preferences';
import { useProgressStore } from '@/state/progress';

import { createBackend } from './backend';
import { hydrate } from './hydrate';

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

  const { progress, archive } = hydrate(
    cases.map((c) => c.definition),
    backend.loadAll(),
  );
  for (const { row, reason } of archive) {
    backend.archive(row, reason);
    console.warn(`[storage] Archived save for ${row.caseId} (${reason}); starting it fresh.`);
  }
  const byCase = Object.fromEntries(progress.map((p) => [p.caseId, p]));
  useProgressStore.setState({ byCase });

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
