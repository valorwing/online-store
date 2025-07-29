<template>
  <div class="cart-page">
    <!-- Навигация -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo"> OnlineStore </router-link>

          <div class="nav-actions">
            <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn btn-primary">
              Войти
            </router-link>

            <!-- Меню пользователя -->
            <div v-else class="user-menu">
              <button @click="showUserMenu = !showUserMenu" class="user-button">
                {{ authStore.user?.name }}
                <span class="dropdown-arrow">▼</span>
              </button>

              <div
                v-if="showUserMenu"
                v-click-outside="() => (showUserMenu = false)"
                class="dropdown-menu"
              >
                <router-link to="/profile" class="dropdown-item"> 👤 Профіль </router-link>
                <router-link to="/orders" class="dropdown-item"> 📦 Мої замовлення </router-link>
                <router-link v-if="authStore.isAdmin" to="/admin" class="dropdown-item">
                  ⚙️ Адмін панель
                </router-link>
                <hr class="dropdown-divider" />
                <button @click="handleLogout" class="dropdown-item logout-btn">🚪 Вийти</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Головна</router-link>
        <span class="breadcrumb-separator">→</span>
        <span class="breadcrumb-item">Корзина</span>
      </nav>

      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">Корзина</h1>
        <p class="page-subtitle">{{ cartStore.totalItems }} товар(ов) в корзине</p>
      </div>

      <!-- Пустая корзина -->
      <div v-if="cartStore.isEmpty" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h3 class="empty-title">Корзина пуста</h3>
        <p class="empty-description">Добавьте товары в корзину, чтобы продолжить покупки.</p>
        <router-link to="/shop" class="btn btn-primary btn-lg"> Перейти в магазин </router-link>
      </div>

      <!-- Содержимое корзины -->
      <div v-else class="cart-content">
        <!-- Список товаров -->
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.productId" class="cart-item">
            <img :src="item.product.images[0]" :alt="item.product.name" class="item-image" />

            <div class="item-info">
              <h3 class="item-name">{{ item.product.name }}</h3>
              <p class="item-description">{{ item.product.description.slice(0, 100) }}...</p>

              <div class="item-price">
                <span class="price-current">{{ formatPrice(item.product.price) }}</span>
                <span v-if="item.product.originalPrice" class="price-original">
                  {{ formatPrice(item.product.originalPrice) }}
                </span>
              </div>
            </div>

            <div class="item-controls">
              <div class="quantity-controls">
                <button @click="decreaseQuantity(item.productId)" class="quantity-btn">−</button>

                <span class="quantity">{{ item.quantity }}</span>

                <button @click="increaseQuantity(item.productId)" class="quantity-btn">+</button>
              </div>

              <div class="item-total">
                {{ formatPrice(item.product.price * item.quantity) }}
              </div>

              <button @click="removeItem(item.productId)" class="remove-btn">Удалить</button>
            </div>
          </div>
        </div>

        <!-- Итоги заказа -->
        <div class="cart-summary">
          <div class="card">
            <h3 class="summary-title">Итого</h3>

            <div class="summary-row">
              <span>Товары ({{ cartStore.totalItems }})</span>
              <span class="summary-value">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <div class="summary-row">
              <span>Доставка</span>
              <span class="summary-value free">Бесплатно</span>
            </div>

            <hr class="summary-divider" />

            <div class="summary-row total">
              <span>Общая сумма</span>
              <span class="summary-value">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>

            <div class="summary-actions">
              <router-link to="/checkout" class="btn btn-primary btn-lg">
                Оформить заказ
              </router-link>

              <router-link to="/shop" class="btn btn-secondary"> Продолжить покупки </router-link>

              <button @click="clearCart" class="clear-btn">Очистить корзину</button>
            </div>

            <div class="delivery-info">
              <h4 class="info-title">Информация о доставке</h4>
              <ul class="info-list">
                <li>• Бесплатная доставка от 1200₴</li>
                <li>• Доставка в течение 1-3 дней</li>
                <li>• Возможность примерки</li>
                <li>• Гарантия возврата 14 дней</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Рекомендуемые товары -->
      <div v-if="!cartStore.isEmpty && recommendedProducts.length > 0" class="recommendations">
        <h2 class="section-title">Вам может понравиться</h2>
        <div class="recommendations-grid">
          <div v-for="product in recommendedProducts" :key="product.id" class="recommendation-card">
            <img :src="product.images[0]" :alt="product.name" class="recommendation-image" />
            <div class="recommendation-info">
              <h3 class="recommendation-name">{{ product.name }}</h3>
              <div class="recommendation-footer">
                <span class="recommendation-price">
                  {{ formatPrice(product.price) }}
                </span>
                <button @click="addToCart(product.id)" class="btn btn-primary btn-sm">
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { vClickOutside } from '@/directives/clickOutside'
import MockAPI, { type Product } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const recommendedProducts = ref<Product[]>([])
const showUserMenu = ref(false)

