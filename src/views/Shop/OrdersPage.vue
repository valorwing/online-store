<template>
  <div class="orders-page">
    <!-- Навигация -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo">OnlineStore</router-link>

          <div class="nav-actions">
            <router-link to="/cart" class="cart-link">
              🛒
              <span v-if="cartStore.totalItems > 0" class="cart-badge">
                {{ cartStore.totalItems }}
              </span>
            </router-link>

            <span class="user-name">{{ authStore.user?.name }}</span>

            <button @click="handleLogout" class="logout-btn">Вийти</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Головна</router-link>
        <span class="breadcrumb-separator">→</span>
        <span class="breadcrumb-item active">Мої замовлення</span>
      </nav>

      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">Мої замовлення</h1>
        <p class="page-subtitle">Історія ваших покупок</p>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="loading-state">
        <div v-for="n in 3" :key="n" class="loading-card">
          <div class="loading-header"></div>
          <div class="loading-content">
            <div class="loading-line"></div>
            <div class="loading-line short"></div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3 class="empty-title">У вас поки немає замовлень</h3>
        <p class="empty-description">Почніть покупки в нашому магазині!</p>
        <router-link to="/shop" class="btn btn-primary"> Перейти в магазин </router-link>
      </div>

      <!-- Список заказов -->
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <!-- Заголовок заказа -->
          <div class="order-header">
            <div class="order-info">
              <h3 class="order-title">Замовлення #{{ order.id }}</h3>
              <p class="order-date">{{ formatDate(order.createdAt) }}</p>
            </div>

            <div class="order-summary">
              <span class="order-status" :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </span>
              <p class="order-total">{{ formatPrice(order.totalAmount) }}</p>
            </div>
          </div>

          <!-- Товары в заказе -->
          <div class="order-items">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <div class="item-image">
                <img :src="getProductImage(item.productId)" :alt="getProductName(item.productId)" />
              </div>

              <div class="item-details">
                <h4 class="item-name">{{ getProductName(item.productId) }}</h4>
                <p class="item-quantity">
                  Кількість: {{ item.quantity }} × {{ formatPrice(item.price) }}
                </p>
              </div>

              <div class="item-total">
                {{ formatPrice(item.price * item.quantity) }}
              </div>
            </div>
          </div>

          <!-- Информация о доставке -->
          <div class="order-footer">
            <div class="shipping-info">
              <h4 class="info-title">Адреса доставки</h4>
              <div class="info-content">
                {{ order.shippingAddress.fullName }}<br />
                {{ order.shippingAddress.address }}<br />
                {{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}<br />
                {{ order.shippingAddress.phone }}
              </div>
            </div>

            <div class="payment-info">
              <h4 class="info-title">Спосіб оплати</h4>
              <p class="info-content">{{ getPaymentMethodName(order.paymentMethod) }}</p>

              <div class="order-actions">
                <button
                  v-if="order.status === 'pending'"
                  @click="cancelOrder(order.id)"
                  class="action-btn cancel"
                >
                  Відмінити замовлення
                </button>

                <button @click="reorderItems(order)" class="action-btn reorder">
                  Замовити знову
                </button>

                <button v-if="order.status === 'delivered'" class="action-btn review">
                  Залишити відгук
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div v-if="orders.length > 0" class="pagination">
        <button class="pagination-btn" disabled>Попередня</button>
        <button class="pagination-btn active">1</button>
        <button class="pagination-btn">2</button>
        <button class="pagination-btn">Наступна</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import MockAPI, { type Order, type Product } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const orders = ref<Order[]>([])
const products = ref<Product[]>([])
const isLoading = ref(true)

const loadOrders = async () => {
  try {
    isLoading.value = true
    orders.value = await MockAPI.getUserOrders()
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    isLoading.value = false
  }
}

const loadProducts = async () => {
  try {
    products.value = await MockAPI.getProducts()
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  }
}

const getProductName = (productId: number): string => {
  const product = products.value.find((p) => p.id === productId)
  return product?.name || 'Товар не найден'
}

const getProductImage = (productId: number): string => {
  const product = products.value.find((p) => p.id === productId)
  return product?.images[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Очікує оплати',
    paid: 'Оплачено',
    shipped: 'Відправлено',
    delivered: 'Доставлено',
    cancelled: 'Відмінено',
    payment_failed: 'Оплата не пройшла',
  }
  return statusMap[status] || status
}

const getStatusClass = (status: string): string => {
  const classMap: Record<string, string> = {
    pending: 'status-pending',
    paid: 'status-paid',
    shipped: 'status-shipped',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
    payment_failed: 'status-failed',
  }
  return classMap[status] || 'status-default'
}

const getPaymentMethodName = (paymentMethodId: string): string => {
  const methodMap: Record<string, string> = {
    card: 'Банківська карта',
    monobank: 'Monobank',
    privat24: 'Приват24',
    fondy: 'Fondy',
    paypal: 'PayPal',
  }
  return methodMap[paymentMethodId] || paymentMethodId
}

const cancelOrder = async (orderId: number) => {
  if (!confirm('Ви впевнені, що хочете відмінити це замовлення?')) {
    return
  }

  try {
    const orderIndex = orders.value.findIndex((o) => o.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
    }
    alert('Замовлення відмінено')
  } catch (error) {
    console.error('Ошибка отмены заказа:', error)
    alert('Помилка при відміні замовлення')
  }
}

const reorderItems = async (order: Order) => {
  try {
    for (const item of order.items) {
      await cartStore.addToCart(item.productId, item.quantity)
    }

    alert('Товари додано в корзину')
    router.push('/cart')
  } catch (error) {
    console.error('Ошибка при повторном заказе:', error)
    alert('Помилка при додаванні товарів в корзину')
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(async () => {
  await Promise.all([loadOrders(), loadProducts(), cartStore.initializeCart()])
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #f8fafc;
}

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

/* Состояния загрузки */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loading-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading-header {
  height: 20px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 16px;
  width: 30%;
}

.loading-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading-line {
  height: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.loading-line.short {
  width: 60%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.empty-description {
  color: #64748b;
  margin-bottom: 32px;
  font-size: 16px;
}

/* Список заказов */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow 0.2s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Заголовок заказа */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.order-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.order-date {
  font-size: 14px;
  color: #64748b;
}

.order-summary {
  text-align: right;
}

.order-status {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}
.status-paid {
  background: #dbeafe;
  color: #1e40af;
}
.status-shipped {
  background: #f3e8ff;
  color: #5b21b6;
}
.status-delivered {
  background: #dcfce7;
  color: #166534;
}
.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}
.status-failed {
  background: #fee2e2;
  color: #991b1b;
}

.order-total {
  font-size: 18px;
  font-weight: 700;
  color: #2563eb;
}

/* Товары в заказе */
.order-items {
  padding: 24px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.order-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
  font-size: 14px;
}

.item-quantity {
  font-size: 13px;
  color: #64748b;
}

.item-total {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

/* Подвал заказа */
.order-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  padding: 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.info-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.info-content {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

.order-actions {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.action-btn.cancel {
  color: #dc2626;
}

.action-btn.cancel:hover {
  color: #991b1b;
}

.action-btn.reorder {
  color: #2563eb;
}

.action-btn.reorder:hover {
  color: #1d4ed8;
}

.action-btn.review {
  color: #64748b;
}

.action-btn.review:hover {
  color: #1a1a1a;
}

/* Пагинация */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 48px;
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #64748b;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.pagination-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .order-summary {
    text-align: left;
    width: 100%;
  }

  .order-footer {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .nav-actions {
    gap: 12px;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .order-card {
    margin: 0 -20px;
    border-radius: 0;
  }

  .order-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
