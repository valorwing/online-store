<template>
  <div class="checkout-page">
    <!-- Навигация -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <router-link to="/" class="logo">
            OnlineStore
          </router-link>
          <span class="user-name">{{ authStore.user?.name }}</span>
        </div>
      </div>
    </nav>

    <main class="container">
      <!-- Хлебные крошки -->
      <nav class="breadcrumb">
        <router-link to="/" class="breadcrumb-item">Головна</router-link>
        <span class="breadcrumb-separator">→</span>
        <router-link to="/cart" class="breadcrumb-item">Корзина</router-link>
        <span class="breadcrumb-separator">→</span>
        <span class="breadcrumb-item active">Оформлення замовлення</span>
      </nav>

      <!-- Проверка пустой корзины -->
      <div v-if="cartStore.isEmpty" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2 class="empty-title">Корзина порожня</h2>
        <p class="empty-description">Додайте товари в корзину, щоб оформити замовлення.</p>
        <router-link to="/shop" class="btn btn-primary">
          Перейти в магазин
        </router-link>
      </div>

      <!-- Форма оформления заказа -->
      <div v-else class="checkout-content">
        <!-- Заголовок -->
        <div class="page-header">
          <h1 class="page-title">Оформлення замовлення</h1>
          <p class="page-subtitle">Заповніть інформацію для доставки</p>
        </div>

        <div class="checkout-grid">
          <!-- Форма данных -->
          <div class="checkout-form">
            <form @submit.prevent="submitOrder">
              <!-- Контактная информация -->
              <div class="form-section">
                <h3 class="section-title">Контактна інформація</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Ім'я *</label>
                    <input
                      v-model="orderForm.fullName"
                      type="text"
                      required
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Телефон *</label>
                    <input
                      v-model="orderForm.phone"
                      type="tel"
                      required
                      placeholder="+380 (__) ___-__-__"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Адрес доставки -->
              <div class="form-section">
                <h3 class="section-title">Адреса доставки</h3>
                <div class="form-group">
                  <label class="form-label">Адреса *</label>
                  <input
                    v-model="orderForm.address"
                    type="text"
                    required
                    placeholder="Вулиця, будинок, квартира"
                    class="form-input"
                  />
                </div>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Місто *</label>
                    <input
                      v-model="orderForm.city"
                      type="text"
                      required
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Поштовий індекс *</label>
                    <input
                      v-model="orderForm.postalCode"
                      type="text"
                      required
                      placeholder="12345"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Способ оплаты -->
              <div class="form-section">
                <h3 class="section-title">Спосіб оплати</h3>
                <div v-if="isLoadingPaymentMethods" class="loading-methods">
                  <div v-for="n in 3" :key="n" class="loading-item"></div>
                </div>
                <div v-else class="payment-methods">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.id"
                    class="payment-method"
                    :class="{ active: orderForm.paymentMethod === method.id }"
                  >
                    <input
                      v-model="orderForm.paymentMethod"
                      :value="method.id"
                      type="radio"
                      name="payment-method"
                      class="payment-radio"
                    />
                    <div class="payment-info">
                      <span class="payment-icon">{{ method.icon }}</span>
                      <div class="payment-details">
                        <div class="payment-name">{{ method.name }}</div>
                        <div class="payment-desc">{{ method.description }}</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Кнопка оформления -->
              <button
                type="submit"
                :disabled="isProcessing || !isFormValid"
                class="btn btn-primary submit-btn"
              >
                <span v-if="isProcessing" class="loading-spinner"></span>
                {{ isProcessing ? 'Обробка...' : `Оплатити ${formatPrice(cartStore.totalPrice)}` }}
              </button>
            </form>
          </div>

          <!-- Сводка заказа -->
          <div class="order-summary">
            <div class="card">
              <div class="card-body">
                <h3 class="summary-title">Ваше замовлення</h3>

                <!-- Список товаров -->
                <div class="order-items">
                  <div
                    v-for="item in cartStore.items"
                    :key="item.productId"
                    class="order-item"
                  >
                    <div class="item-image">
                      <img
                        :src="item.product.images[0]"
                        :alt="item.product.name"
                      />
                    </div>
                    <div class="item-details">
                      <h4 class="item-name">{{ item.product.name }}</h4>
                      <p class="item-qty">Кількість: {{ item.quantity }}</p>
                    </div>
                    <div class="item-price">
                      {{ formatPrice(item.product.price * item.quantity) }}
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <!-- Итоги -->
                <div class="order-totals">
                  <div class="total-row">
                    <span>Підсумок</span>
                    <span class="total-value">{{ formatPrice(cartStore.totalPrice) }}</span>
                  </div>
                  <div class="total-row">
                    <span>Доставка</span>
                    <span class="total-value free">Безкоштовно</span>
                  </div>
                  <div class="total-row">
                    <span>Податки</span>
                    <span class="total-value">Включені</span>
                  </div>
                  <div class="divider"></div>
                  <div class="total-row final">
                    <span class="total-label">Разом</span>
                    <span class="total-amount">{{ formatPrice(cartStore.totalPrice) }}</span>
                  </div>
                </div>

                <!-- Гарантии -->
                <div class="guarantees">
                  <h4 class="guarantees-title">Ваші гарантії</h4>
                  <ul class="guarantees-list">
                    <li>🔒 Захищена оплата</li>
                    <li>↩️ Повернення грошей протягом 14 днів</li>
                    <li>✅ Гарантія якості товару</li>
                    <li>🕰️ Підтримка 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Модальное окно успешного заказа -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content" @click.stop>
        <div class="success-icon">✅</div>
        <h3 class="success-title">Замовлення успішно оформлене!</h3>
        <p class="success-text">
          Замовлення #{{ createdOrder?.id }} прийнято в обробку.<br />
          Ми надішлемо повідомлення про статус замовлення на ваш email.
        </p>
        <div class="success-actions">
          <router-link to="/orders" class="btn btn-primary">
            Подивитися замовлення
          </router-link>
          <router-link to="/" class="btn btn-secondary">
            На головну
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import MockAPI, { type PaymentMethod, type Order } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const paymentMethods = ref<PaymentMethod[]>([])
const isLoadingPaymentMethods = ref(true)
const isProcessing = ref(false)
const showSuccessModal = ref(false)
const createdOrder = ref<Order | null>(null)

