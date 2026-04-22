<template>
  <a-space v-if="selectedIds.size > 0" :style="{ marginBottom: '16px' }">
    <span>{{ selectedIds.size }} selected</span>
    <a-button size="small" @click="$emit('checkSelected')">
      Check URLs
    </a-button>
    <a-popconfirm
      title="Delete selected bookmarks?"
      ok-text="Delete"
      ok-type="danger"
      @confirm="$emit('deleteSelected')"
    >
      <a-button size="small" danger>
        Delete
      </a-button>
    </a-popconfirm>
    <a-button size="small" @click="$emit('clearSelection')">
      Clear
    </a-button>
  </a-space>
</template>

<script setup lang="ts">
defineProps<{
  selectedIds: Set<string>;
}>();

defineEmits<{
  checkSelected: [];
  deleteSelected: [];
  clearSelection: [];
}>();
</script>
