// Keep language codes, native labels and resolution aligned with Pi-Harness.
export const languages = [
  { code: 'en-US', label: 'English' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'ja-JP', label: '日本語' },
  { code: 'ko-KR', label: '한국어' },
  { code: 'ru-RU', label: 'Русский' },
  { code: 'fr-FR', label: 'Français' },
  { code: 'de-DE', label: 'Deutsch' },
] as const

export type AppLocale = (typeof languages)[number]['code']
export type AppLanguage = AppLocale | 'auto'

export function isLanguage(value: unknown): value is AppLanguage {
  return value === 'auto' || languages.some(item => item.code === value)
}

export function storedLanguage(value: string | null): AppLanguage {
  if (value === 'zh') return 'zh-CN'
  if (value === 'en') return 'en-US'
  return isLanguage(value) ? value : 'auto'
}

export function resolveLocale(language: AppLanguage, systemLocale: string): AppLocale {
  if (language !== 'auto') return language
  const tag = systemLocale.toLowerCase().replace(/_/g, '-')
  if (tag.startsWith('zh')) return /-(tw|hk|mo|hant)(-|$)/.test(tag) ? 'zh-TW' : 'zh-CN'
  return languages.find(item => tag.split('-')[0] === item.code.split('-')[0])?.code ?? 'en-US'
}

const STORAGE_KEY = 'pi-harness-site-locale'

export function loadLanguage(): AppLanguage {
  try { return storedLanguage(window.localStorage.getItem(STORAGE_KEY)) } catch { return 'auto' }
}

export function saveLanguage(language: AppLanguage): void {
  try { window.localStorage.setItem(STORAGE_KEY, language) } catch { /* Browsers can block storage. */ }
}
