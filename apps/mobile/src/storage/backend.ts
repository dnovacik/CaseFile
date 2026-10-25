import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import type { SaveBackend, SaveRow } from './types';

/**
 * Schema migrations, applied in order and tracked with PRAGMA user_version. Never edit a released
 * step; append a new one.
 */
const MIGRATIONS = [
  `CREATE TABLE case_progress (
     case_id TEXT PRIMARY KEY NOT NULL,
     content_version INTEGER NOT NULL,
     data TEXT NOT NULL,
     updated_at INTEGER NOT NULL
   );
   CREATE TABLE archived_progress (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     case_id TEXT NOT NULL,
     content_version INTEGER NOT NULL,
     data TEXT NOT NULL,
     reason TEXT NOT NULL,
     archived_at INTEGER NOT NULL
   );`,
];

function migrate(db: SQLiteDatabase) {
  const current =
    db.getFirstSync<{ user_version: number }>('PRAGMA user_version')?.user_version ?? 0;
  for (let version = current; version < MIGRATIONS.length; version++) {
    db.withTransactionSync(() => {
      db.execSync(MIGRATIONS[version]!);
      db.execSync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}

type Row = { case_id: string; content_version: number; data: string; updated_at: number };

export function createBackend(): SaveBackend {
  const db = openDatabaseSync('casefile.db');
  db.execSync('PRAGMA journal_mode = WAL');
  migrate(db);
  return {
    loadAll: () =>
      db
        .getAllSync<Row>('SELECT case_id, content_version, data, updated_at FROM case_progress')
        .map((r) => ({
          caseId: r.case_id,
          contentVersion: r.content_version,
          data: r.data,
          updatedAt: r.updated_at,
        })),
    save: (row: SaveRow) => {
      db.runSync(
        `INSERT INTO case_progress (case_id, content_version, data, updated_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(case_id) DO UPDATE SET
           content_version = excluded.content_version,
           data = excluded.data,
           updated_at = excluded.updated_at`,
        row.caseId,
        row.contentVersion,
        row.data,
        row.updatedAt,
      );
    },
    archive: (row: SaveRow, reason: string) => {
      db.withTransactionSync(() => {
        db.runSync(
          `INSERT INTO archived_progress (case_id, content_version, data, reason, archived_at)
         VALUES (?, ?, ?, ?, ?)`,
          row.caseId,
          row.contentVersion,
          row.data,
          reason,
          Date.now(),
        );
        db.runSync('DELETE FROM case_progress WHERE case_id = ?', row.caseId);
      });
    },
  };
}
