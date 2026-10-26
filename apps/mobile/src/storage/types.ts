/** One saved case, as stored on disk. `data` is the engine's serialized progress. */
export type SaveRow = {
  caseId: string;
  contentVersion: number;
  data: string;
  updatedAt: number;
};

/** Platform storage for saves and settings: SQLite on devices, localStorage on web. */
export type SaveBackend = {
  loadAll(): SaveRow[];
  save(row: SaveRow): void;
  /** Move a save that can't be loaded as-is into the archive, instead of deleting it. */
  archive(row: SaveRow, reason: string): void;
  loadSetting(key: string): string | undefined;
  saveSetting(key: string, value: string): void;
};
