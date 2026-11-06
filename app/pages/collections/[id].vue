<template>
  <div v-if="collection">
    <NuxtLink to="/" class="back">← Назад</NuxtLink>

    <div class="detail">
      <div class="detail-image">
        <img v-if="collection.image" :src="collection.image" :alt="collection.title" />
        <div v-else class="placeholder">📦</div>
      </div>
      <div class="detail-body">
        <h1>{{ collection.title }}</h1>
        <p class="desc">{{ collection.description || 'Без описания' }}</p>
        <p class="date">Создано: {{ formatDate(collection.createdAt) }}</p>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    Коллекция не найдена
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getById, loadFromStorage } = useCollections()
const collection = ref()

onMounted(() => {
  loadFromStorage()
  collection.value = getById(route.params.id as string)
})

const formatDate = (ts: number) => 
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

.detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}

.detail-image {
  height: 100%;
  min-height: 300px;
  background: #eef1f7;
}
.detail-image img {
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
  font-size: 80px;
}

.detail-body {
  padding: 32px;
}
.detail-body h1 {
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

.not-found {
  text-align: center;
  padding: 80px 0;
  color: #888;
}

@media (max-width: 700px) {
  .detail { grid-template-columns: 1fr; }
}
</style>