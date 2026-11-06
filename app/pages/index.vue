<template>
  <div>
    <div class="page-header">
      <h1>Мои коллекции</h1>
      <button class="btn-primary" @click="showForm = true">
        + Добавить коллекцию
      </button>
    </div>

    <div v-if="collections.length === 0" class="empty">
      Пока нет коллекций. Добавь первую! ✨
    </div>

    <div v-else class="grid">
      <CollectionCard
        v-for="c in collections"
        :key="c.id"
        :collection="c"
      />
    </div>

    <CollectionForm
      v-if="showForm"
      @close="showForm = false"
      @save="onSave"
    />
  </div>
</template>

<script setup lang="ts">
import type { Collection } from '~/composables/useCollections'

const { collections, addCollection, loadFromStorage } = useCollections()
const showForm = ref(false)

onMounted(() => loadFromStorage())

const onSave = (data: { title: string; description: string; image: string | null }) => {
  addCollection(data)
  showForm.value = false
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.btn-primary {
  background: #4f46e5;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: background .15s;
}
.btn-primary:hover { background: #4338ca; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: #888;
  font-size: 16px;
}
</style>