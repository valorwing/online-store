import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Shop/HomePage.vue'),
    },
    {
      path: '/shop',
      name: 'Shop',
      component: () => import('@/views/Shop/ShopPage.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/Shop/CartPage.vue'),
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: () => import('@/views/Shop/CheckoutPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'Orders',
      component: () => import('@/views/Shop/OrdersPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Auth/LoginPage.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/Admin/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Инициализируем авторизацию если еще не сделали
  if (!authStore.user && localStorage.getItem('auth_token')) {
    await authStore.initializeAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/'
  }
})

export default router
