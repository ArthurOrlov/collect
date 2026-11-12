<template>
  <div>
    <div class="page-header">
      <h1>Мои коллекции</h1>
      
      <div v-if="user">
        <button class="btn-primary" @click="showForm = true">
          + Добавить коллекцию
        </button>
        <button class="btn-secondary" @click="logout">
          Выйти
        </button>
      </div>
      
      <NuxtLink v-else to="/login" class="btn-primary">
        Войти, чтобы добавить
      </NuxtLink>
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

const { collections, addCollection, fetchCollections } = useCollections()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const showForm = ref(false)

onMounted(() => {
  fetchCollections()
})

const onSave = async (data: { title: string; description: string; imageFile: File | null }) => {
  await addCollection(data)
  showForm.value = false
}

const logout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
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
  text-decoration: none;
  display: inline-block;
}
.btn-primary:hover { background: #4338ca; }

.btn-secondary {
  background: #eee;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-left: 10px;
}
.btn-secondary:hover { background: #e0e0e0; }

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