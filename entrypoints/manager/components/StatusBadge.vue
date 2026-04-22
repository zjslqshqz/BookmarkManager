<template>
  <a-badge
    :status="badgeStatus"
    :text="showText ? statusText : undefined"
    :title="statusText"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { UrlStatusType } from '../types';

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
      return 'Valid';
    case 'redirect':
      return 'Redirect';
    case 'broken':
      return 'Broken';
    case 'server-error':
      return 'Server Error';
    case 'checking':
      return 'Checking...';
    case 'unchecked':
    default:
      return 'Not Checked';
  }
});
</script>
