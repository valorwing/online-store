import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import MockAPI, { type Product, type CartItem } from '@/services/api'

interface CartItemWithProduct extends CartItem {
  product: Product
}

export const useCartStore = defineStore('cart', () => {
  // Состояние
  const items = ref<CartItemWithProduct[]>([])
  const isLoading = ref(false)

  // Вычисляемые свойства
  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  const isEmpty = computed(() => items.value.length === 0)

  // Инициализация корзины из localStorage
  const initializeCart = async () => {
    const savedCart = localStorage.getItem('cart_items')
    if (savedCart) {
      try {
        const cartItems: CartItem[] = JSON.parse(savedCart)
        isLoading.value = true

        // Загружаем данные о товарах
        const itemsWithProducts: CartItemWithProduct[] = []
        for (const item of cartItems) {
          const product = await MockAPI.getProductById(item.productId)
          if (product) {
            itemsWithProducts.push({
              ...item,
              product,
            })
          }
        }

        items.value = itemsWithProducts
      } catch (err) {
        console.error('Ошибка при загрузке корзины:', err)
        localStorage.removeItem('cart_items')
      } finally {
        isLoading.value = false
      }
    }
  }

  // Сохранение корзины в localStorage
  const saveCart = () => {
    const cartItems: CartItem[] = items.value.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }))
    localStorage.setItem('cart_items', JSON.stringify(cartItems))
  }

  // Добавление товара в корзину
  const addToCart = async (productId: number, quantity: number = 1) => {
    const existingItemIndex = items.value.findIndex((item) => item.productId === productId)

    if (existingItemIndex !== -1) {
      // Увеличиваем количество существующего товара
      items.value[existingItemIndex].quantity += quantity
    } else {
      // Добавляем новый товар
      const product = await MockAPI.getProductById(productId)
      if (!product) {
        throw new Error('Товар не найден')
      }

      items.value.push({
        productId,
        quantity,
        product,
      })
    }

    saveCart()
  }

  // Обновление количества товара
  const updateQuantity = (productId: number, quantity: number) => {
    const itemIndex = items.value.findIndex((item) => item.productId === productId)
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Удаляем товар если количество 0 или меньше
        items.value.splice(itemIndex, 1)
      } else {
        items.value[itemIndex].quantity = quantity
      }
      saveCart()
    }
  }

  // Удаление товара из корзины
  const removeFromCart = (productId: number) => {
    const itemIndex = items.value.findIndex((item) => item.productId === productId)
    if (itemIndex !== -1) {
      items.value.splice(itemIndex, 1)
      saveCart()
    }
  }

  // Очистка корзины
  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart_items')
  }

  // Получение количества конкретного товара в корзине
  const getItemQuantity = (productId: number): number => {
    const item = items.value.find((item) => item.productId === productId)
    return item?.quantity || 0
  }

  // Проверка, есть ли товар в корзине
  const isInCart = (productId: number): boolean => {
    return items.value.some((item) => item.productId === productId)
  }

  return {
    // Состояние
    items,
    isLoading,

    // Вычисляемые свойства
    totalItems,
    totalPrice,
    isEmpty,

    // Методы
    initializeCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    isInCart,
  }
})
