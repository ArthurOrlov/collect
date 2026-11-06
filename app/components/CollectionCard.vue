<template>
  <NuxtLink :to="`/collections/${collection.id}`" class="card">
    <div class="card-image">
      <img v-if="collection.image" :src="collection.image" :alt="collection.title" />
      <div v-else class="placeholder">📦</div>
    </div>
    <div class="card-body">
      <h3>{{ collection.title }}</h3>
      <p>{{ collection.description || 'Без описания' }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Collection } from '~/composables/useCollections'

defineProps<{ collection: Collection }>()
</script>

<style scoped>
.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  transition: transform .15s, box-shadow .15s;
  display: block;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.card-image {
  height: 160px;
  background: #eef1f7;
  overflow: hidden;
}
.card-image img {
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
  font-size: 48px;
}

.card-body {
  padding: 14px 16px;
}
.card-body h3 {
  font-size: 16px;
  margin-bottom: 6px;
}
.card-body p {
  font-size: 13px;
  color: #777;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>