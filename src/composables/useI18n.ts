import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import ukTranslations from '@/locales/uk'
import ruTranslations from '@/locales/ru'
import enTranslations from '@/locales/en'

const translations = {
  uk: ukTranslations,
  ru: ruTranslations,
  en: enTranslations,
}

export function useI18n() {
  const settingsStore = useSettingsStore()

  const t = computed(() => {
    return (key: string): string => {
      const keys = key.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let value: any = translations[settingsStore.language]

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          console.warn(
            `Translation key "${key}" not found for language "${settingsStore.language}"`,
          )
          return key
        }
      }

      return typeof value === 'string' ? value : key
    }
  })

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat(settingsStore.language === 'uk' ? 'uk-UA' : 'ru-RU', {
      style: 'currency',
      currency: 'UAH',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const locale = settingsStore.language === 'uk' ? 'uk-UA' : 'ru-RU'

    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return {
    t: t.value,
    formatPrice,
    formatDate,
    currentLanguage: computed(() => settingsStore.language),
  }
}
