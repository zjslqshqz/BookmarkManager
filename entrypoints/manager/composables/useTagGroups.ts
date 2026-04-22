import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSearchStore } from '../stores/search';
import { useUserTagsStore } from '../stores/userTags';
import { useBookmarkTagsStore } from '../stores/bookmarkTags';
import { groupBookmarksByTags } from '../lib/keyword-matcher';
import type { TagGroup } from '../types';

export function useTagGroups() {
  const { t } = useI18n();
  const searchStore = useSearchStore();
  const userTagsStore = useUserTagsStore();
  const bookmarkTagsStore = useBookmarkTagsStore();

  const tagGroups = computed<TagGroup[]>(() => {
    const groupMap = groupBookmarksByTags(
      searchStore.filteredBookmarks,
      userTagsStore.categories,
      bookmarkTagsStore.additions,
      bookmarkTagsStore.exclusions,
    );

    const results: TagGroup[] = [];

    for (const [categoryId, bookmarks] of groupMap) {
      if (categoryId === 'uncategorized') {
        results.push({
          category: {
            id: 'uncategorized',
            name: t('category.uncategorized'),
            keywords: [],
            color: '#8c8c8c',
            icon: 'QuestionCircleOutlined',
            isPreset: false,
          },
          bookmarks,
        });
      } else {
        const category = userTagsStore.categories.find((c) => c.id === categoryId);
        if (category) {
          results.push({ category, bookmarks });
        }
      }
    }

    // Sort by bookmark count descending
    return results.sort((a, b) => b.bookmarks.length - a.bookmarks.length);
  });

  return { tagGroups };
}
