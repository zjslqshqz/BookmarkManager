import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { BookmarkItem } from '../types';
import { deduplicateBookmarks } from '../lib/duplicate-detector';

function flattenBookmarkTree(
  nodes: browser.Bookmarks.BookmarkTreeNode[],
  folderPath = '',
): BookmarkItem[] {
  const results: BookmarkItem[] = [];

  for (const node of nodes) {
    const currentPath = folderPath
      ? `${folderPath} > ${node.title}`
      : node.title;

    if (node.url) {
      results.push({
        id: node.id,
        title: node.title || node.url,
        url: node.url,
        dateAdded: node.dateAdded,
        parentId: node.parentId,
        folderPath: folderPath || 'Root',
      });
    }

    if (node.children) {
      results.push(...flattenBookmarkTree(node.children, currentPath));
    }
  }

  return results;
}

export const useBookmarksStore = defineStore('bookmarks', () => {
  const rawBookmarks = ref<BookmarkItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const dedupResult = computed(() => deduplicateBookmarks(rawBookmarks.value));
  const bookmarks = computed(() => dedupResult.value.bookmarks);
  const duplicateIds = computed(() => dedupResult.value.urlDuplicateIds);
  const totalCount = computed(() => bookmarks.value.length);
  const duplicateCount = computed(() => duplicateIds.value.size);

  async function fetchBookmarks() {
    loading.value = true;
    error.value = null;
    try {
      const tree = await browser.bookmarks.getTree();
      rawBookmarks.value = flattenBookmarkTree(tree);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch bookmarks';
    } finally {
      loading.value = false;
    }
  }

  async function removeBookmark(id: string) {
    await browser.bookmarks.remove(id);
    rawBookmarks.value = rawBookmarks.value.filter((b) => b.id !== id);
  }

  async function removeBookmarks(ids: string[]) {
    await Promise.all(ids.map((id) => browser.bookmarks.remove(id)));
    const idSet = new Set(ids);
    rawBookmarks.value = rawBookmarks.value.filter((b) => !idSet.has(b.id));
  }

  return {
    bookmarks,
    loading,
    error,
    totalCount,
    duplicateIds,
    duplicateCount,
    fetchBookmarks,
    removeBookmark,
    removeBookmarks,
  };
});
