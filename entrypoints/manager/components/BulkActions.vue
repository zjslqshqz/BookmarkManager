<template>
  <a-space v-if="selectedIds.size > 0" :style="{ marginBottom: '16px' }">
    <span>{{ $t('bulk.selected', { count: selectedIds.size }) }}</span>
    <a-button size="small" @click="$emit('checkSelected')">
      {{ $t('bulk.checkUrls') }}
    </a-button>
    <a-popconfirm
      :title="$t('bulk.deleteConfirm')"
      :ok-text="$t('common.delete')"
      ok-type="danger"
      @confirm="$emit('deleteSelected')"
    >
      <a-button size="small" danger>
        {{ $t('common.delete') }}
      </a-button>
    </a-popconfirm>
    <a-button size="small" @click="$emit('clearSelection')">
      {{ $t('bulk.clear') }}
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
