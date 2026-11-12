<template>
  <div v-if="collection">
    <NuxtLink to="/" class="back">← Назад ко всем коллекциям</NuxtLink>

    <div class="collection-header">
      <div class="collection-image">
        <img v-if="collection.image_url" :src="collection.image_url" :alt="collection.title" />
        <div v-else class="placeholder">📦</div>
      </div>
      <div class="collection-info">
        <h1>{{ collection.title }}</h1>
        <p class="desc">{{ collection.description || 'Без описания' }}</p>
        <p class="date">Создано: {{ formatDate(collection.created_at) }}</p>
      </div>
    </div>

    <div class="items-section">
      <div class="items-header">
        <h2>Предметы в коллекции</h2>
        <button v-if="user" class="btn-primary" @click="openCreateForm">
          + Добавить предмет
        </button>
      </div>

      <div v-if="items.length === 0" class="empty">
        В этой коллекции пока нет предметов.
      </div>

      <div v-else class="grid">
        <ItemCard
          v-for="item in items"
          :key="item.id"
          :item="item"
          @edit="openEditForm"
          @delete="onDelete"
        />
      </div>
    </div>

    <ItemForm
      v-if="showForm"
      :item-to-edit="itemToEdit"
      @close="closeForm"
      @save="onSave"
    />
  </div>

  <div v-else class="not-found">
    Коллекция не найдена
  </div>
</template>

<script setup lang="ts">
import type { Collection } from '~/composables/useCollections'
import type { Item } from '~/composables/useItems'

const route = useRoute()
const { fetchCollectionById } = useCollections()
const { items, fetchItems, addItem, updateItem, deleteItem } = useItems()
const user = useSupabaseUser()
const collection = ref<Collection | null>(null)
const showForm = ref(false)
const itemToEdit = ref<Item | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  collection.value = await fetchCollectionById(id)
  
  if (collection.value) {
    await fetchItems(id)
  }
})

const openCreateForm = () => {
  itemToEdit.value = null
  showForm.value = true
}

const openEditForm = (item: Item) => {
  itemToEdit.value = item
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  itemToEdit.value = null
}

const onSave = async (data: { title: string; description: string; imageFile: File | null }) => {
  if (!collection.value) return
  
  let success = false

  if (itemToEdit.value) {
    success = !!(await updateItem(itemToEdit.value.id, collection.value.id, {
      ...data,
      currentImageUrl: itemToEdit.value.image_url
    }))
  } else {
    success = !!(await addItem(collection.value.id, data))
  }
  
  if (success) {
    closeForm()
  }
}

const onDelete = async (id: string) => {
  if (!collection.value) return
  await deleteItem(id, collection.value.id)
}

const formatDate = (ts: string) => 
  new Date(ts).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
</script>

<style scoped>
.back {
  display: inline-block;
  margin-bottom: 20px;
  color: #4f46e5;
  text-decoration: none;
  font-weight: 600;
}

.collection-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  margin-bottom: 40px;
}

.collection-image {
  height: 100%;
  min-height: 250px;
  background: #eef1f7;
}
.collection-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
}

.collection-info {
  padding: 32px 32px 32px 0;
}
.collection-info h1 {
  font-size: 28px;
  margin-bottom: 12px;
}
.desc {
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
}
.date {
  font-size: 13px;
  color: #999;
}

.items-section {
  margin-top: 20px;
}
.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.items-header h2 {
  font-size: 22px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.empty {
  text-align: center;
  padding: 40px 0;
  color: #888;
  background: #fff;
  border-radius: 12px;
}

.not-found {
  text-align: center;
  padding: 80px 0;
  color: #888;
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

@media (max-width: 700px) {
  .collection-header { grid-template-columns: 1fr; }
  .collection-info { padding: 20px; }
}
</style>