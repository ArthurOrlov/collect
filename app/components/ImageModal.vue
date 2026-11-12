<template>
  <div class="modal-overlay" @click="$emit('close')">
    <img :src="imageUrl" alt="Full size" class="full-image" @click.stop />
    <button class="close-btn" @click="$emit('close')">✕</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ imageUrl: string }>()
defineEmits<{ close: [] }>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 20px;
  cursor: zoom-out;
}
.full-image {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>