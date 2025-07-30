import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import MockAPI, { type User } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // Состояние
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Вычисляемые свойства
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Инициализация - проверка токена при загрузке приложения
  const initializeAuth = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      MockAPI.setAuthToken(token)
      try {
        const currentUser = await MockAPI.getCurrentUser()
        if (currentUser) {
          user.value = currentUser
        } else {
          localStorage.removeItem('auth_token')
        }
      } catch (err) {
        console.error('Ошибка при проверке токена:', err)
        localStorage.removeItem('auth_token')
        MockAPI.clearAuthToken()
      }
    }
  }

  // Вход в систему
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await MockAPI.login(email, password)

      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      MockAPI.setAuthToken(response.token)

      return response
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message || 'Auth error. Empty error message'
      } else {
        error.value = 'Auth error. Unknown error type'
      }

      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Регистрация
  const register = async (email: string, password: string, name: string) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await MockAPI.register(email, password, name)

      user.value = response.user
      localStorage.setItem('auth_token', response.token)
      MockAPI.setAuthToken(response.token)

      return response
    } catch (err) {
      if (err instanceof Error) {
        error.value = err.message || 'Sign up error. Empty error message'
      } else {
        error.value = 'Sign up error. Unknown error type'
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Выход из системы
  const logout = async () => {
    isLoading.value = true

    try {
      await MockAPI.logout()
    } catch (err) {
      console.error('Logout error: ', err)
    } finally {
      user.value = null
      localStorage.removeItem('auth_token')
      MockAPI.clearAuthToken()
      isLoading.value = false
    }
  }

  // Обновление данных пользователя
  const refreshUser = async () => {
    if (!isAuthenticated.value) return

    try {
      const currentUser = await MockAPI.getCurrentUser()
      if (currentUser) {
        user.value = currentUser
      } else {
        await logout()
      }
    } catch (err) {
      console.error('Update user error:', err)
      await logout()
    }
  }

  // Очистка ошибок
  const clearError = () => {
    error.value = null
  }

  return {
    // Состояние
    user,
    isLoading,
    error,

    // Вычисляемые свойства
    isAuthenticated,
    isAdmin,

    // Методы
    initializeAuth,
    login,
    register,
    logout,
    refreshUser,
    clearError,
  }
})
