<template>
  <div id="app" class="min-h-screen">
    <router-view />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import NotificationToast from '@/components/NotificationToast.vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Инициализируем авторизацию при загрузке приложения
  await authStore.initializeAuth()
})
</script>
