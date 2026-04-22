<template>
  <a-badge
    :status="badgeStatus"
    :text="showText ? statusText : undefined"
    :title="statusText"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { UrlStatusType } from '../types';

const { t } = useI18n();

const props = withDefaults(defineProps<{
  status: UrlStatusType;
  showText?: boolean;
}>(), {
  showText: false,
});

const badgeStatus = computed(() => {
  switch (props.status) {
    case 'valid':
      return 'success';
    case 'redirect':
      return 'warning';
    case 'broken':
      return 'error';
    case 'server-error':
      return 'error';
    case 'checking':
      return 'processing';
    case 'unchecked':
    default:
      return 'default';
  }
});

const statusText = computed(() => {
  switch (props.status) {
    case 'valid':
      return t('status.valid');
    case 'redirect':
      return t('status.redirect');
    case 'broken':
      return t('status.broken');
    case 'server-error':
      return t('status.serverError');
    case 'checking':
      return t('status.checking');
    case 'unchecked':
    default:
      return t('status.notChecked');
  }
});
</script>
