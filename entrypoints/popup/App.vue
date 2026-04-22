<template>
  <div :style="{ width: '280px', padding: '16px', textAlign: 'center' }">
    <h3 :style="{ marginBottom: '12px' }">Tags — Bookmark Manager</h3>
    <a-button type="primary" block @click="openManager">
      Open Manager
    </a-button>
  </div>
</template>

<script setup lang="ts">
function openManager() {
  const url = browser.runtime.getURL('/manager.html');
  browser.tabs.create({ url });
  window.close();
}
</script>
