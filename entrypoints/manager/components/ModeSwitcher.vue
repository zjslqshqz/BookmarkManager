<template>
  <a-segmented
    :value="settingsStore.viewMode"
    :options="options"
    block
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../stores/settings';
import type { ViewMode } from '../types';

const router = useRouter();
const settingsStore = useSettingsStore();

const options = [
  { label: 'By Domain', value: 'domain' },
  { label: 'By Tags', value: 'tags' },
  { label: 'By Folder', value: 'folder' },
];

async function handleChange(value: string | number) {
  const mode = value as ViewMode;
  await settingsStore.setViewMode(mode);
  router.push(`/${mode}`);
}
</script>
