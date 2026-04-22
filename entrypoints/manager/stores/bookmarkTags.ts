import { defineStore } from 'pinia';
import { ref } from 'vue';
import { storage } from '#imports';

const STORAGE_KEY = 'local:bookmarkManualTags';

interface ManualTagData {
  additions: Record<string, string[]>;
  exclusions: Record<string, string[]>;
}

export const useBookmarkTagsStore = defineStore('bookmarkTags', () => {
  /** bookmark ID → manually added category IDs */
  const additions = ref<Record<string, string[]>>({});
  /** bookmark ID → manually excluded category IDs (override auto-match) */
  const exclusions = ref<Record<string, string[]>>({});

  async function load() {
    const saved = await storage.getItem<ManualTagData>(STORAGE_KEY);
    if (saved) {
      additions.value = saved.additions || {};
      exclusions.value = saved.exclusions || {};
    }
  }

  async function save() {
    await storage.setItem(STORAGE_KEY, {
      additions: additions.value,
      exclusions: exclusions.value,
    });
  }

  function addTag(bookmarkId: string, categoryId: string) {
    // Remove from exclusions if it was excluded
    if (exclusions.value[bookmarkId]) {
      exclusions.value[bookmarkId] = exclusions.value[bookmarkId].filter(
        (id) => id !== categoryId,
      );
      if (exclusions.value[bookmarkId].length === 0) {
        delete exclusions.value[bookmarkId];
      }
    }
    // Add to manual additions
    if (!additions.value[bookmarkId]) {
      additions.value[bookmarkId] = [];
    }
    if (!additions.value[bookmarkId].includes(categoryId)) {
      additions.value[bookmarkId].push(categoryId);
    }
    save();
  }

  function removeTag(bookmarkId: string, categoryId: string) {
    // If it was a manual addition, just remove it
    if (additions.value[bookmarkId]) {
      const idx = additions.value[bookmarkId].indexOf(categoryId);
      if (idx !== -1) {
        additions.value[bookmarkId].splice(idx, 1);
        if (additions.value[bookmarkId].length === 0) {
          delete additions.value[bookmarkId];
        }
        save();
        return;
      }
    }
    // Otherwise, add to exclusions (override auto-match)
    if (!exclusions.value[bookmarkId]) {
      exclusions.value[bookmarkId] = [];
    }
    if (!exclusions.value[bookmarkId].includes(categoryId)) {
      exclusions.value[bookmarkId].push(categoryId);
    }
    save();
  }

  function getManualAdditions(bookmarkId: string): string[] {
    return additions.value[bookmarkId] || [];
  }

  function getExclusions(bookmarkId: string): string[] {
    return exclusions.value[bookmarkId] || [];
  }

  return {
    additions,
    exclusions,
    load,
    addTag,
    removeTag,
    getManualAdditions,
    getExclusions,
  };
});
