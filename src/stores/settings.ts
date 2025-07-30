import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Language = 'uk' | 'ru' | 'en'
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

  const currentLangUI = (): string => {
    switch (language.value) {
      case 'en':
        return 'EN'
      case 'ru':
        return 'РУ'
      case 'uk':
        return 'УК'
      default:
        return 'EN'
    }
  }

  // Переключение языка
  const toggleLanguage = () => {
    switch (language.value) {
      case 'en':
        setLanguage('uk')
        break
      case 'uk':
        setLanguage('ru')
        break
      case 'ru':
        setLanguage('en')
        break
      default:
        setLanguage('en')
    }
  }

  return {
    language,
    theme,
    initializeSettings,
    setLanguage,
    setTheme,
    toggleTheme,
    toggleLanguage,
    currentLangUI,
  }
})
