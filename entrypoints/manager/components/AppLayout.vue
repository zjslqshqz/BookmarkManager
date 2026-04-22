<template>
  <a-layout style="height: 100vh">
    <a-layout-sider
      :width="280"
      theme="light"
      :style="{ borderRight: '1px solid #f0f0f0', overflow: 'auto' }"
    >
      <AppSidebar />
    </a-layout-sider>
    <a-layout>
      <a-layout-content :style="{ padding: '24px', background: '#f5f5f5', overflow: 'auto' }">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import AppSidebar from './AppSidebar.vue';
</script>
