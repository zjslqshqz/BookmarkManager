import { setupBookmarkListeners } from './bookmark-listener';
import {
  enqueueUrlsWithCacheCheck,
  checkSingleUrl,
  getCache,
  setCache,
} from './url-checker';
import { storage } from '#imports';

export default defineBackground(() => {
  // Set up bookmark change listeners
  setupBookmarkListeners();

  // Handle keepalive alarm (just needs to exist, no action required)
  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'url-checker-keepalive') {
      // Keepalive — no action needed, the alarm itself prevents termination
    }
  });

  // Message router
  browser.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return;

    switch (message.type) {
      case 'CHECK_URLS':
        enqueueUrlsWithCacheCheck(message.urls);
        sendResponse({ ok: true });
        break;

      case 'CHECK_SINGLE_URL':
        checkSingleUrl(message.url).then(async (result) => {
          const cache = await getCache();
          cache[message.url] = result;
          await setCache(cache);
          sendResponse(result);
        });
        return true; // async response

      case 'CLEAR_URL_CACHE':
        storage.setItem('local:urlStatusCache', {}).then(() => {
          sendResponse({ ok: true });
        });
        return true;

      default:
        break;
    }
  });
});
