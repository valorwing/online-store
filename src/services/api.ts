// Типы данных для API
export interface User {
  id: number
  email: string
  password?: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image: string
  parentId?: number
  isActive: boolean
  createdAt: string
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: number
  stock: number
  isActive: boolean
  rating: number
  reviewsCount: number
  features: string[]
  createdAt: string
}

export interface CartItem {
  productId: number
  quantity: number
}

export interface Order {
  id: number
  userId: number
  items: Array<{
    productId: number
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'payment_failed'
  paymentMethod: string
  shippingAddress: {
    fullName: string
    address: string
    city: string
    postalCode: string
    phone: string
  }
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: Omit<User, 'password'>
}

export interface PaymentMethod {
  id: string
  name: string
  icon: string
  description: string
  isActive: boolean
}

// Mock базы данных с демо-данными
class MockDatabase {
  private users: User[] = [
    {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Администратор',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      email: 'user@example.com',
      password: 'user123',
      name: 'Пользователь',
      role: 'user',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]

  private categories: Category[] = [
    {
      id: 1,
      name: 'Электроника',
      slug: 'electronics',
      description: 'Современная электроника и гаджеты',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Смартфоны',
      slug: 'smartphones',
      description: 'Современные смартфоны всех брендов',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      parentId: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'Ноутбуки',
      slug: 'laptops',
      description: 'Мощные ноутбуки для работы и игр',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      parentId: 1,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      name: 'Одежда',
      slug: 'clothing',
      description: 'Модная одежда для всех сезонов',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 5,
      name: 'Дом и сад',
      slug: 'home-garden',
      description: 'Товары для дома и сада',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]

  private products: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description: 'Революционный смартфон с титановым корпусом и камерой Pro',
      price: 48000,
      originalPrice: 52000,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
        'https://images.unsplash.com/photo-1695048142956-91a5e94aaacf?w=600',
      ],
      categoryId: 2,
      stock: 15,
      isActive: true,
      rating: 4.8,
      reviewsCount: 127,
      features: ['6.1" Super Retina XDR', 'A17 Pro чип', '48MP камера', '5G'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Флагманский смартфон с S Pen и невероятной камерой',
      price: 46000,
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600'],
      categoryId: 2,
      stock: 8,
      isActive: true,
      rating: 4.7,
      reviewsCount: 95,
      features: ['6.8" Dynamic AMOLED', 'Snapdragon 8 Gen 3', '200MP камера', 'S Pen'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      description: 'Сверхтонкий и мощный ноутбук на чипе M3',
      price: 60000,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600'],
      categoryId: 3,
      stock: 12,
      isActive: true,
      rating: 4.9,
      reviewsCount: 203,
      features: ['13.6" Liquid Retina', 'M3 чип', '18 часов работы', 'MagSafe 3'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 4,
      name: 'Dell XPS 13',
      slug: 'dell-xps-13',
      description: 'Компактный ноутбук для профессионалов',
      price: 38000,
      originalPrice: 42000,
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600'],
      categoryId: 3,
      stock: 6,
      isActive: true,
      rating: 4.6,
      reviewsCount: 78,
      features: ['13.4" FHD+', 'Intel i7-1365U', '16GB RAM', 'Thunderbolt 4'],
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 5,
      name: 'Кофемашина Delonghi',
      slug: 'delonghi-coffee-machine',
      description: 'Автоматическая кофемашина с капучинатором',
      price: 18000,
      images: ['https://images.unsplash.com/photo-1545665277-5937750217c5?w=600'],
      categoryId: 5,
      stock: 20,
      isActive: true,
      rating: 4.5,
      reviewsCount: 156,
      features: ['15 бар давления', 'Автокапучинатор', '1.8л резервуар', 'LCD дисплей'],
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]

  private orders: Order[] = [
    // Демо заказы для пользователя с ID 2 (user@example.com)
    {
      id: 1,
      userId: 2,
      items: [
        { productId: 1, quantity: 1, price: 48000 },
        { productId: 5, quantity: 1, price: 18000 },
      ],
      totalAmount: 66000,
      status: 'delivered',
      paymentMethod: 'card',
      shippingAddress: {
        fullName: 'Іван Петренко',
        address: 'вул. Хрещатик, 22, кв. 15',
        city: 'Київ',
        postalCode: '01001',
        phone: '+380 (67) 123-45-67',
      },
      createdAt: '2024-01-15T10:30:00Z',
    },
    {
      id: 2,
      userId: 2,
      items: [{ productId: 3, quantity: 1, price: 60000 }],
      totalAmount: 60000,
      status: 'shipped',
      paymentMethod: 'privat24',
      shippingAddress: {
        fullName: 'Іван Петренко',
        address: 'вул. Хрещатик, 22, кв. 15',
        city: 'Київ',
        postalCode: '01001',
        phone: '+380 (67) 123-45-67',
      },
      createdAt: '2024-01-20T14:15:00Z',
    },
    {
      id: 3,
      userId: 2,
      items: [{ productId: 2, quantity: 1, price: 46000 }],
      totalAmount: 46000,
      status: 'payment_failed',
      paymentMethod: 'card',
      shippingAddress: {
        fullName: 'Іван Петренко',
        address: 'вул. Хрещатик, 22, кв. 15',
        city: 'Київ',
        postalCode: '01001',
        phone: '+380 (67) 123-45-67',
      },
      createdAt: '2024-01-22T09:45:00Z',
    },
  ]
  private currentOrderId = 4

  private paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Банківська карта',
      icon: '💳',
      description: 'Visa, MasterCard, Приват24',
      isActive: true,
    },
    {
      id: 'monobank',
      name: 'Monobank',
      icon: '🏦',
      description: 'Швидка оплата через Monobank',
      isActive: true,
    },
    {
      id: 'privat24',
      name: 'Приват24',
      icon: '🟣',
      description: 'Оплата через ПриватБанк',
      isActive: true,
    },
    {
      id: 'fondy',
      name: 'Fondy',
      icon: '🔷',
      description: 'Українська платіжна система',
      isActive: true,
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: '🌐',
      description: 'Міжнародна платіжна система',
      isActive: true,
    },
  ]

  // Методы для работы с пользователями
  findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email)
  }

