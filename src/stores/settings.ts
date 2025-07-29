import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Language = 'uk' | 'ru'
export type Theme = 'light' | 'dark'

export const useSettingsStore = defineStore('settings', () => {
  // Состояние
  const language = ref<Language>('uk')
  const theme = ref<Theme>('light')

  // Инициализация из localStorage
  const initializeSettings = () => {
    const savedLanguage = localStorage.getItem('app_language') as Language
    const savedTheme = localStorage.getItem('app_theme') as Theme

    if (savedLanguage && ['uk', 'ru'].includes(savedLanguage)) {
      language.value = savedLanguage
    }

    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      theme.value = savedTheme
    }

    // Применяем тему к DOM
    applyTheme()
  }

  // Переключение языка
  const setLanguage = (newLanguage: Language) => {
    language.value = newLanguage
    localStorage.setItem('app_language', newLanguage)
  }

  // Переключение темы
  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    localStorage.setItem('app_theme', newTheme)
    applyTheme()
  }

  // Применение темы к DOM
  const applyTheme = () => {
    const root = document.documentElement
    if (theme.value === 'dark') {
      root.classList.add('dark-theme')
    } else {
      root.classList.remove('dark-theme')
    }
  }

  // Переключение темы
  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // Переключение языка
  const toggleLanguage = () => {
    setLanguage(language.value === 'uk' ? 'ru' : 'uk')
  }

  return {
    language,
    theme,
    initializeSettings,
    setLanguage,
    setTheme,
    toggleTheme,
    toggleLanguage,
  }
})
