import { createI18n } from 'vue-i18n'
import zh from './zh-CN'
import en from './en-US'

const defaultLocale = localStorage.getItem('language') || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zh,
    'en-US': en
  }
})

export default i18n
