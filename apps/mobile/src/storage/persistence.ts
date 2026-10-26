import { serializeProgress } from '@casefile/engine';

import { cases } from '@/content/cases';
import { isLocale, useLocaleStore } from '@/i18n';
import { useProgressStore } from '@/state/progress';

import { createBackend } from './backend';
import { hydrate } from './hydrate';

let started = false;

const LOCALE_SETTING = 'locale';

/**
 * Load saved progress and the chosen language into their stores, then autosave every change. Runs once at startup, before
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
