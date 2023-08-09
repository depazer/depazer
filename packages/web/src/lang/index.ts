import { createI18n } from 'vue-i18n'
import enLocale from './en/en'
import zhLocale from './zh/zh'

const messages = {
  'zh-CN': zhLocale,
  'en-US': enLocale
}

const defaultLocale = localStorage.getItem('locale') || 'en-US'

const i18n = createI18n({
  locale: defaultLocale,
  globalInjection: true,
  fallbackLocale: 'zh-CN',
  allowComposition: true,
  messages,
  legacy: false
})

export default i18n
