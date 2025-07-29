<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
    <!-- Навигация -->
    <nav class="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Логотип -->
          <div class="flex items-center">
            <router-link to="/" class="text-2xl font-bold text-gradient animate-pulse-gentle">
              ✨ OnlineStore
            </router-link>
          </div>

          <!-- Поиск -->
          <div class="flex-1 max-w-lg mx-8">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Найти что-то особенное..."
                class="w-full pl-12 pr-4 py-3 border-0 rounded-2xl bg-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/80 transition-all duration-300 shadow-card hover:shadow-card-hover"
              />
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              class="relative p-3 text-gray-600 hover:text-primary-500 transition-all duration-300 hover:bg-primary-50 rounded-xl group"
            >
              <svg class="h-6 w-6 group-hover:animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L3 3M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span
                v-if="cartStore.totalItems > 0"
                class="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-glow animate-pulse"
              >
                {{ cartStore.totalItems }}
              </span>
            </router-link>

            <!-- Меню пользователя -->
            <div v-if="authStore.isAuthenticated" class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 text-white hover:from-primary-600 hover:to-purple-600 transition-all duration-300 shadow-card hover:shadow-glow"
              >
                <span class="font-medium">{{ authStore.user?.name }}</span>
                <svg class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Выпадающее меню -->
              <div
                v-if="showUserMenu"
                v-click-outside="() => showUserMenu = false"
                class="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl py-2 z-50 animate-slide-up"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-white/20 hover:text-primary-600 transition-colors"
                >
                  👤 Профиль
                </router-link>
                <router-link
                  to="/orders"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-white/20 hover:text-primary-600 transition-colors"
                >
                  📦 Мои заказы
                </router-link>
                <router-link
                  v-if="authStore.isAdmin"
                  to="/admin"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-white/20 hover:text-primary-600 transition-colors"
                >
                  ⚙️ Админ панель
                </router-link>
                <hr class="my-1 border-white/20" />
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-white/20 hover:text-error-600 transition-colors"
                >
                  🚪 Выйти
                </button>
              </div>
            </div>

            <!-- Кнопка входа -->
            <router-link
              v-else
              to="/login"
              class="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-primary-600 hover:to-purple-600 transition-all duration-300 shadow-card hover:shadow-glow font-medium"
            >
              🔐 Войти
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Контент -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Герой секция -->
      <section class="relative bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl text-white p-12 mb-16 overflow-hidden shadow-xl animate-fade-in">
        <!-- Фоновые элементы -->
        <div class="absolute top-0 left-0 w-full h-full opacity-10">
          <div class="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div class="absolute top-20 right-20 w-12 h-12 bg-white rounded-full animate-float" style="animation-delay: 1s;"></div>
          <div class="absolute bottom-10 left-1/3 w-16 h-16 bg-white rounded-full animate-float" style="animation-delay: 2s;"></div>
        </div>
        
        <div class="relative z-10 max-w-4xl">
          <h1 class="text-5xl font-bold mb-6 animate-slide-up">
            Добро пожаловать в мир
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              удивительных покупок! 🛍️
            </span>
          </h1>
          <p class="text-xl mb-8 text-white/90 animate-slide-up" style="animation-delay: 0.2s;">
            Откройте для себя тысячи качественных товаров по лучшим ценам. 
            Быстрая доставка, гарантия качества и превосходный сервис! ✨
          </p>
          <div class="flex flex-wrap gap-4">
            <router-link
              to="/shop"
              class="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-slide-up"
              style="animation-delay: 0.4s;"
            >
              🚀 Начать покупки
            </router-link>
            <button class="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all duration-300 animate-slide-up" style="animation-delay: 0.6s;">
              📱 Скачать приложение
            </button>
          </div>
        </div>
      </section>

      <!-- Особенности магазина -->
      <section class="mb-16 animate-fade-in">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105">
            <div class="text-4xl mb-4">🚚</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Быстрая доставка</h3>
            <p class="text-gray-600">Доставка от 1 дня по всей России</p>
          </div>
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105">
            <div class="text-4xl mb-4">🛡️</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Гарантия качества</h3>
            <p class="text-gray-600">100% оригинальные товары</p>
          </div>
          <div class="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Лучшие цены</h3>
            <p class="text-gray-600">Выгодные предложения каждый день</p>
          </div>
        </div>
      </section>

      <!-- Категории -->
      <section class="mb-16">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gradient mb-4">Популярные категории</h2>
          <p class="text-xl text-gray-600">Найдите именно то, что искали</p>
        </div>
        
        <div v-if="isLoadingCategories" class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="bg-gradient-to-br from-gray-200 to-gray-300 h-56 rounded-2xl mb-4"></div>
            <div class="bg-gray-300 h-4 rounded-xl mb-2"></div>
            <div class="bg-gray-300 h-3 rounded-xl w-2/3"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            @click="goToCategory(category)"
            class="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-500 hover:scale-105 animate-fade-in"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl">
              <img
                :src="category.image"
                :alt="category.name"
                class="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-600 line-clamp-2">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Популярные товары -->
      <section>
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-4xl font-bold text-gradient mb-4">Хиты продаж</h2>
            <p class="text-xl text-gray-600">Самые популярные товары этого месяца</p>
          </div>
          <router-link
            to="/shop"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-bold transition-colors group"
          >
            Смотреть все
            <svg class="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </router-link>
        </div>

        <div v-if="isLoadingProducts" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="n in 4" :key="n" class="animate-pulse">
            <div class="bg-gradient-to-br from-gray-200 to-gray-300 h-72 rounded-2xl mb-4"></div>
            <div class="bg-gray-300 h-4 rounded-xl mb-2"></div>
            <div class="bg-gray-300 h-4 rounded-xl w-3/4 mb-2"></div>
            <div class="bg-gray-300 h-6 rounded-xl w-1/2"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(product, index) in featuredProducts"
            :key="product.id"
            class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-card hover:shadow-xl transition-all duration-500 hover:scale-105 overflow-hidden animate-fade-in"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="relative aspect-w-1 aspect-h-1 w-full overflow-hidden">
              <img
                :src="product.images[0]"
                :alt="product.name"
                class="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <!-- Ски��ка badge -->
              <div
                v-if="product.originalPrice"
                class="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
              >
                -{{ Math.round((1 - product.price / product.originalPrice) * 100) }}%
              </div>
              <!-- Overlay на hover -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <button
                  @click="addToCart(product.id)"
                  class="w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                >
                  🛒 В корзину
                </button>
              </div>
            </div>
            
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                {{ product.description }}
              </p>
              
              <div class="flex items-center mb-4">
                <div class="flex items-center mr-3">
                  <span class="text-yellow-400 text-lg">⭐</span>
                  <span class="text-sm text-gray-600 ml-1 font-medium">{{ product.rating }}</span>
                  <span class="text-sm text-gray-400 ml-1">({{ product.reviewsCount }})</span>
                </div>
              </div>

              <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
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
                  class="bg-gradient-to-r from-primary-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-primary-600 hover:to-purple-600 disabled:opacity-50 transition-all duration-300 font-bold shadow-card hover:shadow-glow"
                >
                  ✨ Купить
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="mt-20 text-center">
        <div class="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div class="absolute inset-0 bg-hero-pattern opacity-10"></div>
          <div class="relative z-10">
            <h2 class="text-4xl font-bold mb-4">Готовы начать покупки? 🎉</h2>
            <p class="text-xl mb-8 text-white/90">Присоединяйтесь к тысячам довольных покупателей</p>
            <div class="flex flex-wrap justify-center gap-4">
              <router-link
                to="/shop"
                class="bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl hover:scale-105"
              >
                🛍️ Перейти в каталог
              </router-link>
              <router-link
                to="/login"
                class="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/30 transition-all duration-300"
              >
                👤 Зарегистрироваться
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Футер -->
    <footer class="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="md:col-span-2">
            <h3 class="text-2xl font-bold text-gradient mb-4">✨ OnlineStore</h3>
            <p class="text-gray-300 mb-6 text-lg">
              Ваш надежный партнер в мире онлайн покупок. 
              Качество, скорость, удобство - всё для вашего комфорта! 🌟
            </p>
            <div class="flex space-x-4">
              <a href="#" class="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors">
                📘
              </a>
              <a href="#" class="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center hover:bg-blue-500 transition-colors">
                🐦
              </a>
              <a href="#" class="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors">
                📸
              </a>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">🏢 Компания</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">О нас</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Контакты</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Вакансии</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Пресс-центр</a></li>
            </ul>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-4">🛠️ Поддержка</h3>
            <ul class="space-y-2 text-gray-300">
              <li><a href="#" class="hover:text-white transition-colors">Помощь</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Доставка</a></li>
              <li><a href="#" class="hover:text-white transition-colors">Возврат</a></li>
              <li><a href="#" class="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-12 pt-8 text-center">
          <p class="text-gray-400">
            &copy; 2024 OnlineStore. Все права защищены. Сделано с ❤️ для вас!
          </p>
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
    const product = featuredProducts.value.find(p => p.id === productId)
    notificationStore.success(
      '🛒 Товар добавлен!',
      product ? `${product.name} добавлен в корзину` : undefined
    )
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
    notificationStore.error('❌ Ошибка', 'Не удалось добавить товар в корзину')
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
  notificationStore.info('👋 До свидания!', 'Вы успешно вышли из системы')
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

/* Дополнительные анимации */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
