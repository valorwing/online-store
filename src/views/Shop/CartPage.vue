<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-2xl font-bold text-primary"> OnlineStore </router-link>

          <div class="flex items-center space-x-4">
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Войти
            </router-link>

            <span v-else class="text-gray-700">
              {{ authStore.user?.name }}
            </span>
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
              <span class="ml-1 text-sm font-medium text-gray-500">Корзина</span>
            </div>
          </li>
        </ol>
      </nav>

      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Корзина</h1>
        <p class="text-gray-600 mt-2">{{ cartStore.totalItems }} товар(ов) в корзине</p>
      </div>

      <!-- Пустая корзина -->
      <div v-if="cartStore.isEmpty" class="text-center py-12">
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
          />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">Корзина пуста</h3>
        <p class="mt-2 text-gray-500">Добавьте товары в корзину, чтобы продолжить покупки.</p>
        <router-link
          to="/shop"
          class="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Перейти в магазин
        </router-link>
      </div>

      <!-- Содержимое корзины -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Список товаров -->
        <div class="lg:col-span-2 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.productId"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <div class="flex items-center space-x-4">
              <!-- Изображение товара -->
              <div class="w-20 h-20 flex-shrink-0">
                <img
                  :src="item.product.images[0]"
                  :alt="item.product.name"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>

              <!-- Информация о товаре -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 truncate">
                  {{ item.product.name }}
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  {{ item.product.description.slice(0, 100) }}...
                </p>

                <!-- Цена -->
                <div class="flex items-center mt-2 space-x-2">
                  <span class="text-lg font-bold text-gray-900">
                    {{ formatPrice(item.product.price) }}
                  </span>
                  <span
                    v-if="item.product.originalPrice"
                    class="text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(item.product.originalPrice) }}
                  </span>
                </div>
              </div>

              <!-- Управление количеством -->
              <div class="flex items-center space-x-3">
                <button
                  @click="decreaseQuantity(item.productId)"
                  class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M20 12H4"
                    />
                  </svg>
                </button>

                <span class="w-8 text-center font-semibold">{{ item.quantity }}</span>

                <button
                  @click="increaseQuantity(item.productId)"
                  class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </button>
              </div>

              <!-- Общая стоимость товара -->
              <div class="text-right">
                <div class="text-lg font-bold text-gray-900">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </div>
                <button
                  @click="removeItem(item.productId)"
                  class="text-red-600 hover:text-red-800 text-sm transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Итоги заказа -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Итого</h3>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Товары ({{ cartStore.totalItems }})</span>
                <span class="font-semibold">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Доставка</span>
                <span class="font-semibold text-green-600">Бесплатно</span>
              </div>

              <hr class="my-4" />

              <div class="flex justify-between text-lg">
                <span class="font-semibold">Общая сумма</span>
                <span class="font-bold text-primary">{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="mt-6 space-y-3">
              <router-link
                to="/checkout"
                class="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors block text-center"
              >
                Оформить заказ
              </router-link>

              <router-link
                to="/shop"
                class="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors block text-center"
              >
                Продолжить покупки
              </router-link>

              <button
                @click="clearCart"
                class="w-full text-red-600 hover:text-red-800 py-2 transition-colors"
              >
                Очистить корзину
              </button>
            </div>

            <!-- Информация о доставке -->
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 class="text-sm font-medium text-blue-800 mb-2">Информация о доставке</h4>
              <ul class="text-xs text-blue-700 space-y-1">
                <li>• Бесплатная доставка от 3000 ₽</li>
                <li>• Доставка в течение 1-3 дней</li>
                <li>• Возможность примерки</li>
                <li>• Гарантия возврата 14 дней</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Рекомендуемые товары -->
      <div v-if="!cartStore.isEmpty && recommendedProducts.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Вам может понравиться</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in recommendedProducts"
            :key="product.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ product.name }}</h3>
              <div class="flex justify-between items-center mt-4">
                <span class="text-lg font-bold text-gray-900">
                  {{ formatPrice(product.price) }}
                </span>
                <button
                  @click="addToCart(product.id)"
                  class="bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/90 transition-colors"
                >
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
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import MockAPI, { type Product } from '@/services/api'

const authStore = useAuthStore()
const cartStore = useCartStore()
const recommendedProducts = ref<Product[]>([])

const loadRecommendedProducts = async () => {
  try {
    const products = await MockAPI.getProducts({ limit: 4 })
    // Исключаем товары, которые уже в корзине
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
    loadRecommendedProducts() // Обновляем рекомендации
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
    loadRecommendedProducts() // Обновляем рекомендации
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
  }
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

onMounted(() => {
  cartStore.initializeCart()
  loadRecommendedProducts()
})
</script>
