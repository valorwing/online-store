<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Навигация админки -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-2xl font-bold text-primary">
              OnlineStore Admin
            </router-link>
            <span class="text-gray-400">|</span>
            <span class="text-gray-600">Панель администратора</span>
          </div>

          <div class="flex items-center space-x-4">
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
      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Админ панель</h1>
        <p class="text-gray-600 mt-2">Управление категориями и товарами</p>
      </div>

      <!-- Табы -->
      <div class="mb-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              @click="activeTab = 'categories'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'categories'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Категории
            </button>
            <button
              @click="activeTab = 'products'"
              :class="[
                'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === 'products'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              ]"
            >
              Товары
            </button>
          </nav>
        </div>
      </div>

      <!-- Управление категориями -->
      <div v-if="activeTab === 'categories'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Категории</h2>
          <button
            @click="openCategoryModal()"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Добавить категорию
          </button>
        </div>

        <!-- Список категорий -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Изображение
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Название
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Описание
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Статус
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img
                    :src="category.image"
                    :alt="category.name"
                    class="h-12 w-12 rounded-lg object-cover"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ category.name }}</div>
                  <div class="text-sm text-gray-500">{{ category.slug }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900 max-w-xs truncate">
                    {{ category.description }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ category.isActive ? 'Активна' : 'Неактивна' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="openCategoryModal(category)"
                    class="text-primary hover:text-primary/80 transition-colors"
                  >
                    Редактировать
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Управление товарами -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-900">Товары</h2>
          <button
            @click="openProductModal()"
            class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Добавить товар
          </button>
        </div>

        <!-- Список товаров -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Изображение
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Название
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Цен��
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Категория
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Остаток
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Статус
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in products" :key="product.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="h-12 w-12 rounded-lg object-cover"
                  />
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 max-w-xs truncate">
                    {{ product.name }}
                  </div>
                  <div class="text-sm text-gray-500">{{ product.slug }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatPrice(product.price) }}</div>
                  <div v-if="product.originalPrice" class="text-sm text-gray-500 line-through">
                    {{ formatPrice(product.originalPrice) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ getCategoryName(product.categoryId) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    :class="[
                      'text-sm',
                      product.stock > 10
                        ? 'text-green-600'
                        : product.stock > 0
                          ? 'text-yellow-600'
                          : 'text-red-600',
                    ]"
                  >
                    {{ product.stock }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ product.isActive ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="openProductModal(product)"
                    class="text-primary hover:text-primary/80 transition-colors"
                  >
                    Редактировать
                  </button>
                  <button
                    @click="deleteProduct(product.id)"
                    class="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Модальное окно категории -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeCategoryModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingCategory ? 'Редактировать категорию' : 'Добавить категорию' }}
        </h3>

        <form @submit.prevent="saveCategoryModal" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              v-model="categoryForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
            <input
              v-model="categoryForm.image"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="categoryForm.isActive"
              type="checkbox"
              class="text-primary focus:ring-primary"
            />
            <label class="ml-2 text-sm text-gray-700">Активна</label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeCategoryModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно товара -->
    <div
      v-if="showProductModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeProductModal"
    >
      <div
        class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}
        </h3>

        <form @submit.prevent="saveProductModal" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Название</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
              <select
                v-model="productForm.categoryId"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Выберите категорию</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea
              v-model="productForm.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            ></textarea>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Цена</label>
              <input
                v-model.number="productForm.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Стара�� цена</label>
              <input
                v-model.number="productForm.originalPrice"
                type="number"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Остаток</label>
              <input
                v-model.number="productForm.stock"
                type="number"
                min="0"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL изображения</label>
            <input
              v-model="productForm.imageUrl"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Особенности (через запятую)</label
            >
            <input
              v-model="productForm.featuresText"
              type="text"
              placeholder="Быстрая доставка, Гарантия качества"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div class="flex items-center">
            <input
              v-model="productForm.isActive"
              type="checkbox"
              class="text-primary focus:ring-primary"
            />
            <label class="ml-2 text-sm text-gray-700">Активен</label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeProductModal"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import MockAPI, { type Category, type Product } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref<'categories' | 'products'>('categories')
const categories = ref<Category[]>([])
const products = ref<Product[]>([])

// Модальные окна
const showCategoryModal = ref(false)
const showProductModal = ref(false)
const editingCategory = ref<Category | null>(null)
const editingProduct = ref<Product | null>(null)
const isSaving = ref(false)

// Формы
const categoryForm = reactive({
  name: '',
  description: '',
  image: '',
  isActive: true,
})

const productForm = reactive({
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  categoryId: '',
  stock: 0,
  imageUrl: '',
  featuresText: '',
  isActive: true,
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
    products.value = await MockAPI.getProducts()
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  }
}

const openCategoryModal = (category?: Category) => {
  editingCategory.value = category || null

  if (category) {
    categoryForm.name = category.name
    categoryForm.description = category.description
    categoryForm.image = category.image
    categoryForm.isActive = category.isActive
  } else {
    categoryForm.name = ''
    categoryForm.description = ''
    categoryForm.image = ''
    categoryForm.isActive = true
  }

  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
}

const saveCategoryModal = async () => {
  try {
    isSaving.value = true

    const categoryData = {
      name: categoryForm.name,
      slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: categoryForm.description,
      image:
        categoryForm.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      isActive: categoryForm.isActive,
    }

    if (editingCategory.value) {
      await MockAPI.updateCategory(editingCategory.value.id, categoryData)
    } else {
      await MockAPI.createCategory(categoryData)
    }

    await loadCategories()
    closeCategoryModal()
  } catch (error) {
    console.error('Ошибка сохранения категории:', error)
    alert('Ошибка сохранения категории')
  } finally {
    isSaving.value = false
  }
}

const deleteCategory = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
    return
  }

  try {
    await MockAPI.deleteCategory(id)
    await loadCategories()
  } catch (error) {
    console.error('Ошибка удаления категории:', error)
    alert('Ошибка удаления категории')
  }
}

