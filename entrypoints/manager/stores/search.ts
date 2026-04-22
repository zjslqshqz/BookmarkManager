import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useBookmarksStore } from './bookmarks';
import type { BookmarkItem } from '../types';

export const useSearchStore = defineStore('search', () => {
  const searchQuery = ref('');
  const debouncedQuery = ref('');
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  watch(searchQuery, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val;
    }, 300);
  });

  const filteredBookmarks = computed<BookmarkItem[]>(() => {
    const bookmarksStore = useBookmarksStore();
    const query = debouncedQuery.value.toLowerCase().trim();
    if (!query) return bookmarksStore.bookmarks;
    return bookmarksStore.bookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query),
    );
  });

  return {
    searchQuery,
    debouncedQuery,
    filteredBookmarks,
  };
});
