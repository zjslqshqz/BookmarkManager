<template>
  <a-modal
    v-model:open="isOpen"
    :title="$t('settings.title')"
    :footer="null"
    width="400px"
  >
    <a-form layout="vertical" :style="{ marginTop: '16px' }">
      <a-form-item :label="$t('settings.language')">
        <a-select
          :value="settingsStore.locale"
          :options="localeOptions"
          @change="handleLocaleChange"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSettingsStore } from '../stores/settings';
import type { LocalePreference } from '../types';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const { t } = useI18n();
const settingsStore = useSettingsStore();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
});

const localeOptions = computed(() => [
  { value: 'auto', label: t('settings.auto') },
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '\u4e2d\u6587' },
]);

function handleLocaleChange(value: LocalePreference) {
  settingsStore.setLocale(value);
}
</script>
