import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ViewMode } from '../types';
import { storage } from '#imports';

const STORAGE_KEY = 'local:viewMode';

export const useSettingsStore = defineStore('settings', () => {
  const viewMode = ref<ViewMode>('domain');

  async function load() {
    const saved = await storage.getItem<ViewMode>(STORAGE_KEY);
    if (saved) {
      viewMode.value = saved;
    }
  }

  async function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
    await storage.setItem(STORAGE_KEY, mode);
  }

  return {
    viewMode,
    load,
    setViewMode,
  };
});
