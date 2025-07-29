<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-fade-in">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLoginMode ? 'Вход в аккаунт' : 'Регистрация' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLoginMode ? 'Или' : 'Уже есть аккаунт?' }}
          <button
            @click="toggleMode"
            class="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {{ isLoginMode ? 'зарегистрируйтесь' : 'войдите' }}
          </button>
        </p>
      </div>

      <!-- Демо учетные записи -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 class="text-sm font-medium text-blue-800 mb-2">Демо аккаунты:</h3>
        <div class="text-xs text-blue-700 space-y-1">
          <div><strong>Админ:</strong> admin@example.com / admin123</div>
          <div><strong>Пользователь:</strong> user@example.com / user123</div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Ошибки -->
        <div v-if="authStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="text-red-800 text-sm">{{ authStore.error }}</div>
        </div>

        <div class="space-y-4">
          <!-- Имя (только для регистрации) -->
          <div v-if="!isLoginMode">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Полное имя
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Введите ваше имя"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email адрес
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Введите email"
            />
          </div>

          <!-- Пароль -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              autocomplete="current-password"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Введите пароль"
            />
          </div>
        </div>

        <!-- Кнопка отправки -->
        <div>
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="authStore.isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </span>
            {{ authStore.isLoading 
                ? (isLoginMode ? 'Вход...' : 'Регистрация...') 
                : (isLoginMode ? 'Войти' : 'Зарегистрироваться') 
            }}
          </button>
        </div>

        <!-- Быстрые кнопки для демо -->
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="loginAsDemo('admin')"
            :disabled="authStore.isLoading"
            class="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
          >
            Войти как админ
          </button>
          <button
            type="button"
            @click="loginAsDemo('user')"
            :disabled="authStore.isLoading"
            class="py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
          >
            Войти как пользо��атель
          </button>
        </div>
      </form>
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
  
  // Очищаем форму при переключении режима
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

    // Перенаправляем пользователя
    const redirectTo = route.query.redirect as string || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirectTo)
  } catch (error) {
    // Ошибка уже обработана в store
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
  // Если пользователь уже авторизован, перенаправляем его
  if (authStore.isAuthenticated) {
    const redirectTo = route.query.redirect as string || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirectTo)
  }
})
</script>