const orderForm = reactive({
  fullName: authStore.user?.name || '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  paymentMethod: '',
})

const isFormValid = computed(() => {
  return (
    orderForm.fullName.trim() &&
    orderForm.phone.trim() &&
    orderForm.address.trim() &&
    orderForm.city.trim() &&
    orderForm.postalCode.trim() &&
    orderForm.paymentMethod &&
    !cartStore.isEmpty
  )
})

const loadPaymentMethods = async () => {
  try {
    isLoadingPaymentMethods.value = true
    paymentMethods.value = await MockAPI.getPaymentMethods()

    if (paymentMethods.value.length > 0) {
      orderForm.paymentMethod = paymentMethods.value[0].id
    }
  } catch (error) {
    console.error('Ошибка загрузки методов оплаты:', error)
  } finally {
    isLoadingPaymentMethods.value = false
  }
}

const submitOrder = async () => {
  if (!isFormValid.value) return

  try {
    isProcessing.value = true

    const orderData = {
      items: cartStore.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: cartStore.totalPrice,
      status: 'pending' as const,
      paymentMethod: orderForm.paymentMethod,
      shippingAddress: {
        fullName: orderForm.fullName,
        address: orderForm.address,
        city: orderForm.city,
        postalCode: orderForm.postalCode,
        phone: orderForm.phone,
      },
    }

    const order = await MockAPI.createOrder(orderData)
    const paymentResult = await MockAPI.processPayment(order.id, orderForm.paymentMethod)

    if (paymentResult.success) {
      createdOrder.value = order
      showSuccessModal.value = true
      cartStore.clearCart()
    }
  } catch (error: any) {
    console.error('Ошибка оформления заказа:', error)
    alert(error.message || 'Ошибка при оформлении заказа. Попробуйте еще раз.')
  } finally {
    isProcessing.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push('/orders')
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(price)
}

onMounted(async () => {
  await cartStore.initializeCart()
  await loadPaymentMethods()

  if (cartStore.isEmpty) {
    router.push('/cart')
  }
})
</script>

<style scoped>
.checkout-page {
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

.user-name {
  color: #64748b;
  font-weight: 500;
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

/* Пустая корзина */
.empty-cart {
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

/* Контент оформления */
.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 48px;
  align-items: start;
}

/* Форма */
.checkout-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

/* Способы оплаты */
.loading-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-item {
  height: 64px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-method:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.payment-method.active {
  border-color: #2563eb;
  background: rgba(37, 99, 235, 0.05);
}

.payment-radio {
  margin-right: 12px;
}

.payment-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.payment-icon {
  font-size: 24px;
  margin-right: 12px;
}

.payment-name {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 2px;
}

.payment-desc {
  font-size: 13px;
  color: #64748b;
}

/* Кнопка отправки */
.submit-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  position: relative;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Сводка заказа */
.order-summary {
  position: sticky;
  top: 120px;
}

.summary-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.order-items {
  margin-bottom: 24px;
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

.item-qty {
  font-size: 13px;
  color: #64748b;
}

.item-price {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 20px 0;
}

/* Итоги */
.order-totals {
  margin-bottom: 24px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.total-row.final {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.total-value.free {
  color: #059669;
  font-weight: 500;
}

.total-amount {
  color: #2563eb;
  font-weight: 700;
}

/* Гарантии */
.guarantees {
  background: rgba(16, 185, 129, 0.05);
  padding: 20px;
  border-radius: 8px;
}

.guarantees-title {
  font-size: 14px;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 12px;
}

.guarantees-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guarantees-list li {
  font-size: 13px;
  color: #047857;
  margin-bottom: 4px;
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 16px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.success-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.success-text {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 32px;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 768px) {
  .checkout-form {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 24px;
  }

  .modal-content {
    padding: 32px 24px;
    margin: 20px;
  }
}
</style>
