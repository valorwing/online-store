<template>
  <div id="app">
    <router-view />
    <NotificationToast />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useSettingsStore } from '@/stores/settings'
import NotificationToast from '@/components/NotificationToast.vue'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()

onMounted(async () => {
  // Инициализируем настройки и авторизацию при загрузке приложения
  settingsStore.initializeSettings()
  await authStore.initializeAuth()
})
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
