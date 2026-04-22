<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-shrink: 0;">
      <h2 style="margin: 0;">Bookmarks by Domain</h2>
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

    <div style="flex: 1; overflow: auto;">
      <a-spin :spinning="bookmarksStore.loading">
        <a-empty v-if="domainGroups.length === 0 && !bookmarksStore.loading" description="No bookmarks found" />
        <a-collapse v-else v-model:activeKey="expandedKeys" :bordered="false">
          <BookmarkGroup
            v-for="group in domainGroups"
            :key="group.domain"
            :ref="(el: any) => setGroupRef(group.domain, el)"
            :group-key="group.domain"
            :title="group.displayName"
            :favicon="group.favicon"
            :bookmarks="group.bookmarks"
            :selectable="true"
            :selected-ids="selectedIds"
            @select="toggleSelect"
            @delete="handleDelete"
            @check="handleCheckUrl"
            @edit="handleEdit"
            @check-all="handleCheckGroup(group)"
          />
        </a-collapse>
      </a-spin>
    </div>

    <EditBookmarkModal v-model:open="showEditModal" :bookmark="editingBookmark" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { Modal } from 'ant-design-vue';
import BookmarkGroup from '../components/BookmarkGroup.vue';
import BulkActions from '../components/BulkActions.vue';
import EditBookmarkModal from '../components/EditBookmarkModal.vue';
import { useBookmarksStore } from '../stores/bookmarks';
import { useUrlStatusStore } from '../stores/urlStatus';
import { useNavigationStore } from '../stores/navigation';
import { useDomainGroups } from '../composables/useDomainGroups';
import { requestUrlCheck, requestSingleUrlCheck } from '../lib/messaging';
import type { BookmarkItem, DomainGroup } from '../types';

const bookmarksStore = useBookmarksStore();
const urlStatusStore = useUrlStatusStore();
const navigationStore = useNavigationStore();
const { domainGroups } = useDomainGroups();

const selectedIds = ref(new Set<string>());
const expandedKeys = ref<string[]>([]);
const showEditModal = ref(false);
const editingBookmark = ref<BookmarkItem | null>(null);

const groupRefs = new Map<string, any>();
function setGroupRef(key: string, el: any) {
  if (el) groupRefs.set(key, el);
  else groupRefs.delete(key);
}

watch(() => navigationStore.focusTrigger, () => {
  const key = navigationStore.focusedGroupKey;
  const action = navigationStore.focusAction;

  if (action === 'close') {
    // Toggle close: collapse all
    expandedKeys.value = [];
    return;
  }

  if (!key) return;

  // Step 1: close all panels first
  expandedKeys.value = [];

  // Step 2: wait for collapse animation to finish, then expand target and scroll
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

function handleEdit(bookmark: BookmarkItem) {
  editingBookmark.value = bookmark;
  showEditModal.value = true;
}

async function handleCheckGroup(group: DomainGroup) {
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
