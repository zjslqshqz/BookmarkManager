<template>
  <a-modal
    v-model:open="isOpen"
    :title="$t('tagEditor.title')"
    :footer="null"
    width="600px"
  >
    <!-- Add new category -->
    <div style="display: flex; gap: 8px; align-items: center; margin-bottom: 16px;">
      <a-input v-model:value="newName" :placeholder="$t('tagEditor.categoryName')" style="width: 140px;" />
      <a-input v-model:value="newKeywords" :placeholder="$t('tagEditor.keywordsPlaceholder')" style="flex: 1;" />
      <div style="display: flex; gap: 2px; flex-shrink: 0; align-items: center;">
        <span
          v-for="c in colors"
          :key="c"
          :style="{
            width: '16px', height: '16px', borderRadius: '50%', backgroundColor: c,
            cursor: 'pointer', border: newColor === c ? '2px solid #333' : '2px solid transparent',
          }"
          @click="newColor = c"
        />
        <label
          :style="{
            width: '16px', height: '16px', borderRadius: '50%',
            background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
            cursor: 'pointer', border: isCustomNewColor ? '2px solid #333' : '2px solid transparent',
            position: 'relative', display: 'inline-block',
          }"
          :title="$t('tagEditor.customColor')"
        >
          <input
            type="color"
            :value="newColor"
            style="opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer;"
            @input="newColor = ($event.target as HTMLInputElement).value"
          />
        </label>
      </div>
      <a-button type="primary" :disabled="!newName.trim()" @click="handleAdd">
        {{ $t('common.add') }}
      </a-button>
    </div>

    <a-divider style="margin: 12px 0;" />

    <!-- Category list -->
    <div style="max-height: 400px; overflow: auto;">
      <div
        v-for="item in userTagsStore.categories"
        :key="item.id"
        style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"
      >
        <!-- View mode -->
        <template v-if="editingId !== item.id">
          <div style="display: flex; align-items: center; gap: 8px;">
            <a-tag :color="item.color" :style="{ margin: 0 }">{{ $t(`category.${item.id}`, item.name) }}</a-tag>
            <a-tag v-if="item.isPreset" :style="{ margin: 0, fontSize: '11px' }">{{ $t('tagEditor.preset') }}</a-tag>
            <span style="flex: 1;" />
            <a-button type="link" size="small" @click="startEdit(item)">{{ $t('common.edit') }}</a-button>
            <a-popconfirm
              :title="$t('tagEditor.deleteConfirm')"
              @confirm="userTagsStore.deleteCategory(item.id)"
            >
              <a-button type="link" danger size="small">{{ $t('common.delete') }}</a-button>
            </a-popconfirm>
          </div>
          <div style="color: #8c8c8c; font-size: 12px; margin-top: 4px; padding-left: 4px;">
            {{ item.keywords.join(', ') || $t('tagEditor.noKeywords') }}
          </div>
        </template>

        <!-- Edit mode -->
        <template v-else>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <a-input v-model:value="editForm.name" :placeholder="$t('tagEditor.namePlaceholder')" style="width: 140px;" />
              <a-input v-model:value="editForm.keywords" :placeholder="$t('tagEditor.keywordsPlaceholder')" style="flex: 1;" />
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <span style="font-size: 12px; color: #8c8c8c;">{{ $t('tagEditor.colorLabel') }}</span>
              <span
                v-for="c in colors"
                :key="c"
                :style="{
                  width: '18px', height: '18px', borderRadius: '50%', backgroundColor: c,
                  cursor: 'pointer', border: editForm.color === c ? '2px solid #333' : '2px solid transparent',
                }"
                @click="editForm.color = c"
              />
              <label
                :style="{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                  cursor: 'pointer', border: isCustomEditColor ? '2px solid #333' : '2px solid transparent',
                  position: 'relative', display: 'inline-block',
                }"
                :title="$t('tagEditor.customColor')"
              >
                <input
                  type="color"
                  :value="editForm.color"
                  style="opacity: 0; position: absolute; width: 100%; height: 100%; cursor: pointer;"
                  @input="editForm.color = ($event.target as HTMLInputElement).value"
                />
              </label>
              <span style="flex: 1;" />
              <a-button size="small" @click="editingId = null">{{ $t('common.cancel') }}</a-button>
              <a-button type="primary" size="small" :disabled="!editForm.name.trim()" @click="saveEdit(item.id)">
                {{ $t('common.save') }}
              </a-button>
            </div>
          </div>
        </template>
      </div>

      <a-empty
        v-if="userTagsStore.categories.length === 0"
        :description="$t('tagEditor.noCategories')"
        :style="{ padding: '24px 0' }"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useUserTagsStore } from '../stores/userTags';
import type { TagCategory } from '../types';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ 'update:open': [value: boolean] }>();

const userTagsStore = useUserTagsStore();

const isOpen = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val),
});

const colors = ['#1677ff', '#f5222d', '#fa8c16', '#722ed1', '#eb2f96', '#13c2c2', '#52c41a'];

// --- Add ---
const newName = ref('');
const newKeywords = ref('');
const newColor = ref(colors[0]);

// --- Edit ---
const editingId = ref<string | null>(null);
const editForm = reactive({
  name: '',
  keywords: '',
  color: '',
});

const isCustomNewColor = computed(() => !colors.includes(newColor.value));
const isCustomEditColor = computed(() => !colors.includes(editForm.color));

async function handleAdd() {
  if (!newName.value.trim()) return;

  const keywords = newKeywords.value
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  await userTagsStore.addCategory({
    name: newName.value.trim(),
    keywords,
    color: newColor.value,
    icon: 'TagOutlined',
  });

  newName.value = '';
  newKeywords.value = '';
  newColor.value = colors[(userTagsStore.categories.length) % colors.length];
}

function startEdit(item: TagCategory) {
  editingId.value = item.id;
  editForm.name = item.name;
  editForm.keywords = item.keywords.join(', ');
  editForm.color = item.color;
}

async function saveEdit(id: string) {
  if (!editForm.name.trim()) return;

  const keywords = editForm.keywords
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  await userTagsStore.updateCategory(id, {
    name: editForm.name.trim(),
    keywords,
    color: editForm.color,
  });

  editingId.value = null;
}
</script>
