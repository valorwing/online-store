<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div" class="toast-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['toast', `toast-${notification.type}`]"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <component :is="getIcon(notification.type)" />
          </div>
          <div class="toast-body">
            <p class="toast-title">{{ notification.title }}</p>
            <p v-if="notification.message" class="toast-message">
              {{ notification.message }}
            </p>
          </div>
        </div>
        <button @click="removeNotification(notification.id)" class="toast-close">
          ×
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const notifications = computed(() => notificationStore.notifications)

const getIcon = (type: string) => {
  const icons = {
    success: () => '✅',
    error: () => '❌',
    warning: () => '⚠️',
    info: () => 'ℹ️'
  }
  return icons[type as keyof typeof icons] || icons.info
}

const removeNotification = (id: string) => {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
}

.toast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toast {
  max-width: 400px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  pointer-events: auto;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #22c55e;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.toast-icon {
  font-size: 18px;
  margin-top: 2px;
}

.toast-body {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.toast-message {
  color: #6b7280;
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 18px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

/* Анимации */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Адаптивность */
@media (max-width: 768px) {
  .toast-container {
    left: 20px;
    right: 20px;
    top: 20px;
  }
  
  .toast {
    max-width: none;
  }
}
</style>
