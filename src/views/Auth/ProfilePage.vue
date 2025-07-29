<template>
  <div class="profile-page">
    <!-- Навигация -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo">
            OnlineStore
          </router-link>

          <div class="nav-actions">
            <router-link to="/cart" class="cart-link">
              🛒
              <span v-if="cartStore.totalItems > 0" class="cart-badge">
                {{ cartStore.totalItems }}
              </span>
            </router-link>

            <span class="user-name">{{ authStore.user?.name }}</span>

            <button @click="handleLogout" class="logout-btn">
              Вийти
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Головна</router-link>
        <span class="breadcrumb-separator">→</span>
        <span class="breadcrumb-item active">Профіль</span>
      </nav>

      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">Мій профіль</h1>
        <p class="page-subtitle">Редагування особистих даних</p>
      </div>

      <!-- Контент профиля -->
      <div class="profile-content">
        <!-- Личная информация -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">Особиста інформація</h2>
          </div>

          <form @submit.prevent="updateProfile" class="profile-form">
            <!-- Ошибки -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>

            <!-- Успех -->
            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <div class="form-grid">
              <!-- Имя -->
              <div class="form-group">
                <label class="form-label">Ім'я *</label>
                <input
                  v-model="profileForm.name"
                  type="text"
                  required
                  class="form-input"
                  placeholder="Введіть ваше ім'я"
                />
              </div>

              <!-- Email -->
              <div class="form-group">
                <label class="form-label">Email *</label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="form-input"
                  placeholder="Введіть ваш email"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isUpdating || !isProfileFormValid"
              class="btn btn-primary submit-btn"
            >
              <span v-if="isUpdating" class="loading-spinner"></span>
              {{ isUpdating ? 'Збереження...' : 'Зберегти зміни' }}
            </button>
          </form>
        </div>

        <!-- Смена пароля -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">Зміна пароля</h2>
          </div>

          <form @submit.prevent="updatePassword" class="profile-form">
            <!-- Ошибки пароля -->
            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>

            <!-- Успех пароля -->
            <div v-if="passwordSuccessMessage" class="success-message">
              {{ passwordSuccessMessage }}
            </div>

            <div class="form-group">
              <label class="form-label">Поточний пароль *</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="form-input"
                placeholder="Введіть поточний пароль"
              />
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Новий пароль *</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                  class="form-input"
                  placeholder="Мінімум 6 символів"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Підтвердження пароля *</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  class="form-input"
                  placeholder="Повторіть новий пароль"
                />
              </div>
            </div>

            <button
              type="submit"
              :disabled="isUpdatingPassword || !isPasswordFormValid"
              class="btn btn-secondary submit-btn"
            >
              <span v-if="isUpdatingPassword" class="loading-spinner"></span>
              {{ isUpdatingPassword ? 'Оновлення...' : 'Змінити пароль' }}
            </button>
          </form>
        </div>

        <!-- Статистика аккаунта -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">Статистика аккаунту</h2>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📦</div>
              <div class="stat-content">
                <div class="stat-number">{{ userStats.totalOrders }}</div>
                <div class="stat-label">Загальна кількість замовлень</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-number">{{ formatPrice(userStats.totalSpent) }}</div>
                <div class="stat-label">Загальна сума покупок</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-content">
                <div class="stat-number">{{ formatDate(authStore.user?.createdAt) }}</div>
                <div class="stat-label">Дата реєстрації</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Быстрые действия -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">Швидкі дії</h2>
          </div>

          <div class="quick-actions">
            <router-link to="/orders" class="action-card">
              <div class="action-icon">📋</div>
              <div class="action-content">
                <div class="action-title">Мої замовлення</div>
                <div class="action-desc">Переглянути історію покупок</div>
              </div>
            </router-link>

            <router-link to="/shop" class="action-card">
              <div class="action-icon">🛍️</div>
              <div class="action-content">
                <div class="action-title">Продовжити покупки</div>
                <div class="action-desc">Перейти в каталог товарів</div>
              </div>
            </router-link>

            <router-link to="/cart" class="action-card">
              <div class="action-icon">🛒</div>
              <div class="action-content">
                <div class="action-title">Корзина</div>
                <div class="action-desc">{{ cartStore.totalItems }} товар(ів)</div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import MockAPI from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

