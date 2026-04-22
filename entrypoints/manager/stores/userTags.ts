import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TagCategory } from '../types';
import { presetCategories } from '../lib/preset-categories';
import { storage } from '#imports';

const STORAGE_KEY = 'local:userTagCategories';

export const useUserTagsStore = defineStore('userTags', () => {
  const categories = ref<TagCategory[]>([]);

  async function load() {
    const saved = await storage.getItem<TagCategory[]>(STORAGE_KEY);
    if (saved && saved.length > 0) {
      categories.value = saved;
      // Merge in any missing preset categories (e.g. new presets added in code update)
      let changed = false;
      for (const preset of presetCategories) {
        if (!categories.value.some((c) => c.id === preset.id)) {
          categories.value.push({ ...preset });
          changed = true;
        }
      }
      if (changed) await save();
    } else {
      // First load: initialize with preset categories
      categories.value = presetCategories.map((c) => ({ ...c }));
      await save();
    }
  }

  async function save() {
    await storage.setItem(STORAGE_KEY, categories.value);
  }

  async function addCategory(category: Omit<TagCategory, 'id' | 'isPreset'>) {
    const newCategory: TagCategory = {
      ...category,
      id: `user-${Date.now()}`,
      isPreset: false,
    };
    categories.value.push(newCategory);
    await save();
  }

  async function updateCategory(id: string, updates: Partial<TagCategory>) {
    const index = categories.value.findIndex((c) => c.id === id);
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates };
      await save();
    }
  }

  async function deleteCategory(id: string) {
    categories.value = categories.value.filter((c) => c.id !== id);
    await save();
  }

  return {
    categories,
    load,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
