<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Логотип -->
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-primary">
              OnlineStore
            </router-link>
          </div>

          <!-- Поиск -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Поиск товаров..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Навигация справа -->
          <div class="flex items-center space-x-4">
            <!-- Корзина -->
            <router-link
              to="/cart"
              class="relative p-2 text-gray-600 hover:text-primary transition-colors"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span
                v-if="cartStore.totalItems > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ cartStore.totalItems }}
              </span>
            </router-link>

            <!-- Меню пользователя -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors"
              >
                <span>{{ authStore.user?.name }}</span>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Выпадающее меню -->
              <div
                v-if="showUserMenu"
                v-click-outside="() => showUserMenu = false"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Профиль
                </router-link>
                <router-link
                  to="/orders"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Мои заказы
                </router-link>
                <router-link
                  v-if="authStore.isAdmin"
                  to="/admin"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Админ панель
                </router-link>
                <hr class="my-1" />
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Выйти
                </button>
              </div>
            </div>

            <!-- Кнопка входа -->
            <router-link
              v-else
              to="/login"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Войти
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Контент -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Герой секция -->
      <section class="bg-gradient-to-r from-primary to-primary/80 rounded-xl text-white p-8 mb-12">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold mb-4">
            Добро пожаловать в наш интернет-магазин!
          </h1>
          <p class="text-xl mb-6">
            Найдите лучшие товары по выгодным ценам. Быстрая доставка и гарантия качества.
          </p>
          <router-link
            to="/shop"
            class="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Начать покупки
          </router-link>
        </div>
      </section>

      <!-- Категории -->
      <section class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Популярные категории</h2>
        
        <div v-if="isLoadingCategories" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="bg-gray-300 h-48 rounded-lg mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-3 rounded w-2/3"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="goToCategory(category)"
            class="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Популярные товары -->
      <section>
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Популярные товары</h2>
          <router-link
            to="/shop"
            class="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Смотреть все →
          </router-link>
        </div>

        <div v-if="isLoadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="bg-gray-300 h-64 rounded-lg mb-4"></div>
            <div class="bg-gray-300 h-4 rounded mb-2"></div>
            <div class="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
            <div class="bg-gray-300 h-6 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in featuredProducts"
            :key="product.id"
            class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg">
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                {{ product.description }}
              </p>
              
              <div class="flex items-center mt-2">
                <div class="flex items-center">
                  <span class="text-yellow-400">★</span>
                  <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
                  <span class="text-sm text-gray-400 ml-1">({{ product.reviewsCount }})</span>
                </div>
              </div>

              <div class="flex justify-between items-center mt-4">
                <div class="flex items-center space-x-2">
                  <span class="text-xl font-bold text-gray-900">
                    {{ formatPrice(product.price) }}
                  </span>
                  <span
                    v-if="product.originalPrice"
                    class="text-sm text-gray-500 line-through"
                  >
                    {{ formatPrice(product.originalPrice) }}
                  </span>
                </div>
                
                <button
                  @click="addToCart(product.id)"
                  :disabled="cartStore.isLoading"
                  class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Футер -->
    <footer class="bg-gray-900 text-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">OnlineStore</h3>
            <p class="text-gray-400">
              Ваш надежный партнер в мире онлайн покупок
            </p>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Компания</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">О нас</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Контакты</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Вакансии</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Поддержка</h3>
            <ul class="space-y-2 text-gray-400">
              <li><a href="#" class="hover:text-white transition-colors">Помощь</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Доставка</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Возврат</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Следите за нами</h3>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Facebook
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" class="text-gray-400 hover:text-white transition-colors">
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
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
import MockAPI, { type Category, type Product } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const categories = ref<Category[]>([])
const featuredProducts = ref<Product[]>([])
const isLoadingCategories = ref(true)
const isLoadingProducts = ref(true)
const searchQuery = ref('')
const showUserMenu = ref(false)

const loadCategories = async () => {
  try {
    isLoadingCategories.value = true
    categories.value = await MockAPI.getCategories()
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
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
  } finally {
    isLoadingProducts.value = false
  }
}

const addToCart = async (productId: number) => {
  try {
    await cartStore.addToCart(productId)
    // Можно добавить уведомление об успешном добавлении
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
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
  router.push('/')
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
}

// Директива для закрытия меню при клике вне его
const vClickOutside = {
  mounted(el: HTMLElement, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadFeaturedProducts(),
    cartStore.initializeCart()
  ])
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
