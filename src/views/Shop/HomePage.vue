<template>
  <div class="home-page">
    <!-- Навигация -->
    <AppNavbar :show-search="true" @search="handleSearch" />

    <!-- Главный контент -->
    <main>
      <!-- Герой секция -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">
              {{ t('home.title') }}
            </h1>
            <p class="hero-subtitle">
              {{ t('home.subtitle') }}
            </p>
            <div class="hero-actions">
              <router-link to="/shop" class="btn btn-primary btn-lg">
                {{ t('home.catalogBtn') }}
              </router-link>
              <router-link
                v-if="!authStore.isAuthenticated"
                to="/login"
                class="btn btn-secondary btn-lg"
              >
                {{ t('home.registerBtn') }}
              </router-link>
              <router-link v-else to="/orders" class="btn btn-secondary btn-lg">
                {{ t('nav.orders') }}
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Преимущества -->
      <section class="features">
        <div class="container">
          <div class="grid grid-3">
            <div class="feature-item">
              <div class="feature-icon">🚚</div>
              <h3 class="feature-title">Быстрая доставка</h3>
              <p class="feature-description">Доставка по всей Украине от 1 дня</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🛡️</div>
              <h3 class="feature-title">Гарантия качества</h3>
              <p class="feature-description">100% оригинальные товары</p>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <h3 class="feature-title">Выгодные цены</h3>
              <p class="feature-description">Лучшие предложения на рынке</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Категории -->
      <section class="categories">
        <div class="container">
          <h2 class="section-title">Популярные категории</h2>

          <div v-if="isLoadingCategories" class="loading">Загрузка категорий...</div>

          <div v-else class="grid grid-4">
            <div
              v-for="category in categories"
              :key="category.id"
              @click="goToCategory(category)"
              class="category-card"
            >
              <img :src="category.image" :alt="category.name" class="category-image" />
              <div class="category-info">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-description">{{ category.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Популярные товары -->
      <section class="products">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Популярные товары</h2>
            <router-link to="/shop" class="link"> Смотреть все → </router-link>
          </div>

          <div v-if="isLoadingProducts" class="loading">Загрузка товаров...</div>

          <div v-else class="grid grid-4">
            <div v-for="product in featuredProducts" :key="product.id" class="product-card">
              <div class="product-image-container">
                <img :src="product.images[0]" :alt="product.name" class="product-image" />
                <div v-if="product.originalPrice" class="discount-badge">
                  -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
                </div>
              </div>

              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description.slice(0, 80) }}...</p>

                <div class="product-rating">
                  ⭐ {{ product.rating }} ({{ product.reviewsCount }})
                </div>

                <div class="product-footer">
                  <div class="product-price">
                    <span class="price-current">{{ formatPrice(product.price) }}</span>
                    <span v-if="product.originalPrice" class="price-original">
                      {{ formatPrice(product.originalPrice) }}
                    </span>
                  </div>

                  <button
                    @click="addToCart(product.id)"
                    :disabled="cartStore.isLoading"
                    class="btn btn-primary btn-sm"
                  >
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Футер -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3 class="footer-title">OnlineStore</h3>
            <p class="footer-text">Ваш надежный партнер в мире онлайн покупок</p>
          </div>

          <div class="footer-section">
            <h4 class="footer-subtitle">Компания</h4>
            <ul class="footer-links">
              <li><a href="#">О нас</a></li>
              <li><a href="#">Контакты</a></li>
              <li><a href="#">Вакансии</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-subtitle">Поддержка</h4>
            <ul class="footer-links">
              <li><a href="#">Помощь</a></li>
              <li><a href="#">Доставка</a></li>
              <li><a href="#">Возврат</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 OnlineStore. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useNotificationStore } from '@/stores/notification'
import { useSettingsStore } from '@/stores/settings'
import { useI18n } from '@/composables/useI18n'
import AppNavbar from '@/components/AppNavbar.vue'
import MockAPI, { type Category, type Product } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const settingsStore = useSettingsStore()
const { t } = useI18n()

const categories = ref<Category[]>([])
const featuredProducts = ref<Product[]>([])
const isLoadingCategories = ref(true)
const isLoadingProducts = ref(true)

const loadCategories = async () => {
  try {
    isLoadingCategories.value = true
    categories.value = await MockAPI.getCategories()
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
    notificationStore.error('Ошибка', 'Не удалось загрузить категории')
  } finally {
    isLoadingCategories.value = false
  }
}

const loadFeaturedProducts = async () => {
  try {
    isLoadingProducts.value = true
    const products = await MockAPI.getProducts({ limit: 4 })
    featuredProducts.value = products
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
    notificationStore.error('Ошибка', 'Не удалось загрузить товары')
  } finally {
    isLoadingProducts.value = false
  }
}

const addToCart = async (productId: number) => {
  try {
    await cartStore.addToCart(productId)
    const product = featuredProducts.value.find((p) => p.id === productId)
    notificationStore.success(
      'Товар добавлен в корзину',
      product ? `${product.name} добавлен в корзину` : undefined,
    )
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
    notificationStore.error('Ошибка', 'Не удалось добавить товар в корзину')
  }
}

const goToCategory = (category: Category) => {
  router.push(`/shop?category=${category.slug}`)
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/shop?search=${encodeURIComponent(searchQuery.value)}`)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  showUserMenu.value = false
  notificationStore.info('До свидания!', 'Вы успешно вышли из системы')
  router.push('/')
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(price)
}

onMounted(async () => {
  await Promise.all([loadCategories(), loadFeaturedProducts(), cartStore.initializeCart()])
})
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
  border: 1px solid #e2e8f0;
  border-radius: 25px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
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
}

/* Герой секция */
.hero {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 80px 0;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 20px;
  color: #6b7280;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Секции */
.features,
.categories,
.products {
  padding: 60px 0;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 48px;
  color: #1a1a1a;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.link {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Особенности */
.feature-item {
  text-align: center;
  padding: 32px 24px;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.feature-description {
  color: #6b7280;
  font-size: 16px;
}

/* Категории */
.category-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.category-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.category-info {
  padding: 20px;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.category-description {
  font-size: 14px;
  color: #6b7280;
}

/* Товары */
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
}

.product-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.discount-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #ef4444;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.product-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
}

.product-rating {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  display: flex;
  flex-direction: column;
}

.price-current {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

.price-original {
  font-size: 14px;
  color: #6b7280;
  text-decoration: line-through;
}

/* Футер */
.footer {
  background: #1f2937;
  color: white;
  padding: 48px 0 24px;
  margin-top: 80px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 32px;
}

.footer-title {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 16px;
}

.footer-subtitle {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.footer-text {
  color: #d1d5db;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: #d1d5db;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 24px;
  text-align: center;
  color: #9ca3af;
}

/* Загрузка */
.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    height: auto;
    padding: 16px 0;
    gap: 16px;
  }

  .search-box {
    order: 3;
    margin: 0;
    max-width: none;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
</style>
