<template>
  <a-modal
    :open="open"
    title="Edit Bookmark"
    :confirm-loading="saving"
    @ok="handleOk"
    @cancel="$emit('update:open', false)"
  >
    <a-form layout="vertical" :style="{ marginTop: '16px' }">
      <a-form-item label="Title">
        <a-input v-model:value="editTitle" />
      </a-form-item>
      <a-form-item label="URL">
        <a-input v-model:value="editUrl" />
      </a-form-item>
      <a-form-item label="Folder">
        <a-tree-select
          v-model:value="editParentId"
          :tree-data="folderTreeData"
          tree-default-expand-all
          placeholder="Select folder"
          :style="{ width: '100%' }"
          :field-names="{ label: 'title', value: 'id', children: 'children' }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useBookmarksStore } from '../stores/bookmarks';
import type { BookmarkItem, FolderTreeNode } from '../types';

const props = defineProps<{
  open: boolean;
  bookmark: BookmarkItem | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const bookmarksStore = useBookmarksStore();

const editTitle = ref('');
const editUrl = ref('');
const editParentId = ref<string | undefined>(undefined);
const folderTreeData = ref<FolderTreeNode[]>([]);
const saving = ref(false);

watch(
  () => props.open,
  async (val) => {
    if (val && props.bookmark) {
      editTitle.value = props.bookmark.title;
      editUrl.value = props.bookmark.url;
      editParentId.value = props.bookmark.parentId;
      folderTreeData.value = await bookmarksStore.getFolderTree();
    }
  },
);

async function handleOk() {
  if (!props.bookmark) return;

  const changes: { title?: string; url?: string; parentId?: string } = {};
  if (editTitle.value !== props.bookmark.title) {
    changes.title = editTitle.value;
  }
  if (editUrl.value !== props.bookmark.url) {
    changes.url = editUrl.value;
  }
  if (editParentId.value && editParentId.value !== props.bookmark.parentId) {
    changes.parentId = editParentId.value;
  }

  if (Object.keys(changes).length === 0) {
    emit('update:open', false);
    return;
  }

  saving.value = true;
  try {
    await bookmarksStore.updateBookmark(props.bookmark.id, changes);
    message.success('Bookmark updated');
    emit('update:open', false);
  } catch (e) {
    message.error(e instanceof Error ? e.message : 'Failed to update bookmark');
  } finally {
    saving.value = false;
  }
}
</script>
