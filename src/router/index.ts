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

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return '/'
  }
})

export default router
