<template>
  <div class="auth-container">
    <h1>{{ isLogin ? 'Вход' : 'Регистрация' }}</h1>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required placeholder="you@example.com" />
      </div>

      <div class="form-group">
        <label>Пароль</label>
        <input v-model="password" type="password" required placeholder="••••••••" />
      </div>

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться') }}
      </button>
    </form>

    <p class="toggle-mode">
      {{ isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
      <a href="#" @click.prevent="isLogin = !isLogin">
        {{ isLogin ? 'Создать' : 'Войти' }}
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// Если пользователь уже вошел, перенаправляем на главную
watchEffect(() => {
  if (user.value) {
    navigateTo('/')
  }
})

const isLogin = ref(true)
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleSubmit = async () => {
  loading.value = true
  errorMsg.value = ''

  try {
    if (isLogin.value) {
      // Вход
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
    } else {
      // Регистрация
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      })
      if (error) throw error
      // После регистрации Supabase может вернуть user, но без сессии (если confirm email включен)
      // Мы его выключили, так что сессия должна быть.
    }
    
    // После успеха watchEffect перенаправит на главную
  } catch (error: any) {
    errorMsg.value = error.message || 'Произошла ошибка'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 32px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
h1 { margin-bottom: 24px; text-align: center; }
.form-group { margin-bottom: 16px; }
label { display: block; margin-bottom: 6px; font-size: 14px; font-weight: 600; }
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; }
button { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #dc2626; font-size: 14px; margin-bottom: 12px; }
.toggle-mode { text-align: center; margin-top: 16px; font-size: 14px; }
.toggle-mode a { color: #4f46e5; text-decoration: none; font-weight: 600; }
</style>