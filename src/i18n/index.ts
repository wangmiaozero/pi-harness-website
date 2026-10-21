import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import en from './locales/en-US.json'
import zh from './locales/zh-CN.json'
import tw from './locales/zh-TW.json'
import ja from './locales/ja-JP.json'
import ko from './locales/ko-KR.json'
import ru from './locales/ru-RU.json'
import fr from './locales/fr-FR.json'
import de from './locales/de-DE.json'
import { isLanguage, resolveLocale, loadLanguage, saveLanguage, type AppLocale, type AppLanguage } from './language'

export { languages } from './language'
export type MessageKey = keyof typeof en
export type Messages = Record<MessageKey, string>
export const messages = {
  'en-US': en, 'zh-CN': zh, 'zh-TW': tw, 'ja-JP': ja,
  'ko-KR': ko, 'ru-RU': ru, 'fr-FR': fr, 'de-DE': de,
} satisfies Record<AppLocale, Messages>

export function useSiteLocale() {
  const language = ref<AppLanguage>(loadLanguage())
  const systemLocale = ref(navigator.language)
  const locale = computed(() => resolveLocale(language.value, systemLocale.value))
  const t = (key: MessageKey): string => messages[locale.value][key] ?? en[key]

  function chooseLocale(value: string) {
    if (!isLanguage(value)) return
    language.value = value
    saveLanguage(value)
  }
  function syncMetadata() {
    document.documentElement.lang = locale.value
    document.title = t('meta.title')
    for (const [selector, content] of [
      ['meta[name="description"]', t('hero.description')],
      ['meta[property="og:title"]', t('meta.title')],
      ['meta[property="og:description"]', t('hero.description')],
      ['meta[property="og:locale"]', locale.value.replace('-', '_')],
    ] as const) {
      const element = document.querySelector(selector)
      element?.setAttribute('content', content)
    }
  }
  const onLanguageChange = () => { systemLocale.value = navigator.language }
  watch(locale, syncMetadata, { immediate: true })
  onMounted(() => window.addEventListener('languagechange', onLanguageChange))
  onUnmounted(() => window.removeEventListener('languagechange', onLanguageChange))
  return { language, locale, t, chooseLocale }
}
