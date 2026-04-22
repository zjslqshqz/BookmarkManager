<template>
  <div :style="{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100vh' }">
    <div :style="{ marginBottom: '16px' }">
      <h3 :style="{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 600 }">
        Tags
      </h3>
      <ModeSwitcher />
    </div>

    <div :style="{ marginBottom: '16px' }">
      <SearchBar />
    </div>

    <div :style="{ flex: 1, overflow: 'auto' }">
      <!-- Domain list in domain mode -->
      <template v-if="settingsStore.viewMode === 'domain'">
        <a-menu
          mode="inline"
          :selected-keys="settingsStore.viewMode === 'domain' && navigationStore.focusedGroupKey ? [navigationStore.focusedGroupKey] : []"
          :style="{ border: 'none' }"
        >
          <a-menu-item
            v-for="group in domainGroups"
            :key="group.domain"
            :style="{ height: 'auto', lineHeight: '32px' }"
            @click="navigationStore.focusGroup(group.domain)"
          >
            <div style="display: flex; align-items: center; gap: 8px;">
              <img
                v-if="group.favicon"
                :src="group.favicon"
                class="bookmark-favicon"
                alt=""
              />
              <span class="truncate" style="flex: 1;">{{ group.displayName }}</span>
              <a-badge
                :count="group.bookmarks.length"
                :number-style="{ backgroundColor: '#f0f0f0', color: '#595959', boxShadow: 'none' }"
              />
            </div>
          </a-menu-item>
        </a-menu>
      </template>

      <!-- Tag list in tag mode -->
      <template v-else-if="settingsStore.viewMode === 'tags'">
        <a-menu
          mode="inline"
          :selected-keys="settingsStore.viewMode === 'tags' && navigationStore.focusedGroupKey ? [navigationStore.focusedGroupKey] : []"
          :style="{ border: 'none' }"
        >
          <a-menu-item
            v-for="group in tagGroups"
            :key="group.category.id"
            :style="{ height: 'auto', lineHeight: '32px' }"
            @click="navigationStore.focusGroup(group.category.id)"
          >
            <div style="display: flex; align-items: center; gap: 8px;">
              <a-tag :color="group.category.color" :style="{ margin: 0 }">
                {{ group.category.name }}
              </a-tag>
              <span style="margin-left: auto;">
                <a-badge
                  :count="group.bookmarks.length"
                  :number-style="{ backgroundColor: '#f0f0f0', color: '#595959', boxShadow: 'none' }"
                />
              </span>
            </div>
          </a-menu-item>
        </a-menu>

        <a-button
          type="dashed"
          block
          :style="{ marginTop: '8px' }"
          @click="showTagEditor = true"
        >
          Manage Categories
        </a-button>
        <TagEditor v-model:open="showTagEditor" />
      </template>

      <!-- Folder list in folder mode -->
      <template v-else>
        <a-menu
          mode="inline"
          :selected-keys="navigationStore.focusedGroupKey ? [navigationStore.focusedGroupKey] : []"
          :style="{ border: 'none' }"
        >
          <a-menu-item
            v-for="group in folderGroups"
            :key="group.folderName"
            :style="{ height: 'auto', lineHeight: '32px' }"
            @click="navigationStore.focusGroup(group.folderName)"
          >
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="truncate" style="flex: 1;">{{ group.folderName }}</span>
              <a-badge
                :count="group.bookmarks.length"
                :number-style="{ backgroundColor: '#f0f0f0', color: '#595959', boxShadow: 'none' }"
              />
            </div>
          </a-menu-item>
        </a-menu>
      </template>
    </div>

    <div :style="{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '12px', display: 'flex', justifyContent: bookmarksStore.duplicateCount > 0 ? 'space-between' : 'center', alignItems: 'center' }">
      <a-statistic
        title="Total Bookmarks"
        :value="bookmarksStore.totalCount"
      />
      <a-statistic
        v-if="bookmarksStore.duplicateCount > 0"
        title="Duplicates"
        :value="bookmarksStore.duplicateCount"
        :value-style="{ color: '#fa8c16', cursor: 'pointer' }"
        @click="router.push('/duplicates')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModeSwitcher from './ModeSwitcher.vue';
import SearchBar from './SearchBar.vue';
import TagEditor from './TagEditor.vue';
import { useSettingsStore } from '../stores/settings';
import { useBookmarksStore } from '../stores/bookmarks';
import { useNavigationStore } from '../stores/navigation';
import { useDomainGroups } from '../composables/useDomainGroups';
import { useTagGroups } from '../composables/useTagGroups';
import { useFolderGroups } from '../composables/useFolderGroups';

const router = useRouter();
const settingsStore = useSettingsStore();
const bookmarksStore = useBookmarksStore();
const navigationStore = useNavigationStore();
const { domainGroups } = useDomainGroups();
const { tagGroups } = useTagGroups();
const { folderGroups } = useFolderGroups();

const showTagEditor = ref(false);
</script>
