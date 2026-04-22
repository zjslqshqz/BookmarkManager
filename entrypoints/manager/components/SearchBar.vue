<template>
  <a-input-search
    v-model:value="searchStore.searchQuery"
    placeholder="Search bookmarks..."
    allow-clear
  />
</template>

<script setup lang="ts">
import { useSearchStore } from '../stores/search';

const searchStore = useSearchStore();
</script>