const loadRecommendedProducts = async () => {
  try {
    const products = await MockAPI.getProducts({ limit: 4 })
    const cartProductIds = cartStore.items.map((item) => item.productId)
    recommendedProducts.value = products.filter((product) => !cartProductIds.includes(product.id))
  } catch (error) {
    console.error('Ошибка загрузки рекомендованных товаров:', error)
  }
}

const increaseQuantity = (productId: number) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  cartStore.updateQuantity(productId, currentQuantity + 1)
}

const decreaseQuantity = (productId: number) => {
  const currentQuantity = cartStore.getItemQuantity(productId)
  if (currentQuantity > 1) {
    cartStore.updateQuantity(productId, currentQuantity - 1)
  } else {
    removeItem(productId)
  }
}

const removeItem = (productId: number) => {
  if (confirm('Удалить товар из корзины?')) {
    cartStore.removeFromCart(productId)
    loadRecommendedProducts()
  }
}

const clearCart = () => {
  if (confirm('Очистить всю корзину?')) {
    cartStore.clearCart()
  }
}

const addToCart = async (productId: number) => {
  try {
    await cartStore.addToCart(productId)
    loadRecommendedProducts()
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
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

onMounted(() => {
  cartStore.initializeCart()
  loadRecommendedProducts()
})
</script>

<style scoped>
/* Навигация */
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
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  color: #374151;
  font-weight: 500;
}

/* Хлебные крошки */
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  padding-top: 32px;
}

.breadcrumb-item {
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
}

.breadcrumb-item:hover {
  color: #2563eb;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: #9ca3af;
}

/* Заголовок */
.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 16px;
}

/* Пустая корзина */
.empty-cart {
  text-align: center;
  padding: 80px 40px;
}

.empty-icon {
  font-size: 72px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.empty-description {
  color: #6b7280;
  font-size: 16px;
  margin-bottom: 32px;
}

/* Содержимое корзины */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 32px;
}

/* Товары в корзине */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 20px;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.item-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
  line-height: 1.4;
}

.item-price {
  display: flex;
  gap: 8px;
  align-items: center;
}

.price-current {
  font-size: 16px;
  font-weight: 600;
  color: #2563eb;
}

.price-original {
  font-size: 14px;
  color: #6b7280;
  text-decoration: line-through;
}

/* Управление товаром */
.item-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border-radius: 8px;
  padding: 4px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
}

.quantity-btn:hover {
  background: #f1f5f9;
}

.quantity {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  color: #1a1a1a;
}

.item-total {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.remove-btn:hover {
  background: #fef2f2;
}

/* Итоги заказа */
.cart-summary {
  position: sticky;
  top: 100px;
  align-self: flex-start;
}

.summary-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.summary-value {
  font-weight: 600;
  color: #1a1a1a;
}

.summary-value.free {
  color: #059669;
}

.summary-divider {
  margin: 16px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.clear-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: #b91c1c;
}

/* Информация о доставке */
.delivery-info {
  margin-top: 24px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 8px;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  font-size: 12px;
  color: #1e40af;
  margin-bottom: 4px;
}

/* Рекомендации */
.recommendations {
  margin-top: 64px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
}

.recommendation-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.recommendation-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.recommendation-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recommendation-info {
  padding: 16px;
}

.recommendation-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.recommendation-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recommendation-price {
  font-size: 16px;
  font-weight: 700;
  color: #2563eb;
}

/* Dropdown меню пользователя */
.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #374151;
}

.user-button:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  z-index: 50;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  text-decoration: none;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #2563eb;
}

.dropdown-divider {
  margin: 8px 16px;
  border: none;
  border-top: 1px solid #f1f5f9;
}

.logout-btn {
  color: #dc2626;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #b91c1c;
}

/* Адаптивность */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    flex-direction: column;
    text-align: center;
  }

  .item-controls {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
