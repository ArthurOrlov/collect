<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Новая коллекция</h2>

      <form @submit.prevent="onSubmit">
        <label>
          Название *
          <input
            v-model="title"
            type="text"
            required
            placeholder="Например, Марки"
          />
        </label>

        <label>
          Описание
          <textarea
            v-model="description"
            rows="3"
            placeholder="Кратко о коллекции..."
          />
        </label>

        <label>
          Фото
          <input type="file" accept="image/*" @change="onFile" />
        </label>

        <div v-if="imagePreview" class="preview">
          <img :src="imagePreview" alt="preview" />
          <button type="button" class="btn-remove" @click="removeImage">✕</button>
        </div>

        <div class="actions">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Отмена
          </button>
          <button type="submit" class="btn-primary">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  close: []
  save: [data: { title: string; description: string; image: string | null }]
}>()

const title = ref('')
const description = ref('')
const image = ref<string | null>(null)
const imagePreview = computed(() => image.value)

const onFile = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { image.value = reader.result as string }
  reader.readAsDataURL(file)
}

const removeImage = () => { image.value = null }

const onSubmit = () => {
  if (!title.value.trim()) return
  emit('save', {
    title: title.value.trim(),
    description: description.value.trim(),
    image: image.value,
  })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

label {
  display: block;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 600;
  color: #444;
}

input[type="text"],
textarea {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color .15s;
}
input[type="text"]:focus,
textarea:focus { border-color: #4f46e5; }

textarea { resize: vertical; }

input[type="file"] { margin-top: 6px; font-size: 13px; }

.preview {
  position: relative;
  margin-bottom: 14px;
}
.preview img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
.btn-remove {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  cursor: pointer;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 8px;
}
.btn-primary, .btn-secondary {
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}
.btn-primary { background: #4f46e5; color: #fff; }
.btn-primary:hover { background: #4338ca; }
.btn-secondary { background: #eee; color: #333; }
.btn-secondary:hover { background: #e0e0e0; }
</style>