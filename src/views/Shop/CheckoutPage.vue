<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-2xl font-bold text-primary">
            OnlineStore
          </router-link>
          
          <span class="text-gray-700">{{ authStore.user?.name }}</span>
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
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <router-link
                to="/cart"
                class="ml-1 text-sm font-medium text-gray-700 hover:text-primary"
              >
                Корзина
              </router-link>
            </div>
          </li>
          <li>
            <div class="flex items-center">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500">Оформление заказа</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Проверка пустой корзины -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Корзина пуста</h2>
        <p class="text-gray-600 mb-6">Добавьте товары в корзину, чтобы оформить заказ.</p>
        <router-link
          to="/shop"
          class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Перейти в магазин
        </router-link>
      </div>

      <!-- Форма оформления заказа -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Форма данных -->
        <div class="space-y-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Оформление заказа</h1>
            <p class="text-gray-600">Заполните информацию для доставки</p>
          </div>

          <form @submit.prevent="submitOrder" class="space-y-6">
            <!-- Контактная инф��рмация -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Контактная информация</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Имя *
                  </label>
                  <input
                    v-model="orderForm.fullName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Телефон *
                  </label>
                  <input
                    v-model="orderForm.phone"
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <!-- Адрес доставки -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Адрес доставки</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Адрес *
                  </label>
                  <input
                    v-model="orderForm.address"
                    type="text"
                    required
                    placeholder="Улица, дом, квартира"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Город *
                    </label>
                    <input
                      v-model="orderForm.city"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Почтовый индекс *
                    </label>
                    <input
                      v-model="orderForm.postalCode"
                      type="text"
                      required
                      placeholder="123456"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Способ оплаты -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Способ оплаты</h3>
              
              <div v-if="isLoadingPaymentMethods" class="animate-pulse">
                <div class="space-y-3">
                  <div v-for="n in 3" :key="n" class="h-16 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
              
              <div v-else class="space-y-3">
                <label
                  v-for="method in paymentMethods"
                  :key="method.id"
                  class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  :class="{ 'border-primary bg-primary/5': orderForm.paymentMethod === method.id }"
                >
                  <input
                    v-model="orderForm.paymentMethod"
                    :value="method.id"
                    type="radio"
                    name="payment-method"
                    class="text-primary focus:ring-primary"
                  />
                  <div class="ml-3 flex-1">
                    <div class="flex items-center">
                      <span class="text-2xl mr-3">{{ method.icon }}</span>
                      <div>
                        <div class="font-medium text-gray-900">{{ method.name }}</div>
                        <div class="text-sm text-gray-600">{{ method.description }}</div>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- К��опка оформления -->
            <button
              type="submit"
              :disabled="isProcessing || !isFormValid"
              class="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <span v-if="isProcessing" class="mr-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </span>
              {{ isProcessing ? 'Обработка...' : `Оплатить ${formatPrice(cartStore.totalPrice)}` }}
            </button>
          </form>
        </div>

        <!-- Сводка заказа -->
        <div class="lg:sticky lg:top-8 lg:self-start">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">Ваш заказ</h3>
            
            <!-- Список товаров -->
            <div class="space-y-4 mb-6">
              <div
                v-for="item in cartStore.items"
                :key="item.productId"
                class="flex items-center space-x-4"
              >
                <div class="w-16 h-16 flex-shrink-0">
                  <img
                    :src="item.product.images[0]"
                    :alt="item.product.name"
                    class="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-900 truncate">
                    {{ item.product.name }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    Количество: {{ item.quantity }}
                  </p>
                </div>
                
                <div class="text-sm font-semibold text-gray-900">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </div>
              </div>
            </div>

            <hr class="mb-4" />

            <!-- Итоги -->
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Подытог</span>
                <span class="font-semibold">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Доставка</span>
                <span class="font-semibold text-green-600">Бесплатно</span>
              </div>
              
              <div class="flex justify-between">
                <span class="text-gray-600">Налоги</span>
                <span class="font-semibold">Включены</span>
              </div>
              
              <hr />
              
              <div class="flex justify-between text-lg">
                <span class="font-semibold">Итого</span>
                <span class="font-bold text-primary">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
            </div>

            <!-- Гарантии -->
            <div class="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 class="text-sm font-medium text-green-800 mb-2">Ваши гарантии</h4>
              <ul class="text-xs text-green-700 space-y-1">
                <li>• Защищенная оплата 🔒</li>
                <li>• Возврат денег в течение 14 дней</li>
                <li>• Гарантия качества товара</li>
                <li>• Поддержка 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно успешного за��аза -->
    <div
      v-if="showSuccessModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeSuccessModal"
    >
      <div
        class="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-lg bg-white text-center"
        @click.stop
      >
        <div class="text-green-500 mb-4">
          <svg class="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Заказ успешно оформлен!</h3>
        <p class="text-gray-600 mb-6">
          Заказ #{{ createdOrder?.id }} принят в обработку.<br>
          Мы отправим уведомление о статусе заказа на ваш email.
        </p>
        
        <div class="space-y-3">
          <router-link
            to="/orders"
            class="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors block"
          >
            Посмотреть заказы
          </router-link>
          
          <router-link
            to="/"
            class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors block"
          >
            На главную
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
  paymentMethod: ''
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
    
    // Устанавливаем первый метод по умолчанию
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

    // Создаем заказ
    const orderData = {
      items: cartStore.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: cartStore.totalPrice,
      status: 'pending' as const,
      paymentMethod: orderForm.paymentMethod,
      shippingAddress: {
        fullName: orderForm.fullName,
        address: orderForm.address,
        city: orderForm.city,
        postalCode: orderForm.postalCode,
        phone: orderForm.phone
      }
    }

    const order = await MockAPI.createOrder(orderData)

    // Обрабатываем платеж
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
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
}

onMounted(async () => {
  await cartStore.initializeCart()
  await loadPaymentMethods()

  // Перенаправляем на корзину если она пуста
  if (cartStore.isEmpty) {
    router.push('/cart')
  }
})
</script>
