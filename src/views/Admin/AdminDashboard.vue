<template>
  <div class="admin-page">
    <!-- Навигация админки -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-content">
          <div class="nav-left">
            <router-link to="/" class="logo">
              OnlineStore Admin
            </router-link>
            <span class="nav-divider">|</span>
            <span class="nav-subtitle">Панель адміністратора</span>
          </div>

          <div class="nav-actions">
            <span class="user-name">{{ authStore.user?.name }}</span>
            <button @click="handleLogout" class="logout-btn">
              Выйти
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="container">
      <!-- Заголовок -->
      <div class="page-header">
        <h1 class="page-title">Адмін панель</h1>
        <p class="page-subtitle">Управління категоріями та товарами</p>
      </div>

      <!-- Табы -->
      <div class="tabs">
        <button
          @click="activeTab = 'categories'"
          :class="['tab', { active: activeTab === 'categories' }]"
        >
          Категорії
        </button>
        <button
          @click="activeTab = 'products'"
          :class="['tab', { active: activeTab === 'products' }]"
        >
          Товари
        </button>
      </div>

      <!-- Управление категориями -->
      <div v-if="activeTab === 'categories'" class="tab-content">
        <div class="section-header">
          <h2 class="section-title">Категории</h2>
          <button @click="openCategoryModal()" class="btn btn-primary">
            Добавить категорию
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in categories" :key="category.id">
                <td>
                  <img
                    :src="category.image"
                    :alt="category.name"
                    class="table-image"
                  />
                </td>
                <td>
                  <div class="table-cell-main">{{ category.name }}</div>
                  <div class="table-cell-sub">{{ category.slug }}</div>
                </td>
                <td>
                  <div class="table-description">{{ category.description }}</div>
                </td>
                <td>
                  <span :class="['status-badge', category.isActive ? 'active' : 'inactive']">
                    {{ category.isActive ? 'Активна' : 'Неактивна' }}
                  </span>
                </td>
                <td>
                  <div class="table-actions">
                    <button
                      @click="openCategoryModal(category)"
                      class="action-btn edit"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="deleteCategory(category.id)"
                      class="action-btn delete"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Управление товарами -->
      <div v-if="activeTab === 'products'" class="tab-content">
        <div class="section-header">
          <h2 class="section-title">Товары</h2>
          <button @click="openProductModal()" class="btn btn-primary">
            Добавить товар
          </button>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Изображение</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Категория</th>
                <th>Остаток</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>
                  <img
                    :src="product.images[0]"
                    :alt="product.name"
                    class="table-image"
                  />
                </td>
                <td>
                  <div class="table-cell-main">{{ product.name }}</div>
                  <div class="table-cell-sub">{{ product.slug }}</div>
                </td>
                <td>
                  <div class="table-cell-main">{{ formatPrice(product.price) }}</div>
                  <div v-if="product.originalPrice" class="table-cell-sub line-through">
                    {{ formatPrice(product.originalPrice) }}
                  </div>
                </td>
                <td>
                  {{ getCategoryName(product.categoryId) }}
                </td>
                <td>
                  <span
                    :class="[
                      'stock-count',
                      product.stock > 10 ? 'high' : product.stock > 0 ? 'medium' : 'low'
                    ]"
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td>
                  <span :class="['status-badge', product.isActive ? 'active' : 'inactive']">
                    {{ product.isActive ? 'Активен' : 'Неактивен' }}
                  </span>
                </td>
                <td>
                  <div class="table-actions">
                    <button
                      @click="openProductModal(product)"
                      class="action-btn edit"
                    >
                      Редактировать
                    </button>
                    <button
                      @click="deleteProduct(product.id)"
                      class="action-btn delete"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Модальное окно категории -->
    <div v-if="showCategoryModal" class="modal-overlay" @click="closeCategoryModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingCategory ? 'Редактировать категорию' : 'Добавить категорию' }}
          </h3>
        </div>

        <form @submit.prevent="saveCategoryModal" class="modal-form">
          <div class="form-group">
            <label class="form-label">Название</label>
            <input
              v-model="categoryForm.name"
              type="text"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Описание</label>
            <textarea
              v-model="categoryForm.description"
              rows="3"
              class="form-input"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">URL изображения</label>
            <input
              v-model="categoryForm.image"
              type="url"
              class="form-input"
            />
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="categoryForm.isActive"
                type="checkbox"
              />
              <span>Активна</span>
            </label>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              @click="closeCategoryModal"
              class="btn btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="btn btn-primary"
            >
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно товара -->
    <div v-if="showProductModal" class="modal-overlay" @click="closeProductModal">
      <div class="modal modal-large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ editingProduct ? 'Редактировать товар' : 'Добавить товар' }}
          </h3>
        </div>

        <form @submit.prevent="saveProductModal" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Название</label>
              <input
                v-model="productForm.name"
                type="text"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Категория</label>
              <select
                v-model="productForm.categoryId"
                required
                class="form-input"
              >
                <option value="">Выберите категорию</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Описание</label>
            <textarea
              v-model="productForm.description"
              rows="3"
              class="form-input"
            ></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Цена</label>
              <input
                v-model.number="productForm.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Старая цена</label>
              <input
                v-model.number="productForm.originalPrice"
                type="number"
                min="0"
                step="0.01"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Остаток</label>
              <input
                v-model.number="productForm.stock"
                type="number"
                min="0"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">URL изображения</label>
            <input
              v-model="productForm.imageUrl"
              type="url"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Особенности (через запятую)</label>
            <input
              v-model="productForm.featuresText"
              type="text"
              placeholder="Быстрая доставка, Гарантия качества"
              class="form-input"
            />
          </div>

          <div class="checkbox-group">
            <label class="checkbox-label">
              <input
                v-model="productForm.isActive"
                type="checkbox"
              />
              <span>Активен</span>
            </label>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              @click="closeProductModal"
              class="btn btn-secondary"
            >
              Отмена
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="btn btn-primary"
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
  isActive: true
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
  isActive: true
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
      image: categoryForm.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      isActive: categoryForm.isActive
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
      images: [productForm.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'],
      categoryId: parseInt(productForm.categoryId),
      stock: productForm.stock,
      isActive: productForm.isActive,
      rating: 4.5,
      reviewsCount: 0,
      features: productForm.featuresText ? productForm.featuresText.split(',').map(f => f.trim()) : []
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
  const category = categories.value.find(c => c.id === categoryId)
  return category?.name || 'Неизвестная категория'
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
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

<style scoped>
/* Навигация */
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
}

