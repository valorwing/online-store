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

<style>
/* Импорт шрифта Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Глобальные стили */
body {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  line-height: 1.6;
  color: #374151;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

/* Утилитарные классы для обрезки текста */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceGentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulseGentle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

/* Кастомные классы анимации */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-bounce-gentle {
  animation: bounceGentle 2s infinite;
}

.animate-pulse-gentle {
  animation: pulseGentle 3s ease-in-out infinite;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

/* Градиентный текст */
.text-gradient {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 4s ease infinite;
}

/* Стеклянный эффект */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Кастомные теени */
.shadow-glow {
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
}

.shadow-glow-lg {
  box-shadow: 0 0 50px rgba(59, 130, 246, 0.5);
}

.shadow-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.shadow-card-hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

/* Фокус для доступности */
.focus-visible:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 8px;
}

/* Плавные переходы */
* {
  transition-property: color, background-color, border-color, opacity, transform, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Улучшенные переходы для кнопок */
button,
.btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

button:hover,
.btn:hover {
  transform: translateY(-2px);
}

button:active,
.btn:active {
  transform: translateY(0);
}

/* Скрытие скроллбара в Webkit браузерах */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Кастомный скроллбар */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
}

/* Загрузочная анимация */
.loading-shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Улучшенные формы */
input[type='text'],
input[type='email'],
input[type='password'],
input[type='tel'],
input[type='url'],
input[type='number'],
textarea,
select {
  transition: all 0.3s ease;
}

input:focus,
textarea:focus,
select:focus {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  .animate-float {
    animation-duration: 6s;
  }

  .text-gradient {
    background-size: 100% 100%;
  }
}

/* Темная тема (по желанию) */
@media (prefers-color-scheme: dark) {
  body {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #e2e8f0;
  }
}

/* Печать */
@media print {
  .no-print {
    display: none !important;
  }

  * {
    animation: none !important;
    transition: none !important;
  }
}

/* Высокий контраст для людей с ограниченными возможностями */
@media (prefers-contrast: high) {
  .text-gradient {
    background: none;
    -webkit-text-fill-color: initial;
    color: #1e40af;
  }
}

/* Анимации для людей, которые предпочитают меньше движения */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
