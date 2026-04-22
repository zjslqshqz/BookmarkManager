<template>
  <a-card
    size="small"
    hoverable
    :style="{ marginBottom: '8px' }"
    :body-style="{ padding: '12px' }"
  >
    <div style="display: flex; align-items: center; gap: 10px;">
      <a-checkbox
        v-if="selectable"
        :checked="selected"
        @change="$emit('select', bookmark.id)"
      />
      <img
        :src="favicon"
        class="bookmark-favicon"
        alt=""
        @error="onFaviconError"
      />
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <a
            :href="bookmark.url"
            target="_blank"
            rel="noopener noreferrer"
            class="truncate"
            style="font-weight: 500; color: #262626; text-decoration: none; flex: 1;"
            :title="bookmark.title"
          >
            {{ bookmark.title }}
          </a>
          <StatusBadge :status="urlStatus.status" />
          <a-tooltip v-if="isDuplicate" :title="$t('bookmark.duplicateTooltip', { titles: duplicateTitles })">
            <a-tag color="orange" :style="{ margin: 0, fontSize: '11px', lineHeight: '18px' }">
              {{ $t('bookmark.duplicate') }}
            </a-tag>
          </a-tooltip>
        </div>
        <div class="bookmark-url truncate" :title="bookmark.url">
          {{ bookmark.url }}
        </div>
        <div v-if="showFolder" style="color: #bfbfbf; font-size: 11px; margin-top: 2px;">
          {{ bookmark.folderPath }}
        </div>
        <div v-if="tagMode" style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; align-items: center;">
          <a-tag
            v-for="tag in assignedTags"
            :key="tag.id"
            :color="tag.color"
            closable
            :style="{ margin: 0, fontSize: '11px', lineHeight: '18px' }"
            @close.prevent="handleRemoveTag(tag.id)"
          >
            {{ $t(`category.${tag.id}`, tag.name) }}
          </a-tag>
          <a-popover trigger="click" placement="bottomLeft">
            <template #content>
              <div style="max-height: 240px; overflow: auto; min-width: 160px;">
                <div
                  v-for="cat in allCategories"
                  :key="cat.id"
                  style="padding: 4px 0; cursor: pointer;"
                >
                  <a-checkbox
                    :checked="isTagged(cat.id)"
                    @change="toggleTag(cat.id)"
                  >
                    <a-tag :color="cat.color" :style="{ margin: 0 }">{{ $t(`category.${cat.id}`, cat.name) }}</a-tag>
                  </a-checkbox>
                </div>
              </div>
            </template>
            <a-tag
              :style="{ margin: 0, cursor: 'pointer', borderStyle: 'dashed', fontSize: '11px', lineHeight: '18px' }"
            >
              <PlusOutlined /> {{ $t('bookmark.tag') }}
            </a-tag>
          </a-popover>
        </div>
      </div>
      <a-dropdown :trigger="['click']">
        <a-button type="text" size="small">
          <template #icon>
            <MoreOutlined />
          </template>
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item key="open" @click="openBookmark">
              {{ $t('bookmark.open') }}
            </a-menu-item>
            <a-menu-item key="check" @click="$emit('check', bookmark.url)">
              {{ $t('bookmark.checkUrl') }}
            </a-menu-item>
            <a-menu-item key="copy" @click="copyUrl">
              {{ $t('bookmark.copyUrl') }}
            </a-menu-item>
            <a-menu-item key="edit" @click="$emit('edit', bookmark)">
              {{ $t('common.edit') }}
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="delete" danger @click="$emit('delete', bookmark.id)">
              {{ $t('common.delete') }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MoreOutlined, PlusOutlined } from '@ant-design/icons-vue';
import StatusBadge from './StatusBadge.vue';
import { useUrlStatusStore } from '../stores/urlStatus';
import { useBookmarksStore } from '../stores/bookmarks';
import { useBookmarkTagsStore } from '../stores/bookmarkTags';
import { useUserTagsStore } from '../stores/userTags';
import { extractDomain } from '../lib/domain-extractor';
import { matchBookmarkToCategories } from '../lib/keyword-matcher';
import type { BookmarkItem, TagCategory } from '../types';
import { message } from 'ant-design-vue';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  bookmark: BookmarkItem;
  selectable?: boolean;
  selected?: boolean;
  showFolder?: boolean;
  tagMode?: boolean;
}>(), {
  selectable: false,
  selected: false,
  showFolder: true,
  tagMode: false,
});

defineEmits<{
  select: [id: string];
  delete: [id: string];
  check: [url: string];
  edit: [bookmark: BookmarkItem];
}>();

const urlStatusStore = useUrlStatusStore();
const bookmarksStore = useBookmarksStore();
const bookmarkTagsStore = useBookmarkTagsStore();
const userTagsStore = useUserTagsStore();

const urlStatus = computed(() => urlStatusStore.getStatus(props.bookmark.url));

const isDuplicate = computed(() => bookmarksStore.duplicateIds.has(props.bookmark.id));

const duplicateTitles = computed(() => {
  if (!isDuplicate.value) return '';
  return bookmarksStore.duplicateBookmarks
    .filter(b => b.url === props.bookmark.url && b.title === props.bookmark.title && b.id !== props.bookmark.id)
    .map(b => `"${b.title}" (${b.folderPath})`)
    .join(', ');
});

const domainInfo = computed(() => extractDomain(props.bookmark.url));
const defaultFavicon = ref(false);

const favicon = computed(() => {
  if (defaultFavicon.value || !domainInfo.value?.favicon) {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="%23e8e8e8"/></svg>';
  }
  return domainInfo.value.favicon;
});

function onFaviconError() {
  defaultFavicon.value = true;
}

function openBookmark() {
  window.open(props.bookmark.url, '_blank');
}

async function copyUrl() {
  await navigator.clipboard.writeText(props.bookmark.url);
  message.success(t('bookmark.urlCopied'));
}

// --- Tag management (only used when tagMode=true) ---

const allCategories = computed<TagCategory[]>(() => userTagsStore.categories);

const effectiveTagIds = computed<Set<string>>(() => {
  if (!props.tagMode) return new Set();
  const autoMatched = matchBookmarkToCategories(props.bookmark, allCategories.value);
  const additions = bookmarkTagsStore.getManualAdditions(props.bookmark.id);
  const exclusions = bookmarkTagsStore.getExclusions(props.bookmark.id);
  const result = new Set([...autoMatched, ...additions]);
  for (const id of exclusions) result.delete(id);
  return result;
});

const assignedTags = computed<TagCategory[]>(() => {
  if (!props.tagMode) return [];
  return allCategories.value.filter((c) => effectiveTagIds.value.has(c.id));
});

function isTagged(categoryId: string): boolean {
  return effectiveTagIds.value.has(categoryId);
}

function toggleTag(categoryId: string) {
  if (isTagged(categoryId)) {
    bookmarkTagsStore.removeTag(props.bookmark.id, categoryId);
  } else {
    bookmarkTagsStore.addTag(props.bookmark.id, categoryId);
  }
}

function handleRemoveTag(categoryId: string) {
  bookmarkTagsStore.removeTag(props.bookmark.id, categoryId);
}
</script>