.nav-divider {
  color: #9ca3af;
}

.nav-subtitle {
  color: #6b7280;
  font-size: 14px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  color: #374151;
  font-weight: 500;
}

.logout-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
}

.logout-btn:hover {
  color: #1f2937;
}

/* Заголовок */
.page-header {
  margin-bottom: 32px;
  padding-top: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #6b7280;
  font-size: 16px;
}

/* Табы */
.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 32px;
}

.tab {
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

/* Контент вкладок */
.tab-content {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
}

/* Таблицы */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8fafc;
  padding: 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
}

.data-table tr:hover {
  background: #f9fafb;
}

.table-image {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
}

.table-cell-main {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.table-cell-sub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}

.table-description {
  max-width: 200px;
  font-size: 14px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-through {
  text-decoration: line-through;
}

/* Статусы и значки */
.status-badge {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.stock-count {
  font-size: 14px;
  font-weight: 600;
}

.stock-count.high {
  color: #059669;
}

.stock-count.medium {
  color: #d97706;
}

.stock-count.low {
  color: #dc2626;
}

/* Действия в таблице */
.table-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: none;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.edit {
  color: #2563eb;
}

.action-btn.edit:hover {
  background: #eff6ff;
}

.action-btn.delete {
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #fef2f2;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 600px;
}

.modal-header {
  padding: 24px 24px 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
}

.checkbox-group {
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  accent-color: #2563eb;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-content {
    flex-direction: column;
    height: auto;
    padding: 16px 0;
    gap: 16px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .data-table {
    min-width: 800px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
