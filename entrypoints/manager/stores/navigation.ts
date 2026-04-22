import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNavigationStore = defineStore('navigation', () => {
  const focusedGroupKey = ref<string | null>(null);
  const focusTrigger = ref(0);
  /** 'open' = expand and scroll, 'close' = collapse only */
  const focusAction = ref<'open' | 'close'>('open');

  function focusGroup(key: string) {
    if (focusedGroupKey.value === key) {
      // Same key clicked again: toggle close
      focusAction.value = 'close';
      focusedGroupKey.value = null;
    } else {
      focusAction.value = 'open';
      focusedGroupKey.value = key;
    }
    focusTrigger.value++;
  }

  return { focusedGroupKey, focusTrigger, focusAction, focusGroup };
});
