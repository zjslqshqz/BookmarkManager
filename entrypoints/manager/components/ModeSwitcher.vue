<template>
  <a-segmented
    :value="settingsStore.viewMode"
    :options="options"
    block
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../stores/settings';
import type { ViewMode } from '../types';

const { t } = useI18n();
const router = useRouter();
const settingsStore = useSettingsStore();

const options = computed(() => [
  { label: t('mode.byDomain'), value: 'domain' },
  { label: t('mode.byTags'), value: 'tags' },
  { label: t('mode.byFolder'), value: 'folder' },
]);

async function handleChange(value: string | number) {
  const mode = value as ViewMode;
  await settingsStore.setViewMode(mode);
  router.push(`/${mode}`);
}
</script>
