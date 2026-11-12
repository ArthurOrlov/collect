<template>
  <div class="item-card">
    <div class="item-image" @click="openImage" style="cursor: zoom-in;">
      <img v-if="item.image_url" :src="item.image_url" :alt="item.title" />
      <div v-else class="placeholder">🖼️</div>
    </div>
    <div class="item-body">
      <h3>{{ item.title }}</h3>
      <p v-if="item.description">{{ item.description }}</p>
    </div>
    
    <div v-if="user" class="item-actions">
      <button class="btn-edit" @click="$emit('edit', item)">Изменить</button>
      <button class="btn-delete" @click="openConfirm">Удалить</button>
    </div>

    <ImageModal
      v-if="isImageOpen && item.image_url"
      :image-url="item.image_url"
      @close="isImageOpen = false"
    />

    <ConfirmModal
      v-if="isConfirmOpen"
      @cancel="isConfirmOpen = false"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import type { Item } from '~/composables/useItems'

const props = defineProps<{ item: Item }>()
const emit = defineEmits<{
  edit: [item: Item]
  delete: [id: string]
}>()

const user = useSupabaseUser()
const isImageOpen = ref(false)
const isConfirmOpen = ref(false)

const openImage = () => {
  if (props.item.image_url) {
    isImageOpen.value = true
  }
}

const openConfirm = () => {
  isConfirmOpen.value = true
}

const handleConfirmDelete = () => {
  emit('delete', props.item.id)
  isConfirmOpen.value = false
}
</script>

<style scoped>
.item-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
}

.item-image {
  height: 200px;
  background: #eef1f7;
}
.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.2s;
}
.item-image:hover img {
  opacity: 0.9;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.item-body {
  padding: 16px;
  flex-grow: 1;
}
.item-body h3 {
  font-size: 18px;
  margin-bottom: 8px;
}
.item-body p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.item-actions {
  display: flex;
  border-top: 1px solid #eee;
}
.item-actions button {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-edit { color: #4f46e5; }
.btn-edit:hover { background: #f3f4f6; }
.btn-delete { color: #dc2626; border-left: 1px solid #eee; }
.btn-delete:hover { background: #fef2f2; }
</style>