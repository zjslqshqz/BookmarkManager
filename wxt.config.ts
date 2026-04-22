import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: 'Tags — Bookmark Manager',
    description: 'Organize bookmarks by domain and keywords, check URL validity',
    version: '1.0.0',
    permissions: ['bookmarks', 'storage', 'alarms'],
  },
  webExt: {
    startUrls: ['chrome-extension://<id>/manager.html'],
  },
});
