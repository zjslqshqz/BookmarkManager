<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-shrink: 0;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <a-button type="text" @click="goBack">
          <template #icon>
            <ArrowLeftOutlined />
          </template>
        </a-button>
        <h2 style="margin: 0;">{{ $t('duplicates.title') }}</h2>
        <a-tag color="orange">{{ duplicateBookmarks.length }}</a-tag>
      </div>
    </div>

    <BulkActions
      :selected-ids="selectedIds"
      @check-selected="checkSelected"
      @delete-selected="deleteSelected"
      @clear-selection="selectedIds.clear()"
    />

    <div style="flex: 1; overflow: auto;">
      <a-spin :spinning="bookmarksStore.loading">
        <a-empty
          v-if="duplicateBookmarks.length === 0 && !bookmarksStore.loading"
          :description="$t('duplicates.noBookmarks')"
        />
        <div v-else>
          <BookmarkCard
            v-for="bookmark in duplicateBookmarks"
            :key="bookmark.id"
            :bookmark="bookmark"
            :selectable="true"
            :selected="selectedIds.has(bookmark.id)"
            :show-folder="true"
            @select="toggleSelect"
            @delete="handleDelete"
            @check="handleCheckUrl"
            @edit="handleEdit"
          />
        </div>
      </a-spin>
    </div>

    <EditBookmarkModal v-model:open="showEditModal" :bookmark="editingBookmark" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { Modal } from 'ant-design-vue';
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import BookmarkCard from '../components/BookmarkCard.vue';
import BulkActions from '../components/BulkActions.vue';
import EditBookmarkModal from '../components/EditBookmarkModal.vue';
import { useBookmarksStore } from '../stores/bookmarks';
import { requestUrlCheck, requestSingleUrlCheck } from '../lib/messaging';
import type { BookmarkItem } from '../types';

const { t } = useI18n();
const router = useRouter();
const bookmarksStore = useBookmarksStore();

const duplicateBookmarks = computed(() => bookmarksStore.duplicateBookmarks);

const selectedIds = ref(new Set<string>());
const showEditModal = ref(false);
const editingBookmark = ref<BookmarkItem | null>(null);

function goBack() {
  router.back();
}

function toggleSelect(id: string) {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id);
  } else {
    selectedIds.value.add(id);
  }
}

function handleDelete(id: string) {
  Modal.confirm({
    title: t('common.deleteConfirmTitle'),
    content: t('common.deleteConfirmContent'),
    okText: t('common.delete'),
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
