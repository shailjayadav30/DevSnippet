import { db } from "./database";
import type { Snippet } from "./types";

export const saveSnippet = async ({
  title,
  language,
  code,
  tags,
  fileName,
}: {
  title: string;
  language: string;
  code: string;
  tags: string[];
  fileName: string;
}) => {
  await db.runAsync(
    `INSERT INTO snippets (title, language, code, tags, file_name)
     VALUES (?, ?, ?, ?, ?)`,
    [title, language, code, JSON.stringify(tags), fileName]
  );
};

export const getAllSnippets = async (language?: string): Promise<Snippet[]> => {
  if (!language || language === "All") {
    return db.getAllAsync<Snippet>("SELECT * FROM snippets ORDER BY id DESC");
  }
  return db.getAllAsync<Snippet>(
    "SELECT * FROM snippets WHERE LOWER(language) = LOWER(?) ORDER BY id DESC",
    [language]
  );
};

export const searchSnippets = async (query: string): Promise<Snippet[]> => {
  const like = `%${query}%`;
  return db.getAllAsync<Snippet>(
    `SELECT * FROM snippets
     WHERE title LIKE ? OR language LIKE ? OR tags LIKE ? OR code LIKE ?
     ORDER BY id DESC`,
    [like, like, like, like]
  );
};

export const getSnippetById = async (id: number): Promise<Snippet | null> => {
  return db.getFirstAsync<Snippet>(
    "SELECT * FROM snippets WHERE id = ?",
    [id]
  );
};

export const getBookmarkedSnippets = async (): Promise<Snippet[]> => {
  return db.getAllAsync<Snippet>(
    "SELECT * FROM snippets WHERE is_bookmarked = 1 ORDER BY id DESC"
  );
};

export const toggleBookmark = async (
  id: number,
  current: number
): Promise<void> => {
  await db.runAsync(
    "UPDATE snippets SET is_bookmarked = ? WHERE id = ?",
    [current ? 0 : 1, id]
  );
};

export const deleteSnippet = async (id: number): Promise<void> => {
  await db.runAsync("DELETE FROM snippets WHERE id = ?", [id]);
};

type UpdateSnippetProps = {
  id: number;
  title: string;
  fileName: string;
  language: string;
  code: string;
  tags: string[];
};

export const updateSnippet = async ({
  id,
  title,
  fileName,
  language,
  code,
  tags,
}: UpdateSnippetProps) => {
  await db.runAsync(
    `UPDATE snippets
     SET title = ?, file_name = ?, language = ?, code = ?, tags = ?
     WHERE id = ?`,
    [title, fileName, language, code, JSON.stringify(tags), id]
  );
};
