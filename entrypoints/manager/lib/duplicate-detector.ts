import type { BookmarkItem } from '../types';

export interface DeduplicateResult {
  /** Deduplicated bookmarks (exact title+url duplicates removed, keeping first) */
  bookmarks: BookmarkItem[];
  /** IDs of bookmarks that share URL with another but have different titles */
  urlDuplicateIds: Set<string>;
}

export function deduplicateBookmarks(bookmarks: BookmarkItem[]): DeduplicateResult {
  // Phase 1: Remove exact duplicates (same title + same url), keep first occurrence
  const exactSeen = new Map<string, BookmarkItem>();
  const deduped: BookmarkItem[] = [];

  for (const b of bookmarks) {
    const exactKey = `${b.title}\0${b.url}`;
    if (!exactSeen.has(exactKey)) {
      exactSeen.set(exactKey, b);
      deduped.push(b);
    }
  }

  // Phase 2: Among remaining, find URL-only duplicates (same url, different titles)
  const urlMap = new Map<string, string[]>();
  for (const b of deduped) {
    const ids = urlMap.get(b.url);
    if (ids) {
      ids.push(b.id);
    } else {
      urlMap.set(b.url, [b.id]);
    }
  }

  const urlDuplicateIds = new Set<string>();
  for (const ids of urlMap.values()) {
    if (ids.length > 1) {
      for (const id of ids) {
        urlDuplicateIds.add(id);
      }
    }
  }

  return { bookmarks: deduped, urlDuplicateIds };
}
