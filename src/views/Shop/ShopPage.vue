<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация (упрощенная версия) -->
    <nav class="bg-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link to="/" class="text-2xl font-bold text-primary">
            OnlineStore
          </router-link>
          
          <div class="flex items-center space-x-4">
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
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500">Магазин</span>
            </div>
          </li>
          <li v-if="selectedCategory">
            <div class="flex items-center">
              <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-500">{{ selectedCategory.name }}</span>
            </div>
          </li>
        </ol>
      </nav>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Боковая панель с фильтрами -->
        <aside class="lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Фильтры</h3>

            <!-- Поиск -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Поиск
              </label>
              <input
                v-model="filters.search"
                @input="applyFilters"
                type="text"
                placeholder="Поиск товаров..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <!-- Категории -->
            <div class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Категории</h4>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                    v-model="filters.categoryId"
                    :value="null"
                    @change="applyFilters"
                    type="radio"
                    name="category"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-sm text-gray-700">Все категории</span>
                </label>
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="flex items-center"
                >
                  <input
                    v-model="filters.categoryId"
                    :value="category.id"
                    @change="applyFilters"
                    type="radio"
                    name="category"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ category.name }}</span>
                </label>
              </div>
            </div>

            <!-- Сортировка -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <select
                v-model="filters.sortBy"
                @change="applyFilters"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
                <option value="name">По названию</option>
              </select>
            </div>

            <!-- Кнопка очистки фильтров -->
            <button
              @click="clearFilters"
              class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Очистить фильтры
            </button>
          </div>
        </aside>

        <!-- Основной контент -->
        <main class="flex-1">
          <!-- Заголовок и количество товаров -->
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                {{ selectedCategory ? selectedCategory.name : 'Все товары' }}
              </h1>
              <p class="text-gray-600 mt-1">
                {{ filteredProducts.length }} товар(ов) найдено
              </p>
            </div>

            <!-- Переключатель вида -->
            <div class="flex items-center space-x-2">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'p-2 rounded-lg',
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="[
                  'p-2 rounded-lg',
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Загрузка -->
          <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="animate-pulse">
              <div class="bg-gray-300 h-64 rounded-lg mb-4"></div>
              <div class="bg-gray-300 h-4 rounded mb-2"></div>
              <div class="bg-gray-300 h-4 rounded w-3/4 mb-2"></div>
              <div class="bg-gray-300 h-6 rounded w-1/2"></div>
            </div>
          </div>

          <!-- Список товаров (сетка) -->
          <div
            v-else-if="viewMode === 'grid'"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="product in filteredProducts"
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

          <!-- Список товаров (список) -->
          <div v-else-if="viewMode === 'list'" class="space-y-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div class="flex">
                <div class="w-48 h-48 flex-shrink-0">
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1 p-6">
                  <div class="flex justify-between">
                    <div class="flex-1">
                      <h3 class="text-xl font-semibold text-gray-900 hover:text-primary transition-colors">
                        {{ product.name }}
                      </h3>
                      <p class="text-gray-600 mt-2">
                        {{ product.description }}
                      </p>
                      
                      <div class="flex items-center mt-3">
                        <span class="text-yellow-400">★</span>
                        <span class="text-sm text-gray-600 ml-1">{{ product.rating }}</span>
                        <span class="text-sm text-gray-400 ml-1">({{ product.reviewsCount }} отзывов)</span>
                      </div>

                      <div class="flex flex-wrap gap-2 mt-3">
                        <span
                          v-for="feature in product.features.slice(0, 3)"
                          :key="feature"
                          class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {{ feature }}
                        </span>
                      </div>
                    </div>

                    <div class="flex flex-col items-end justify-between ml-6">
                      <div class="text-right">
                        <div class="text-2xl font-bold text-gray-900">
                          {{ formatPrice(product.price) }}
                        </div>
                        <div
                          v-if="product.originalPrice"
                          class="text-sm text-gray-500 line-through"
                        >
                          {{ formatPrice(product.originalPrice) }}
                        </div>
                      </div>
                      
                      <button
                        @click="addToCart(product.id)"
                        :disabled="cartStore.isLoading"
                        class="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        В корзину
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Пустое состояние -->
          <div
            v-else-if="!isLoading && filteredProducts.length === 0"
            class="text-center py-12"
          >
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V9a4 4 0 00-4-4H9a4 4 0 00-4 4v1.5M7 21h10" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Товары не найдены</h3>
            <p class="mt-1 text-sm text-gray-500">Попробуйте изменить фильтры поиска.</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import MockAPI, { type Category, type Product } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const selectedCategory = ref<Category | null>(null)
const isLoading = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')

const filters = reactive({
  categoryId: null as number | null,
  search: '',
  sortBy: 'default'
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  // Фильтрация по категории
  if (filters.categoryId) {
    result = result.filter(product => product.categoryId === filters.categoryId)
  }

  // Фильтрация по поиску
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }

  // Сортировка
  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return result
})

const loadCategories = async () => {
  try {
    categories.value = await MockAPI.getCategories()
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  }
}

const loadProducts = async () => {
  try {
    isLoading.value = true
    products.value = await MockAPI.getProducts()
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  } finally {
    isLoading.value = false
  }
}

const addToCart = async (productId: number) => {
  try {
    await cartStore.addToCart(productId)
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
  }
}

const applyFilters = () => {
  // Обновляем URL с параметрами фильтров
  const query: any = {}
  
  if (filters.categoryId) {
    const category = categories.value.find(c => c.id === filters.categoryId)
    if (category) {
      query.category = category.slug
    }
  }
  
  if (filters.search) {
    query.search = filters.search
  }
  
  if (filters.sortBy !== 'default') {
    query.sort = filters.sortBy
  }

  router.push({ query })
}

const clearFilters = () => {
  filters.categoryId = null
  filters.search = ''
  filters.sortBy = 'default'
  selectedCategory.value = null
  router.push({ query: {} })
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0
  }).format(price)
}

// Инициализация фильтров из URL
const initializeFromQuery = async () => {
  const query = route.query

  // Категория
  if (query.category) {
    const category = categories.value.find(c => c.slug === query.category)
    if (category) {
      filters.categoryId = category.id
      selectedCategory.value = category
    }
  }

  // Поиск
  if (query.search) {
    filters.search = query.search as string
  }

  // Сортировка
  if (query.sort) {
    filters.sortBy = query.sort as string
  }
}

// Наблюдение за изменениями маршрута
watch(() => route.query, () => {
  initializeFromQuery()
}, { deep: true })

onMounted(async () => {
  await loadCategories()
  await initializeFromQuery()
  await loadProducts()
  await cartStore.initializeCart()
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
