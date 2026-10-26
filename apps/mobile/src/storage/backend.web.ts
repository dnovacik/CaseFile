import type { SaveBackend, SaveRow } from './types';

const SAVES = 'casefile.saves.v1';
const ARCHIVE = 'casefile.archive.v1';
const SETTINGS = 'casefile.settings.v1';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota); progress then lasts for the session.
  }
}

/** Web builds keep saves in localStorage; devices use SQLite (backend.ts). */
export function createBackend(): SaveBackend {
  return {
    loadAll: () => Object.values(read<Record<string, SaveRow>>(SAVES, {})),
    save: (row) => write(SAVES, { ...read<Record<string, SaveRow>>(SAVES, {}), [row.caseId]: row }),
    archive: (row, reason) => {
      write(ARCHIVE, [...read<unknown[]>(ARCHIVE, []), { ...row, reason, archivedAt: Date.now() }]);
      const { [row.caseId]: _archived, ...rest } = read<Record<string, SaveRow>>(SAVES, {});
      write(SAVES, rest);
    },
    loadSetting: (key) => read<Record<string, string>>(SETTINGS, {})[key],
    saveSetting: (key, value) =>
      write(SETTINGS, { ...read<Record<string, string>>(SETTINGS, {}), [key]: value }),
  };
}
