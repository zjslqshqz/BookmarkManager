import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UrlStatus } from '../types';
import { requestUrlCheck, requestSingleUrlCheck, clearUrlCache, onMessage } from '../lib/messaging';

export const useUrlStatusStore = defineStore('urlStatus', () => {
  const statuses = ref<Record<string, UrlStatus>>({});
  const isChecking = ref(false);
  let removeListener: (() => void) | null = null;

  function setupListener() {
    if (removeListener) return;
    removeListener = onMessage((message) => {
      if (message.type === 'URL_STATUS_UPDATE') {
        statuses.value[message.url] = message.status;
      }
    });
  }

  async function loadCache() {
    try {
      const cache = await browser.storage.local.get('urlStatusCache');
      if (cache.urlStatusCache) {
        statuses.value = cache.urlStatusCache;
      }
    } catch {
      // Ignore cache load errors
    }
  }

  async function checkAll(urls: string[]) {
    isChecking.value = true;
    // Mark all as checking
    for (const url of urls) {
      if (!statuses.value[url] || statuses.value[url].status === 'unchecked') {
        statuses.value[url] = {
          url,
          status: 'checking',
        };
      }
    }
    await requestUrlCheck(urls);
  }

  async function checkOne(url: string) {
    statuses.value[url] = { url, status: 'checking' };
    const result = await requestSingleUrlCheck(url);
    statuses.value[url] = result;
    return result;
  }

  async function clearCache() {
    await clearUrlCache();
    statuses.value = {};
  }

  function getStatus(url: string): UrlStatus {
    return statuses.value[url] ?? { url, status: 'unchecked' };
  }

  function cleanup() {
    removeListener?.();
    removeListener = null;
  }

  return {
    statuses,
    isChecking,
    setupListener,
    loadCache,
    checkAll,
    checkOne,
    clearCache,
    getStatus,
    cleanup,
  };
});
