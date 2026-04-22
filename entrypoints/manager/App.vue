<template>
  <AppLayout />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import AppLayout from './components/AppLayout.vue';
import { useBookmarksStore } from './stores/bookmarks';
import { useSettingsStore } from './stores/settings';
import { useUserTagsStore } from './stores/userTags';
import { useUrlStatusStore } from './stores/urlStatus';
import { useBookmarkTagsStore } from './stores/bookmarkTags';
import { onMessage } from './lib/messaging';

const bookmarksStore = useBookmarksStore();
const settingsStore = useSettingsStore();
const userTagsStore = useUserTagsStore();
const urlStatusStore = useUrlStatusStore();
const bookmarkTagsStore = useBookmarkTagsStore();

onMounted(async () => {
  // Load persisted settings
  await Promise.all([
    settingsStore.load(),
    userTagsStore.load(),
    urlStatusStore.loadCache(),
    bookmarkTagsStore.load(),
  ]);

  // Set up message listener for live updates
  urlStatusStore.setupListener();

  // Listen for bookmark changes
  onMessage((message) => {
    if (message.type === 'BOOKMARK_CHANGED') {
      bookmarksStore.fetchBookmarks();
    }
  });

  // Fetch bookmarks
  await bookmarksStore.fetchBookmarks();
});
</script>