const openProductModal = (product?: Product) => {
  editingProduct.value = product || null

  if (product) {
    productForm.name = product.name
    productForm.description = product.description
    productForm.price = product.price
    productForm.originalPrice = product.originalPrice
    productForm.categoryId = product.categoryId.toString()
    productForm.stock = product.stock
    productForm.imageUrl = product.images[0] || ''
    productForm.featuresText = product.features.join(', ')
    productForm.isActive = product.isActive
  } else {
    productForm.name = ''
    productForm.description = ''
    productForm.price = 0
    productForm.originalPrice = undefined
    productForm.categoryId = ''
    productForm.stock = 0
    productForm.imageUrl = ''
    productForm.featuresText = ''
    productForm.isActive = true
  }

  showProductModal.value = true
}

const closeProductModal = () => {
  showProductModal.value = false
  editingProduct.value = null
}

const saveProductModal = async () => {
  try {
    isSaving.value = true

    const productData = {
      name: productForm.name,
      slug: productForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: productForm.description,
      price: productForm.price,
      originalPrice: productForm.originalPrice || undefined,
      images: [
        productForm.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      ],
      categoryId: parseInt(productForm.categoryId),
      stock: productForm.stock,
      isActive: productForm.isActive,
      rating: 4.5,
      reviewsCount: 0,
      features: productForm.featuresText
        ? productForm.featuresText.split(',').map((f) => f.trim())
        : [],
    }

    if (editingProduct.value) {
      await MockAPI.updateProduct(editingProduct.value.id, productData)
    } else {
      await MockAPI.createProduct(productData)
    }

    await loadProducts()
    closeProductModal()
  } catch (error) {
    console.error('Ошибка сохранения товара:', error)
    alert('Ошибка сохранения товара')
  } finally {
    isSaving.value = false
  }
}

const deleteProduct = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
    return
  }

  try {
    await MockAPI.deleteProduct(id)
    await loadProducts()
  } catch (error) {
    console.error('Ошибка удаления товара:', error)
    alert('Ошибка удаления товара')
  }
}

const getCategoryName = (categoryId: number): string => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category?.name || 'Неизвестная категория'
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(price)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>
