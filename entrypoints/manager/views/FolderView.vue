<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0;">Bookmarks by Folder</h2>
      <a-space>
        <a-button @click="checkAllUrls">
          Check All URLs
        </a-button>
      </a-space>
    </div>

    <BulkActions
      :selected-ids="selectedIds"
      @check-selected="checkSelected"
      @delete-selected="deleteSelected"
      @clear-selection="selectedIds.clear()"
    />

    <a-spin :spinning="bookmarksStore.loading">
      <a-empty v-if="folderGroups.length === 0 && !bookmarksStore.loading" description="No bookmarks found" />
      <a-collapse v-else v-model:activeKey="expandedKeys" :bordered="false">
        <BookmarkGroup
          v-for="group in folderGroups"
          :key="group.folderName"
          :ref="(el: any) => setGroupRef(group.folderName, el)"
          :group-key="group.folderName"
          :title="group.folderName"
          :bookmarks="group.bookmarks"
          :selectable="true"
          :selected-ids="selectedIds"
          @select="toggleSelect"
          @delete="handleDelete"
          @check="handleCheckUrl"
          @check-all="handleCheckGroup(group)"
        />
      </a-collapse>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Modal } from 'ant-design-vue';
import BookmarkGroup from '../components/BookmarkGroup.vue';
import BulkActions from '../components/BulkActions.vue';
import { useBookmarksStore } from '../stores/bookmarks';
import { useUrlStatusStore } from '../stores/urlStatus';
import { useNavigationStore } from '../stores/navigation';
import { useFolderGroups } from '../composables/useFolderGroups';
import { requestUrlCheck, requestSingleUrlCheck } from '../lib/messaging';
import type { FolderGroup } from '../types';

const bookmarksStore = useBookmarksStore();
const urlStatusStore = useUrlStatusStore();
const navigationStore = useNavigationStore();
const { folderGroups } = useFolderGroups();

const selectedIds = ref(new Set<string>());
const expandedKeys = ref<string[]>([]);

const groupRefs = new Map<string, any>();
function setGroupRef(key: string, el: any) {
  if (el) groupRefs.set(key, el);
  else groupRefs.delete(key);
}

watch(() => navigationStore.focusTrigger, () => {
  const key = navigationStore.focusedGroupKey;
  const action = navigationStore.focusAction;

  if (action === 'close') {
    expandedKeys.value = [];
    return;
  }

  if (!key) return;

  expandedKeys.value = [];

  setTimeout(() => {
    expandedKeys.value = [key];
    nextTick(() => {
      const el = groupRefs.get(key);
      if (el?.$el) {
        el.$el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, 300);
});

function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
}

function handleDelete(id: string) {
  Modal.confirm({
    title: 'Delete bookmark?',
    content: 'This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    onOk: () => bookmarksStore.removeBookmark(id),
  });
}

async function handleCheckUrl(url: string) {
  await requestSingleUrlCheck(url);
}

async function handleCheckGroup(group: FolderGroup) {
  const urls = group.bookmarks.map((b) => b.url);
  await requestUrlCheck(urls);
}

async function checkAllUrls() {
  const urls = bookmarksStore.bookmarks.map((b) => b.url);
  await urlStatusStore.checkAll(urls);
}

async function checkSelected() {
  const urls = bookmarksStore.bookmarks
    .filter((b) => selectedIds.value.has(b.id))
    .map((b) => b.url);
  await requestUrlCheck(urls);
}

async function deleteSelected() {
  await bookmarksStore.removeBookmarks([...selectedIds.value]);
  selectedIds.value.clear();
}
</script>
