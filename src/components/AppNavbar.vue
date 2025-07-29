<template>
  <nav class="navbar">
    <div class="container">
      <div class="nav-content">
        <!-- Логотип -->
        <router-link to="/" class="logo">
          OnlineStore
        </router-link>

        <!-- Поиск (только на главной странице) -->
        <div v-if="showSearch" class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            @input="$emit('search', searchQuery)"
            type="text"
            :placeholder="t('actions.search') + '...'"
            class="search-input"
          />
        </div>

        <!-- Навигация справа -->
        <div class="nav-actions">
          <!-- Переключатель языка -->
          <button @click="settingsStore.toggleLanguage()" class="nav-btn language-btn" :title="t('settings.language')">
            {{ settingsStore.language === 'uk' ? 'УК' : 'РУ' }}
          </button>

          <!-- Переключатель темы -->
          <button @click="settingsStore.toggleTheme()" class="nav-btn theme-btn" :title="t('settings.theme')">
            {{ settingsStore.theme === 'light' ? '🌙' : '☀️' }}
          </button>

          <!-- Корзина -->
          <router-link to="/cart" class="nav-btn cart-link">
            🛒
            <span v-if="cartStore.totalItems > 0" class="cart-badge">
              {{ cartStore.totalItems }}
            </span>
          </router-link>

          <!-- Навигация для залогиненных пользователей -->
          <template v-if="authStore.isAuthenticated">
            <!-- Профиль -->
            <router-link to="/profile" class="nav-btn" :title="t('nav.profile')">
              👤
            </router-link>

            <!-- Заказы -->
            <router-link to="/orders" class="nav-btn" :title="t('nav.orders')">
              📦
            </router-link>

            <!-- Админ панель -->
            <router-link v-if="authStore.isAdmin" to="/admin" class="nav-btn" :title="t('nav.admin')">
              ⚙️
            </router-link>

            <!-- Имя пользователя -->
            <span class="user-name">{{ authStore.user?.name }}</span>

            <!-- Кнопка выхода -->
            <button @click="handleLogout" class="nav-btn logout-btn" :title="t('nav.logout')">
              🚪
            </button>
          </template>

          <!-- Кнопка входа для неавторизованных -->
          <router-link v-else to="/login" class="btn btn-primary">
            {{ t('nav.login') }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from '@/composables/useI18n'

interface Props {
  showSearch?: boolean
}

defineProps<Props>()

defineEmits<{
  search: [value: string]
}>()

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const settingsStore = useSettingsStore()
const { t } = useI18n()

const searchQuery = ref('')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<style scoped>
/* Навигация */
.navbar {
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background-color 0.3s ease;
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
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.logo:hover {
  color: var(--color-primary-hover);
}

.search-box {
  flex: 1;
  max-width: 400px;
  margin: 0 40px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid var(--color-border);
  border-radius: 25px;
  font-size: 14px;
  background: var(--color-surface);
  color: var(--color-text);
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Универсальная кнопка навигации */
.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: var(--color-text-secondary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.nav-btn:hover {
  background: var(--color-background-tertiary);
  border-color: var(--color-border-hover);
  color: var(--color-primary);
  transform: translateY(-1px);
}

.nav-btn.router-link-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* Специфичные стили для кнопок */
.language-btn {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.theme-btn {
  font-size: 18px;
}

.cart-link {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--color-error);
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  line-height: 1.2;
}

.user-name {
  color: var(--color-text-secondary);
  font-weight: 500;
  font-size: 14px;
  margin: 0 8px;
}

.logout-btn {
  background: var(--color-error);
  border-color: var(--color-error);
  color: white;
}

.logout-btn:hover {
  background: #b91c1c;
  border-color: #b91c1c;
  color: white;
  transform: translateY(-1px);
}

/* Адаптивность */
@media (max-width: 768px) {
  .search-box {
    margin: 0 20px;
    max-width: 300px;
  }

  .user-name {
    display: none;
  }

  .nav-actions {
    gap: 8px;
  }

  .nav-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .search-box {
    display: none;
  }
}
</style>
