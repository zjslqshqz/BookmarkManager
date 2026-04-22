import { computed } from 'vue';
import { useSearchStore } from '../stores/search';
import type { FolderGroup } from '../types';

export function useFolderGroups() {
  const searchStore = useSearchStore();

  const folderGroups = computed<FolderGroup[]>(() => {
    const groupMap = new Map<string, FolderGroup>();

    for (const bookmark of searchStore.filteredBookmarks) {
      const parts = bookmark.folderPath.split(' > ');
      const folderName = parts[parts.length - 1] || 'Root';

      const existing = groupMap.get(folderName);
      if (existing) {
        existing.bookmarks.push(bookmark);
      } else {
        groupMap.set(folderName, {
          folderName,
          bookmarks: [bookmark],
        });
      }
    }

    // Sort by bookmark count descending
    return Array.from(groupMap.values()).sort(
      (a, b) => b.bookmarks.length - a.bookmarks.length,
    );
  });

  return { folderGroups };
}
