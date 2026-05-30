import { db } from "./database";

export const initDatabase = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      file_name TEXT NOT NULL,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      tags TEXT,
      is_bookmarked INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: add is_bookmarked if table existed without it
  try {
    await db.execAsync(
      `ALTER TABLE snippets ADD COLUMN is_bookmarked INTEGER DEFAULT 0;`
    );
  } catch {
    // Column already exists — safe to ignore
  }
};