  findUserById(id: number): User | undefined {
    return this.users.find((user) => user.id === id)
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...userData,
      id: Math.max(...this.users.map((u) => u.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    this.users.push(newUser)
    return newUser
  }

  updateUser(id: number, updates: Partial<User>): User | null {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = { ...this.users[userIndex], ...updates }
    return this.users[userIndex]
  }

  // Методы для работы с категориями
  getCategories(): Category[] {
    return this.categories.filter((cat) => cat.isActive)
  }

  getCategoryById(id: number): Category | undefined {
    return this.categories.find((cat) => cat.id === id && cat.isActive)
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((cat) => cat.slug === slug && cat.isActive)
  }

  createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...this.categories.map((c) => c.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    this.categories.push(newCategory)
    return newCategory
  }

  updateCategory(id: number, updates: Partial<Category>): Category | null {
    const categoryIndex = this.categories.findIndex((cat) => cat.id === id)
    if (categoryIndex === -1) return null

    this.categories[categoryIndex] = { ...this.categories[categoryIndex], ...updates }
    return this.categories[categoryIndex]
  }

  deleteCategory(id: number): boolean {
    const categoryIndex = this.categories.findIndex((cat) => cat.id === id)
    if (categoryIndex === -1) return false

    this.categories[categoryIndex].isActive = false
    return true
  }

  // Методы для работы с товарами
  getProducts(filters?: {
    categoryId?: number
    search?: string
    limit?: number
    offset?: number
  }): Product[] {
    let products = this.products.filter((product) => product.isActive)

    if (filters?.categoryId) {
      products = products.filter((product) => product.categoryId === filters.categoryId)
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase()
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search),
      )
    }

    if (filters?.offset) {
      products = products.slice(filters.offset)
    }

    if (filters?.limit) {
      products = products.slice(0, filters.limit)
    }

    return products
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((product) => product.id === id && product.isActive)
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find((product) => product.slug === slug && product.isActive)
  }

  createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const newProduct: Product = {
      ...productData,
      id: Math.max(...this.products.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
    }
    this.products.push(newProduct)
    return newProduct
  }

  updateProduct(id: number, updates: Partial<Product>): Product | null {
    const productIndex = this.products.findIndex((product) => product.id === id)
    if (productIndex === -1) return null

    this.products[productIndex] = { ...this.products[productIndex], ...updates }
    return this.products[productIndex]
  }

  deleteProduct(id: number): boolean {
    const productIndex = this.products.findIndex((product) => product.id === id)
    if (productIndex === -1) return false

    this.products[productIndex].isActive = false
    return true
  }

  // Методы для работы с заказами
  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      id: this.currentOrderId++,
      createdAt: new Date().toISOString(),
    }
    this.orders.push(newOrder)
    return newOrder
  }

  getOrdersByUserId(userId: number): Order[] {
    return this.orders.filter((order) => order.userId === userId)
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find((order) => order.id === id)
  }

  // Методы для работы с платежными системами
  getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods.filter((method) => method.isActive)
  }
}

// Singleton экземпляр базы данных
const mockDB = new MockDatabase()

// Утилита для имитации задержки сети
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Утилита для генерации JWT токена (mock)
const generateMockJWT = (user: Omit<User, 'password'>): string => {
  // В реальном приложении здесь должна быть настоящая JWT библиотека
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 часа
  }
  return btoa(JSON.stringify(payload)) // Base64 кодирование для демо
}

// API класс с методами для работы с сервером
export class MockAPI {
  private static token: string | null = null

