<template>
  <a-input-search
    v-model:value="searchStore.searchQuery"
    :placeholder="$t('search.placeholder')"
    allow-clear
  />
</template>

<script setup lang="ts">
import { useSearchStore } from '../stores/search';

const searchStore = useSearchStore();
</script>
