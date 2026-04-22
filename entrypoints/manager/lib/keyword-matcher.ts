import type { BookmarkItem, TagCategory } from '../types';

export interface MatchResult {
  categoryId: string;
  bookmarks: BookmarkItem[];
}

export function matchBookmarkToCategories(
  bookmark: BookmarkItem,
  categories: TagCategory[],
): string[] {
  const searchString = `${bookmark.title} ${bookmark.url}`.toLowerCase();
  const matchedIds: string[] = [];

  for (const category of categories) {
    for (const keyword of category.keywords) {
      if (searchString.includes(keyword.toLowerCase())) {
        matchedIds.push(category.id);
        break;
      }
    }
  }

  return matchedIds;
}

export function getEffectiveTagIds(
  bookmark: BookmarkItem,
  categories: TagCategory[],
  manualAdditions: string[],
  manualExclusions: string[],
): string[] {
  const autoMatched = matchBookmarkToCategories(bookmark, categories);
  const result = new Set([...autoMatched, ...manualAdditions]);
  for (const id of manualExclusions) {
    result.delete(id);
  }
  return Array.from(result);
}

export function groupBookmarksByTags(
  bookmarks: BookmarkItem[],
  categories: TagCategory[],
  manualAdditions?: Record<string, string[]>,
  manualExclusions?: Record<string, string[]>,
): Map<string, BookmarkItem[]> {
  const groups = new Map<string, BookmarkItem[]>();

  // Initialize groups for all categories
  for (const cat of categories) {
    groups.set(cat.id, []);
  }
  groups.set('uncategorized', []);

  for (const bookmark of bookmarks) {
    const additions = manualAdditions?.[bookmark.id] || [];
    const exclusions = manualExclusions?.[bookmark.id] || [];
    const effectiveIds = getEffectiveTagIds(
      bookmark,
      categories,
      additions,
      exclusions,
    );

    if (effectiveIds.length === 0) {
      groups.get('uncategorized')!.push(bookmark);
    } else {
      for (const id of effectiveIds) {
        if (groups.has(id)) {
          groups.get(id)!.push(bookmark);
        }
      }
    }
  }

  // Remove empty groups (except uncategorized if it has items)
  for (const [key, value] of groups) {
    if (value.length === 0) {
      groups.delete(key);
    }
  }

  return groups;
}