  // Методы аутентификации
  static async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500) // Имитация сетевой задержки

    const user = mockDB.findUserByEmail(email)
    if (!user || user.password !== password) {
      throw new Error('Неверный email или пароль')
    }

    const { password: _, ...userWithoutPassword } = user
    const token = generateMockJWT(userWithoutPassword)
    this.token = token

    return {
      token,
      user: userWithoutPassword,
    }
  }

  static async register(email: string, password: string, name: string): Promise<AuthResponse> {
    await delay(500)

    if (mockDB.findUserByEmail(email)) {
      throw new Error('Пользователь с таким email уже существует')
    }

    const user = mockDB.createUser({
      email,
      password,
      name,
      role: 'user',
    })

    const { password: _, ...userWithoutPassword } = user
    const token = generateMockJWT(userWithoutPassword)
    this.token = token

    return {
      token,
      user: userWithoutPassword,
    }
  }

  static async logout(): Promise<void> {
    await delay(200)
    this.token = null
  }

  static async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null

    try {
      // Декодирование mock JWT
      const payload = JSON.parse(atob(this.token))

      // Проверка срока действия токена
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        this.token = null
        return null
      }

      const user = mockDB.findUserById(payload.id)
      if (!user) return null

      const { password: _, ...userWithoutPassword } = user
      return userWithoutPassword as User
    } catch {
      this.token = null
      return null
    }
  }

  // Методы для работы с категориями
  static async getCategories(): Promise<Category[]> {
    await delay(300)
    return mockDB.getCategories()
  }

  static async getCategoryById(id: number): Promise<Category | null> {
    await delay(200)
    return mockDB.getCategoryById(id) || null
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    await delay(200)
    return mockDB.getCategoryBySlug(slug) || null
  }

  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    await delay(400)

    // Проверка авторизации администратора
    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Доступ запрещен')
    }

    return mockDB.createCategory(categoryData)
  }

  static async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    await delay(400)

    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Доступ запрещен')
    }

    const updated = mockDB.updateCategory(id, updates)
    if (!updated) {
      throw new Error('Категория не найдена')
    }

    return updated
  }

  static async deleteCategory(id: number): Promise<void> {
    await delay(400)

    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Доступ запрещен')
    }

    const success = mockDB.deleteCategory(id)
    if (!success) {
      throw new Error('Категория не найдена')
    }
  }

  // Методы для работы с товарами
  static async getProducts(filters?: {
    categoryId?: number
    search?: string
    limit?: number
    offset?: number
  }): Promise<Product[]> {
    await delay(400)
    return mockDB.getProducts(filters)
  }

  static async getProductById(id: number): Promise<Product | null> {
    await delay(200)
    return mockDB.getProductById(id) || null
  }

  static async getProductBySlug(slug: string): Promise<Product | null> {
    await delay(200)
    return mockDB.getProductBySlug(slug) || null
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    await delay(500)

    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Доступ запрещен')
    }

    return mockDB.createProduct(productData)
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    await delay(500)

    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Доступ запрещен')
    }

    const updated = mockDB.updateProduct(id, updates)
    if (!updated) {
      throw new Error('Товар не найден')
    }

    return updated
  }

  static async deleteProduct(id: number): Promise<void> {
    await delay(400)

    const currentUser = await this.getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Доступ запрещен')
    }

    const success = mockDB.deleteProduct(id)
    if (!success) {
      throw new Error('Товар не найден')
    }
  }

  // Методы для работы с заказами
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'userId'>): Promise<Order> {
    await delay(600)

    const currentUser = await this.getCurrentUser()
    if (!currentUser) {
      throw new Error('Необходима авторизация')
    }

    return mockDB.createOrder({
      ...orderData,
      userId: currentUser.id,
    })
  }

  static async getUserOrders(): Promise<Order[]> {
    await delay(400)

    const currentUser = await this.getCurrentUser()
    if (!currentUser) {
      throw new Error('Необходима авторизация')
    }

    return mockDB.getOrdersByUserId(currentUser.id)
  }

  static async getOrderById(id: number): Promise<Order | null> {
    await delay(300)

    const currentUser = await this.getCurrentUser()
    if (!currentUser) {
      throw new Error('Необходима авторизация')
    }

    const order = mockDB.getOrderById(id)
    if (!order || (order.userId !== currentUser.id && currentUser.role !== 'admin')) {
      return null
    }

    return order
  }

  // Методы для работы с профилем пользователя
  static async updateUserProfile(updates: {
    name?: string
    email?: string
    currentPassword?: string
    newPassword?: string
  }): Promise<User> {
    await delay(500)

    const currentUser = await this.getCurrentUser()
    if (!currentUser) {
      throw new Error('Необходима авторизация')
    }

    // Проверяем текущий пароль если меняется пароль
    if (updates.newPassword) {
      if (!updates.currentPassword) {
        throw new Error('Необходимо указать текущий пароль')
      }

      const user = mockDB.findUserById(currentUser.id)
      if (!user || user.password !== updates.currentPassword) {
        throw new Error('Неверный текущий пароль')
      }
    }

    // Проверяем уникальность email
    if (updates.email && updates.email !== currentUser.email) {
      const existingUser = mockDB.findUserByEmail(updates.email)
      if (existingUser && existingUser.id !== currentUser.id) {
        throw new Error('Пользователь с таким email уже существует')
      }
    }

    // Обновляем данные пользователя
    const updateData: Partial<User> = {}
    if (updates.name) updateData.name = updates.name
    if (updates.email) updateData.email = updates.email
    if (updates.newPassword) updateData.password = updates.newPassword

    const updatedUser = mockDB.updateUser(currentUser.id, updateData)
    if (!updatedUser) {
      throw new Error('Ошибка обновления профиля')
    }

    // Возвращаем обновленного пользователя без пароля
    const { password: _, ...userWithoutPassword } = updatedUser
    return userWithoutPassword as User
  }

  // Методы для работы с платежными системами
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    await delay(200)
    return mockDB.getPaymentMethods()
  }

  static async processPayment(
    orderId: number,
    paymentMethodId: string,
    paymentData?: any,
  ): Promise<{ success: boolean; transactionId?: string }> {
    await delay(1000) // Имитация обработки платежа

    // Имитация успешной оплаты в 90% случаев
    const success = Math.random() > 0.1

    if (success) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    } else {
      throw new Error('Ошибка обработки платежа. Попробуйте еще раз.')
    }
  }

  // Утилитные методы
  static setAuthToken(token: string) {
    this.token = token
  }

  static getAuthToken(): string | null {
    return this.token
  }

  static clearAuthToken() {
    this.token = null
  }
}

export default MockAPI
