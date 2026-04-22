import type { BookmarkItem } from '../types';

export interface DeduplicateResult {
  /** Deduplicated bookmarks (exact title+url duplicates removed, keeping first) */
  bookmarks: BookmarkItem[];
  /** IDs of ALL bookmarks whose title+url combination appears more than once */
  exactDuplicateIds: Set<string>;
}

export function deduplicateBookmarks(bookmarks: BookmarkItem[]): DeduplicateResult {
  // Count occurrences of each title+url combination
  const keyToIds = new Map<string, string[]>();
  for (const b of bookmarks) {
    const key = `${b.title}\0${b.url}`;
    const ids = keyToIds.get(key);
    if (ids) {
      ids.push(b.id);
    } else {
      keyToIds.set(key, [b.id]);
    }
  }

  // Collect IDs where the combination appears 2+ times
  const exactDuplicateIds = new Set<string>();
  for (const ids of keyToIds.values()) {
    if (ids.length > 1) {
      for (const id of ids) {
        exactDuplicateIds.add(id);
      }
    }
  }

  // Remove exact duplicates from main list, keeping first occurrence
  const seen = new Set<string>();
  const deduped: BookmarkItem[] = [];
  for (const b of bookmarks) {
    const key = `${b.title}\0${b.url}`;
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(b);
    }
  }

  return { bookmarks: deduped, exactDuplicateIds };
}