// Состояние для обновления профиля
const isUpdating = ref(false)
const error = ref('')
const successMessage = ref('')

// Состояние для смены пароля
const isUpdatingPassword = ref(false)
const passwordError = ref('')
const passwordSuccessMessage = ref('')

// Статистика пользователя
const userStats = ref({
  totalOrders: 0,
  totalSpent: 0
})

// Форма профиля
const profileForm = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || ''
})

// Форма смены пароля
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Валидация форм
const isProfileFormValid = computed(() => {
  return profileForm.name.trim() && profileForm.email.trim()
})

const isPasswordFormValid = computed(() => {
  return passwordForm.currentPassword &&
         passwordForm.newPassword.length >= 6 &&
         passwordForm.newPassword === passwordForm.confirmPassword
})

// Обновление профиля
const updateProfile = async () => {
  if (!isProfileFormValid.value) return

  try {
    isUpdating.value = true
    error.value = ''
    successMessage.value = ''

    const updatedUser = await MockAPI.updateUserProfile({
      name: profileForm.name,
      email: profileForm.email
    })

    // Обновляем данные в store
    authStore.user = updatedUser
    
    successMessage.value = 'Профіль успішно оновлено!'
    
    // Очищаем сообщение через 3 секунды
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

  } catch (err: any) {
    error.value = err.message || 'Помилка при оновленні профілю'
  } finally {
    isUpdating.value = false
  }
}

// Смена пароля
const updatePassword = async () => {
  if (!isPasswordFormValid.value) return

  try {
    isUpdatingPassword.value = true
    passwordError.value = ''
    passwordSuccessMessage.value = ''

    await MockAPI.updateUserProfile({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })

    passwordSuccessMessage.value = 'Пароль успішно змінено!'
    
    // Очищаем форму
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Очищаем сообщение через 3 секунды
    setTimeout(() => {
      passwordSuccessMessage.value = ''
    }, 3000)

  } catch (err: any) {
    passwordError.value = err.message || 'Помилка при зміні пароля'
  } finally {
    isUpdatingPassword.value = false
  }
}

// Загрузка статистики пользователя
const loadUserStats = async () => {
  try {
    const orders = await MockAPI.getUserOrders()
    userStats.value.totalOrders = orders.length
    userStats.value.totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Невідомо'
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(async () => {
  await Promise.all([
    cartStore.initializeCart(),
    loadUserStats()
  ])
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
}

/* Навигация - используем стили из других страниц */
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease;
}

.logo:hover {
  color: #1d4ed8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.cart-link {
  position: relative;
  font-size: 20px;
  text-decoration: none;
  color: #64748b;
  transition: color 0.2s ease;
}

.cart-link:hover {
  color: #2563eb;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.user-name {
  color: #64748b;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  transition: color 0.2s ease;
  font-size: 14px;
}

.logout-btn:hover {
  color: #1a1a1a;
}

/* Хлебные крошки */
.breadcrumb {
  display: flex;
  align-items: center;
  margin: 32px 0;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.breadcrumb-item {
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.breadcrumb-item:hover {
  color: #2563eb;
}

.breadcrumb-item.active {
  color: #1a1a1a;
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 12px;
  color: #94a3b8;
}

/* Заголовок */
.page-header {
  margin-bottom: 48px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
}

/* Контент профиля */
.profile-content {
  max-width: 800px;
  margin: 0 auto;
}

.profile-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Фо��мы */
.profile-form {
  margin-bottom: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.submit-btn {
  padding: 12px 24px;
  font-weight: 500;
  position: relative;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Сообщения */
.error-message {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.success-message {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

/* Статистика */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  border-radius: 12px;
  color: white;
}

.stat-number {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

/* Быстрые действия */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.action-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.action-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 13px;
  color: #64748b;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-content {
    max-width: none;
  }

  .profile-section {
    padding: 24px;
    margin-bottom: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }

  .nav-actions .user-name {
    display: none;
  }
}
</style>
