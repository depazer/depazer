import { useI18n } from 'vue-i18n'

export function useLocale() {
  const { locale } = useI18n()

  function setLocale(target: 'en-US' | 'zh-CN') {
    locale.value = target
    localStorage.setItem('language', target)
  }

  function toggleLocale() {
    setLocale(locale.value === 'en-US' ? 'zh-CN' : 'en-US')
  }

  return {
    locale,
    toggleLocale
  }
}
