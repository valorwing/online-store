<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2 class="login-title">
            {{ isLoginMode ? 'Ласкаво просимо!' : 'Приєднуйтесь до нас!' }}
          </h2>
          <p class="login-subtitle">
            {{ isLoginMode ? 'Або' : 'Вже є акаунт?' }}
            <button @click="toggleMode" class="toggle-link">
              {{ isLoginMode ? 'зареєструйтесь' : 'увійдіть' }}
            </button>
          </p>
        </div>

        <!-- Демо учетные записи -->
        <div class="demo-accounts">
          <h3 class="demo-title">Демо аккаунты:</h3>
          <div class="demo-list">
            <div class="demo-item">
              <strong>Админ:</strong> admin@example.com / admin123
            </div>
            <div class="demo-item">
              <strong>Пользователь:</strong> user@example.com / user123
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="login-form">
          <!-- Ош��бки -->
          <div v-if="authStore.error" class="error-message">
            {{ authStore.error }}
          </div>

          <!-- Имя (только для регистрации) -->
          <div v-if="!isLoginMode" class="form-group">
            <label for="name" class="form-label">
              Полное имя
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              required
              class="form-input"
              placeholder="Введите ваше имя"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email" class="form-label">
              Email ад��ес
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="form-input"
              placeholder="Введите email"
            />
          </div>

          <!-- Пароль -->
          <div class="form-group">
            <label for="password" class="form-label">
              Пароль
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="form-input"
              placeholder="Введите пароль"
            />
          </div>

          <!-- Кнопка отправки -->
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="submit-btn"
          >
            <span v-if="authStore.isLoading" class="loading-spinner"></span>
            {{ authStore.isLoading 
                ? (isLoginMode ? 'Вход...' : 'Регистрация...') 
                : (isLoginMode ? 'Войти' : 'Зарегистрироваться') 
            }}
          </button>

          <!-- Быстрые кнопки для демо -->
          <div class="demo-buttons">
            <button
              type="button"
              @click="loginAsDemo('admin')"
              :disabled="authStore.isLoading"
              class="demo-btn"
            >
              Войти как админ
            </button>
            <button
              type="button"
              @click="loginAsDemo('user')"
              :disabled="authStore.isLoading"
              class="demo-btn"
            >
              Войти как пользователь
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isLoginMode = ref(true)

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  authStore.clearError()
  
  form.name = ''
  form.email = ''
  form.password = ''
}

const handleSubmit = async () => {
  authStore.clearError()

  try {
    if (isLoginMode.value) {
      await authStore.login(form.email, form.password)
    } else {
      await authStore.register(form.email, form.password, form.name)
    }

    const redirectTo = route.query.redirect as string || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirectTo)
  } catch (error) {
    console.error('Ошибка авторизации:', error)
  }
}

const loginAsDemo = async (role: 'admin' | 'user') => {
  const credentials = {
    admin: { email: 'admin@example.com', password: 'admin123' },
    user: { email: 'user@example.com', password: 'user123' }
  }

  form.email = credentials[role].email
  form.password = credentials[role].password
  
  await handleSubmit()
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    const redirectTo = route.query.redirect as string || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirectTo)
  }
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.login-container {
  max-width: 400px;
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.toggle-link {
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}

.toggle-link:hover {
  color: #1d4ed8;
}

/* Демо аккаунты */
.demo-accounts {
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 32px;
}

.demo-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
}

.demo-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-item {
  font-size: 12px;
  color: #1e40af;
}

/* Форма */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  color: #b91c1c;
  font-size: 14px;
}

/* Кнопка отправки */
.submit-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Демо кнопки */
.demo-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
}

.demo-btn {
  padding: 10px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.demo-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .login-title {
    font-size: 24px;
  }
  
  .demo-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
