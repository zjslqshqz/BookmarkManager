<template>
  <a-collapse-panel :key="groupKey">
    <template #header>
      <div class="group-header">
        <img v-if="favicon" :src="favicon" class="bookmark-favicon" alt="" />
        <a-tag v-if="tagColor" :color="tagColor" :style="{ margin: 0 }">
          {{ title }}
        </a-tag>
        <span v-else style="font-weight: 500;">{{ title }}</span>
        <span class="group-count">
          <a-badge
            :count="bookmarks.length"
            :number-style="{ backgroundColor: '#f0f0f0', color: '#595959', boxShadow: 'none' }"
          />
        </span>
      </div>
    </template>
    <template #extra>
      <a-button
        type="link"
        size="small"
        @click.stop="$emit('checkAll')"
      >
        {{ $t('bulk.checkUrls') }}
      </a-button>
    </template>
    <BookmarkCard
      v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
      :selectable="selectable"
      :selected="selectedIds.has(bookmark.id)"
      :tag-mode="tagMode"
      @select="$emit('select', $event)"
      @delete="$emit('delete', $event)"
      @check="$emit('check', $event)"
      @edit="$emit('edit', $event)"
    />
  </a-collapse-panel>
</template>

<script setup lang="ts">
import BookmarkCard from './BookmarkCard.vue';
import type { BookmarkItem } from '../types';

withDefaults(defineProps<{
  groupKey: string;
  title: string;
  favicon?: string;
  tagColor?: string;
  bookmarks: BookmarkItem[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  tagMode?: boolean;
}>(), {
  selectable: false,
  selectedIds: () => new Set(),
  favicon: '',
  tagColor: '',
  tagMode: false,
});

defineEmits<{
  select: [id: string];
  delete: [id: string];
  check: [url: string];
  edit: [bookmark: BookmarkItem];
  checkAll: [];
}>();
</script>
