import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ViewMode, LocalePreference } from '../types';
import { storage } from '#imports';
import { setAppLocale } from '../../i18n';

const VIEW_MODE_KEY = 'local:viewMode';
const LOCALE_KEY = 'local:locale';

export const useSettingsStore = defineStore('settings', () => {
  const viewMode = ref<ViewMode>('domain');
  const locale = ref<LocalePreference>('auto');

  async function load() {
    const savedMode = await storage.getItem<ViewMode>(VIEW_MODE_KEY);
    if (savedMode) {
      viewMode.value = savedMode;
    }

    const savedLocale = await storage.getItem<LocalePreference>(LOCALE_KEY);
    if (savedLocale) {
      locale.value = savedLocale;
      setAppLocale(savedLocale);
    }
  }

  async function setViewMode(mode: ViewMode) {
    viewMode.value = mode;
    await storage.setItem(VIEW_MODE_KEY, mode);
  }

  async function setLocale(newLocale: LocalePreference) {
    locale.value = newLocale;
    setAppLocale(newLocale);
    await storage.setItem(LOCALE_KEY, newLocale);
  }

  return {
    viewMode,
    locale,
    load,
    setViewMode,
    setLocale,
  };
});
