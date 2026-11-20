import type { InjectionKey, Ref } from 'vue'
import type { MessageKey } from './i18n'
import type { AppLanguage } from './i18n/language'

export interface MediaFrame {
  src: string
  title: string
  file: string
}

export interface LightboxState extends MediaFrame {
  frames: MediaFrame[]
  index: number
}

export interface SiteContext {
  t: (key: MessageKey) => string
  locale: Ref<string>
  language: Ref<AppLanguage>
  chooseLocale: (value: string) => void
  jumpTo: (id: string) => void
  openImage: (frame: MediaFrame, frames?: MediaFrame[]) => void
  closeImage: () => void
  stepImage: (delta: number) => void
  lightbox: Ref<LightboxState | null>
  reducedMotion: Ref<boolean>
}

export const siteKey: InjectionKey<SiteContext> = Symbol('site')
