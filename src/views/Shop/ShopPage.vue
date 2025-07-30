<template>
  <div class="shop-page">
    <!-- Навигация -->
    <AppNavbar
      ref="navbar"
      :show-search="true"
      v-model="filters.search"
      :inital-value="(route.query.search as string) || ''"
      :keep-focus="(route.query.keepFocus as string) == 'true'"
      @update:modelValue="applyFilters"
    />
    <div class="container">
      <div class="shop-content">
        <!-- Боковая панель с фильтрами -->
        <aside class="filters-sidebar">
          <div class="card">
            <h3 class="filters-title">Фильтры</h3>

            <!-- Категории -->
            <div class="filter-group">
              <h4 class="filter-subtitle">Категории</h4>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="filters.categoryId"
                    :value="null"
                    @change="applyFilters"
                    type="radio"
                    name="category"
                  />
                  <span>Все категории</span>
                </label>
                <label v-for="category in categories" :key="category.id" class="radio-item">
                  <input
                    v-model="filters.categoryId"
                    :value="category.id"
                    @change="applyFilters"
                    type="radio"
                    name="category"
                  />
                  <span>{{ category.name }}</span>
                </label>
              </div>
            </div>

            <!-- Сортировка -->
            <div class="filter-group">
              <label class="form-label">Сортировка</label>
              <select v-model="filters.sortBy" @change="applyFilters" class="form-input">
                <option value="default">По умолчанию</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="rating">По рейтингу</option>
                <option value="name">По названию</option>
              </select>
            </div>

            <!-- Кнопка очистки фильтров -->
            <button @click="clearFilters" class="btn btn-secondary">Очистить фильтры</button>
          </div>
        </aside>

        <!-- Основной контент -->
        <main class="products-main">
          <!-- Заголовок и количество товаров -->
          <div class="products-header">
            <div>
              <h1 class="page-title">
                {{ selectedCategory ? selectedCategory.name : 'Все товары' }}
              </h1>
              <p class="products-count">{{ filteredProducts.length }} товар(ов) найдено</p>
            </div>

            <!-- Переключатель вида -->
            <div class="view-toggle">
              <button
                @click="viewMode = 'grid'"
                :class="['view-btn', { active: viewMode === 'grid' }]"
              >
                ⚏
              </button>
              <button
                @click="viewMode = 'list'"
                :class="['view-btn', { active: viewMode === 'list' }]"
              >
                ☰
              </button>
            </div>
          </div>

          <!-- Загрузка -->
          <div v-if="isLoading" class="loading">Загрузка товаров...</div>

          <!-- Список товаров (сетка) -->
          <div v-else-if="viewMode === 'grid'" class="products-grid">
            <div v-for="product in filteredProducts" :key="product.id" class="product-card">
              <div class="product-image-container">
                <img :src="product.images[0]" :alt="product.name" class="product-image" />
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description.slice(0, 100) }}...</p>

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

          <!-- Список товаров (список) -->
          <div v-else-if="viewMode === 'list'" class="products-list">
            <div v-for="product in filteredProducts" :key="product.id" class="product-list-item">
              <img :src="product.images[0]" :alt="product.name" class="product-list-image" />
              <div class="product-list-content">
                <div class="product-list-info">
                  <h3 class="product-name">{{ product.name }}</h3>
                  <p class="product-description">{{ product.description }}</p>

                  <div class="product-rating">
                    ⭐ {{ product.rating }} ({{ product.reviewsCount }} отзывов)
                  </div>

                  <div class="product-features">
                    <span
                      v-for="feature in product.features.slice(0, 3)"
                      :key="feature"
                      class="feature-tag"
                    >
                      {{ feature }}
                    </span>
                  </div>
                </div>

                <div class="product-list-actions">
                  <div class="product-price">
                    <div class="price-current">{{ formatPrice(product.price) }}</div>
                    <div v-if="product.originalPrice" class="price-original">
                      {{ formatPrice(product.originalPrice) }}
                    </div>
                  </div>

                  <button
                    @click="addToCart(product.id)"
                    :disabled="cartStore.isLoading"
                    class="btn btn-primary"
                  >
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Пустое состояние -->
          <div v-else-if="!isLoading && filteredProducts.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <h3 class="empty-title">Товары не найдены</h3>
            <p class="empty-description">Попробуйте изменить фильтры поиска.</p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { useCartStore } from '@/stores/cart'
