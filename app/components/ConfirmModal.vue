<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <h2>Хочешь безвозвратно удалить меня?</h2>
      <p class="warning-text">Это действие нельзя будет отменить.</p>
      
      <div class="actions">
        <button class="btn-cancel" @click="$emit('cancel')">Отменить</button>
        <button class="btn-confirm" @click="$emit('confirm')">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.modal-content {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
h2 {
  font-size: 20px;
  margin-bottom: 12px;
  color: #1a1a1a;
}
.warning-text {
  color: #888;
  font-size: 14px;
  margin-bottom: 24px;
}
.actions {
  display: flex;
  gap: 12px;
}
.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.btn-cancel {
  background: #f3f4f6;
  color: #333;
}
.btn-cancel:hover { background: #e5e7eb; }
.btn-confirm {
  background: #dc2626;
  color: #fff;
}
.btn-confirm:hover { background: #b91c1c; }
</style>