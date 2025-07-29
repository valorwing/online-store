<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-2xl font-bold text-primary"> OnlineStore </router-link>

          <div class="flex items-center space-x-4">
            <router-link
              to="/cart"
              class="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <span
                v-if="cartStore.totalItems > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.totalItems }}
              </span>
            </router-link>

            <span class="text-gray-700">{{ authStore.user?.name }}</span>

            <button
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Хлебные крошки -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="inline-flex items-center space-x-1 md:space-x-3">
          <li class="inline-flex items-center">
            <router-link
              to="/"
              class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary"
            >
              Главная
            </router-link>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500">Мои заказы</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Мои заказы</h1>
        <p class="text-gray-600 mt-2">История ваших покупок</p>
      </div>

      <!-- Загрузка -->
      <div v-if="isLoading" class="space-y-6">
        <div v-for="n in 3" :key="n" class="animate-pulse">
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-24 w-24 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">У вас пока нет заказов</h3>
        <p class="mt-2 text-gray-500 mb-6">Начните покупки в нашем магазине!</p>
        <router-link
          to="/shop"
          class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Перейти в магазин
        </router-link>
      </div>

      <!-- Список заказов -->
      <div v-else class="space-y-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Заголовок заказа -->
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Заказ #{{ order.id }}</h3>
                <p class="text-sm text-gray-600">
                  {{ formatDate(order.createdAt) }}
                </p>
              </div>

              <div class="mt-2 sm:mt-0 flex flex-col sm:items-end">
                <span
                  :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    getStatusColor(order.status),
                  ]"
                >
                  {{ getStatusText(order.status) }}
                </span>
                <p class="text-lg font-bold text-primary mt-1">
                  {{ formatPrice(order.totalAmount) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Товары в заказе -->
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div
                v-for="item in order.items"
                :key="item.productId"
                class="flex items-center space-x-4"
              >
                <div class="w-16 h-16 flex-shrink-0">
                  <img
                    :src="getProductImage(item.productId)"
                    :alt="getProductName(item.productId)"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900">
                    {{ getProductName(item.productId) }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    Количество: {{ item.quantity }} × {{ formatPrice(item.price) }}
                  </p>
                </div>

                <div class="text-sm font-semibold text-gray-900">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Информация о доставке -->
          <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Адрес доставки</h4>
                <p class="text-sm text-gray-600">
                  {{ order.shippingAddress.fullName }}<br />
                  {{ order.shippingAddress.address }}<br />
                  {{ order.shippingAddress.city }}, {{ order.shippingAddress.postalCode }}<br />
                  {{ order.shippingAddress.phone }}
                </p>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-900 mb-2">Способ оплаты</h4>
                <p class="text-sm text-gray-600">
                  {{ getPaymentMethodName(order.paymentMethod) }}
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    v-if="order.status === 'pending'"
                    @click="cancelOrder(order.id)"
                    class="text-red-600 hover:text-red-800 text-sm transition-colors"
                  >
                    Отменить заказ
                  </button>

                  <button
                    @click="reorderItems(order)"
                    class="text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    Заказать снова
                  </button>

                  <button
                    v-if="order.status === 'delivered'"
                    class="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                  >
                    Оставить отзыв
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация (заглушка) -->
      <div v-if="orders.length > 0" class="mt-12 flex justify-center">
        <nav class="flex items-center space-x-2">
          <button
            class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Предыдущая
          </button>
          <button class="px-3 py-2 rounded-lg bg-primary text-white">1</button>
          <button
            class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            2
          </button>
          <button
            class="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Следующая
          </button>
        </nav>
      </div>
    </div>
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
    pending: 'Ожидает оплаты',
    paid: 'Оплачен',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  }
  return statusMap[status] || status
}

const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

const getPaymentMethodName = (paymentMethodId: string): string => {
  const methodMap: Record<string, string> = {
    card: 'Банковская карта',
    yookassa: 'YooKassa',
    sberpay: 'SberPay',
    paypal: 'PayPal',
  }
  return methodMap[paymentMethodId] || paymentMethodId
}

const cancelOrder = async (orderId: number) => {
  if (!confirm('Вы уверены, что хотите отменить этот заказ?')) {
    return
  }

  try {
    // В реальном приложении здесь был бы API вызов для отмены заказа
    const orderIndex = orders.value.findIndex((o) => o.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
    }
    alert('Заказ отменен')
  } catch (error) {
    console.error('Ошибка отмены заказа:', error)
    alert('Ошибка при отмене заказа')
  }
}

const reorderItems = async (order: Order) => {
  try {
    // Добавляем все товары из заказа обратно в корзину
    for (const item of order.items) {
      await cartStore.addToCart(item.productId, item.quantity)
    }

    alert('Товары добавлены в корзину')
    router.push('/cart')
  } catch (error) {
    console.error('Ошибка при повторном заказе:', error)
    alert('Ошибка при добавлении товаров в корзину')
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU', {
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