import MockAPI, { type Category, type Product } from '@/services/api'

const route = useRoute()
const router = useRouter()

const cartStore = useCartStore()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const selectedCategory = ref<Category | null>(null)
const isLoading = ref(true)
const viewMode = ref<'grid' | 'list'>('grid')
const navbar = ref<InstanceType<typeof AppNavbar> | null>(null)
const filters = reactive({
  categoryId: null as number | null,
  search: '',
  sortBy: 'default',
})

const filteredProducts = computed(() => {
  let result = [...products.value]

  if (filters.categoryId) {
    result = result.filter((product) => product.categoryId === filters.categoryId)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    result = result.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower),
    )
  }

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {}

  if (filters.categoryId) {
    const category = categories.value.find((c) => c.id === filters.categoryId)
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

  router.replace({ query })
}

const clearFilters = () => {
  filters.categoryId = null
  filters.search = ''
  navbar.value?.cleanUp()
  filters.sortBy = 'default'
  selectedCategory.value = null
  router.replace({ query: {} })
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0,
  }).format(price)
}

const initializeFromQuery = async () => {
  const query = route.query

  if (query.category) {
    const category = categories.value.find((c) => c.slug === query.category)
    if (category) {
      filters.categoryId = category.id
      selectedCategory.value = category
    }
  }

  if (query.search) {
    filters.search = query.search as string
  }

  if (query.sort) {
    filters.sortBy = query.sort as string
  }
  if ((query.keepFocus as string) === 'true') {
    const newQuery = { ...route.query }
    delete newQuery['keepFocus']
    router.replace({
      query: newQuery,
    })
  }
}

watch(
  () => route.query,
  () => {
    initializeFromQuery()
  },
  { deep: true },
)

onMounted(async () => {
  await loadCategories()
  await initializeFromQuery()
  await loadProducts()
  await cartStore.initializeCart()
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

.cart-link {
  position: relative;
  padding: 8px;
  text-decoration: none;
  font-size: 20px;
  transition: transform 0.2s ease;
}

.cart-link:hover {
  transform: scale(1.1);
}

.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
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

/* Основной контент */
.shop-content {
  display: flex;
  gap: 32px;
}

/* Боковая панель */
.filters-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.filters-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-subtitle {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #374151;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.radio-item input[type='radio'] {
  accent-color: #2563eb;
}

/* Основной контент */
.products-main {
  flex: 1;
}

.products-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.products-count {
  color: #6b7280;
  font-size: 16px;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #f8fafc;
}

.view-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* Сетка товаров */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

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

.product-image {
  width: 100%;
  height: 240px;
  object-fit: cover;
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

/* Список товаров */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-list-item {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 24px;
  transition: all 0.2s ease;
}

.product-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-list-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.product-list-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.product-list-info {
  flex: 1;
}

.product-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.feature-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.product-list-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  min-width: 150px;
}

/* Пустое состояние */
.empty-state {
  text-align: center;
  padding: 80px 40px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.empty-description {
  color: #6b7280;
  font-size: 16px;
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
  .shop-content {
    flex-direction: column;
  }

  .filters-sidebar {
    width: 100%;
  }

  .products-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-list-item {
    flex-direction: column;
    text-align: center;
  }

  .product-list-image {
    width: 100%;
    height: 200px;
  }

  .product-list-content {
    flex-direction: column;
    gap: 16px;
  }

  .product-list-actions {
    align-items: center;
  }
}
</style>
