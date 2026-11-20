<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { ArrowUpRight, Check, ChevronDown, Download, Github, Globe2, Menu, Moon, Sun, X } from 'lucide-vue-next'
import { languages, type MessageKey } from '../i18n'
import { REPO } from '../data'
import { useSite } from '../composables/useSite'
import { useGithub } from '../composables/useGithub'
import { useTheme } from '../composables/useTheme'
import { setScrollLock } from '../scrollLock'

const { t, language, locale, chooseLocale, jumpTo } = useSite()
const { stars } = useGithub()
const { theme, toggleTheme } = useTheme()
const open = ref(false)
const scrolled = ref(false)
const active = ref('')
const toggleRef = ref<HTMLButtonElement | null>(null)
const localeMenu = ref<'desktop' | 'mobile' | null>(null)
const desktopLocaleRef = ref<HTMLElement | null>(null)
const mobileLocaleRef = ref<HTMLElement | null>(null)

const localeOptions = computed(() => [
  { value: 'auto', label: t('language.auto') },
  ...languages.map(item => ({ value: item.code, label: item.label, lang: item.code })),
])
const currentLocaleLabel = computed(() => localeOptions.value.find(item => item.value === language.value)?.label ?? t('language.auto'))

const primary: { id: string; title: MessageKey }[] = [
  { id: 'features', title: 'nav.features' },
  { id: 'showcase', title: 'nav.showcase' },
  { id: 'themes', title: 'nav.themes' },
]
const more: { id: string; title: MessageKey }[] = [
  { id: 'films', title: 'nav.films' },
  { id: 'gallery', title: 'nav.gallery' },
  { id: 'downloads', title: 'nav.downloads' },
]

const starsLabel = computed(() => {
  if (stars.value === null) return ''
  return new Intl.NumberFormat(locale.value, {
    notation: stars.value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(stars.value)
})

function onScroll() { scrolled.value = window.scrollY > 8 }

function go(id: string) {
  open.value = false
  jumpTo(id)
}

function localeRoot(which: 'desktop' | 'mobile') {
  return which === 'desktop' ? desktopLocaleRef.value : mobileLocaleRef.value
}

function focusLocaleOption(which: 'desktop' | 'mobile') {
  const root = localeRoot(which)
  const selected = root?.querySelector<HTMLButtonElement>('[aria-checked="true"]')
  const first = root?.querySelector<HTMLButtonElement>('[role="menuitemradio"]')
  ;(selected ?? first)?.focus({ preventScroll: true })
}

function toggleLocale(which: 'desktop' | 'mobile') {
  localeMenu.value = localeMenu.value === which ? null : which
  if (localeMenu.value) void nextTick(() => focusLocaleOption(which))
}

function pickLocale(value: string, which: 'desktop' | 'mobile') {
  chooseLocale(value)
  localeMenu.value = null
  void nextTick(() => localeRoot(which)?.querySelector<HTMLButtonElement>('.locale-trigger')?.focus({ preventScroll: true }))
}

function onLocaleKey(event: KeyboardEvent, which: 'desktop' | 'mobile') {
  const options = [...(localeRoot(which)?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])]
  const index = options.findIndex(item => item === document.activeElement)
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (localeMenu.value !== which) toggleLocale(which)
    else options[Math.min(index + 1, options.length - 1)]?.focus({ preventScroll: true })
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (localeMenu.value !== which) toggleLocale(which)
    else options[Math.max(index - 1, 0)]?.focus({ preventScroll: true })
  } else if (event.key === 'Home' && localeMenu.value === which) {
    event.preventDefault()
    options[0]?.focus({ preventScroll: true })
  } else if (event.key === 'End' && localeMenu.value === which) {
    event.preventDefault()
    options.at(-1)?.focus({ preventScroll: true })
  } else if (event.key === 'Escape' && localeMenu.value === which) {
    event.preventDefault()
    event.stopPropagation()
    localeMenu.value = null
    localeRoot(which)?.querySelector<HTMLButtonElement>('.locale-trigger')?.focus({ preventScroll: true })
  }
}

function onPointerDown(event: PointerEvent) {
  if (!localeMenu.value) return
  const root = localeRoot(localeMenu.value)
  if (root && event.target instanceof Node && root.contains(event.target)) return
  localeMenu.value = null
}

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && localeMenu.value) {
    localeMenu.value = null
    return
  }
  if (event.key === 'Escape' && open.value) {
    open.value = false
    toggleRef.value?.focus()
  }
}

let observer: IntersectionObserver | undefined
let desktopQuery: MediaQueryList | undefined

function onDesktopChange(event: MediaQueryListEvent) {
  if (!event.matches) open.value = false
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  document.addEventListener('pointerdown', onPointerDown)
  desktopQuery = window.matchMedia('(min-width: 1101px)')
  desktopQuery.addEventListener('change', onDesktopChange)
  observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (visible?.target.id) active.value = visible.target.id
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.15, 0.4, 0.75] })
  for (const link of primary) {
    const section = document.getElementById(link.id)
    if (section) observer.observe(section)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('pointerdown', onPointerDown)
  desktopQuery?.removeEventListener('change', onDesktopChange)
  observer?.disconnect()
  setScrollLock('menu', false)
})

watch(open, value => {
  setScrollLock('menu', value)
  if (!value) localeMenu.value = null
})
</script>

<template>
  <header class="site-header" :class="{ scrolled, open }">
    <div class="bar">
      <a class="brand" href="#top" :aria-label="t('brand.home')" @click.prevent="go('top')">
        <span class="mark" aria-hidden="true">π</span>
        <span class="word">Pi-Harness</span>
      </a>
      <nav class="nav-links" :aria-label="t('nav.main')">
        <a
          v-for="item in primary"
          :key="item.id"
          :href="`#${item.id}`"
          :aria-current="active === item.id ? 'page' : undefined"
          @click.prevent="go(item.id)"
        >{{ t(item.title) }}</a>
        <a :href="`${REPO}#documentation`" target="_blank" rel="noopener noreferrer">{{ t('nav.docs') }} <ArrowUpRight :size="14" /></a>
      </nav>
      <div class="nav-actions">
        <div ref="desktopLocaleRef" class="locale-picker" :class="{ open: localeMenu === 'desktop' }" @keydown="onLocaleKey($event, 'desktop')">
          <button
            class="locale-trigger"
            type="button"
            :aria-label="t('language.label')"
            aria-haspopup="menu"
            :aria-expanded="localeMenu === 'desktop'"
            aria-controls="locale-menu-desktop"
            @click="toggleLocale('desktop')"
          >
            <Globe2 :size="15" aria-hidden="true" />
            <span>{{ currentLocaleLabel }}</span>
            <ChevronDown :size="14" aria-hidden="true" />
          </button>
          <div v-if="localeMenu === 'desktop'" id="locale-menu-desktop" class="locale-menu" role="menu" :aria-label="t('language.label')">
            <button
              v-for="item in localeOptions"
              :key="item.value"
              type="button"
              role="menuitemradio"
              :aria-checked="language === item.value"
              :lang="'lang' in item ? item.lang : undefined"
              @click="pickLocale(item.value, 'desktop')"
            >
              <Check v-if="language === item.value" :size="14" />
              <span v-else class="check-slot" aria-hidden="true" />
              {{ item.label }}
            </button>
          </div>
        </div>
        <a class="icon-btn github" :href="REPO" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <Github :size="18" />
          <span v-if="starsLabel" class="stars">{{ starsLabel }}</span>
        </a>
        <button
          class="icon-btn"
          type="button"
          :aria-label="theme === 'dark' ? t('theme.toLight') : t('theme.toDark')"
          @click="toggleTheme"
        >
          <Sun v-if="theme === 'dark'" :size="18" />
          <Moon v-else :size="18" />
        </button>
        <a class="btn btn-primary btn-sm nav-cta" href="#downloads" @click.prevent="go('downloads')">{{ t('nav.getApp') }}</a>
        <a class="icon-btn nav-cta-icon" href="#downloads" :aria-label="t('nav.getApp')" @click.prevent="go('downloads')"><Download :size="18" /></a>
        <button
          ref="toggleRef"
          class="icon-btn menu-toggle"
          type="button"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="t('nav.toggle')"
          @click="open = !open"
        >
          <X v-if="open" :size="20" />
          <Menu v-else :size="20" />
        </button>
      </div>
    </div>
    <nav v-if="open" id="mobile-nav" class="mobile-panel" :aria-label="t('nav.mobile')">
      <a v-for="item in [...primary, ...more]" :key="item.id" :href="`#${item.id}`" :aria-current="active === item.id ? 'page' : undefined" @click.prevent="go(item.id)">{{ t(item.title) }}</a>
      <a :href="`${REPO}#documentation`" target="_blank" rel="noopener noreferrer">{{ t('nav.documentation') }} <ArrowUpRight :size="16" /></a>
      <a :href="REPO" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight :size="16" /></a>
      <div ref="mobileLocaleRef" class="locale-field" :class="{ open: localeMenu === 'mobile' }" @keydown="onLocaleKey($event, 'mobile')">
        <span>{{ t('language.label') }}</span>
        <button
          class="locale-trigger"
          type="button"
          :aria-label="t('language.label')"
          aria-haspopup="menu"
          :aria-expanded="localeMenu === 'mobile'"
          aria-controls="locale-menu-mobile"
          @click="toggleLocale('mobile')"
        >
          <Globe2 :size="15" aria-hidden="true" />
          <span>{{ currentLocaleLabel }}</span>
          <ChevronDown :size="14" aria-hidden="true" />
        </button>
        <div v-if="localeMenu === 'mobile'" id="locale-menu-mobile" class="locale-menu" role="menu" :aria-label="t('language.label')">
          <button
            v-for="item in localeOptions"
            :key="item.value"
            type="button"
            role="menuitemradio"
            :aria-checked="language === item.value"
            :lang="'lang' in item ? item.lang : undefined"
            @click="pickLocale(item.value, 'mobile')"
          >
            <Check v-if="language === item.value" :size="14" />
            <span v-else class="check-slot" aria-hidden="true" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: 40; }
.bar {
  height: var(--header-h);
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: max(var(--gutter), calc((100% - var(--wide)) / 2));
}
.scrolled .bar,
.open .bar {
  background: var(--header-bg);
  backdrop-filter: blur(18px) saturate(1.3);
  -webkit-backdrop-filter: blur(18px) saturate(1.3);
  border-bottom: 1px solid var(--border);
}
.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.mark {
  width: 28px; height: 28px; display: grid; place-items: center;
  border-radius: 8px; background: var(--text); color: var(--bg);
  font-family: Georgia, "Iowan Old Style", "Songti SC", serif;
  font-size: 18px; line-height: 1;
}
.word { font-size: 15px; font-weight: 600; letter-spacing: -0.03em; }
.nav-links { display: flex; align-items: center; gap: 4px; margin-left: 12px; }
.nav-links a {
  display: inline-flex; align-items: center; gap: 4px;
  color: var(--text-secondary); font-size: 14px; font-weight: 500;
  padding: 8px 10px; border-radius: 8px;
}
.nav-links a:hover { color: var(--text); background: transparent; }
.nav-links a[aria-current="page"] { color: var(--text); }
.nav-links a[aria-current="page"]::after {
  content: "";
  position: absolute;
}
.nav-links a { position: relative; }
.nav-links a[aria-current="page"]::after {
  left: 10px; right: 10px; bottom: 2px; height: 2px;
  border-radius: 2px; background: var(--accent);
}
.nav-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.locale-picker { position: relative; }
.locale-trigger {
  display: inline-flex; align-items: center; gap: 6px;
  height: 36px; padding: 0 8px; border-radius: 8px;
  color: var(--text-secondary); font-size: 13px; font-weight: 500; white-space: nowrap;
}
.locale-trigger:hover, .locale-picker.open .locale-trigger, .locale-field.open .locale-trigger { color: var(--text); background: var(--bg-subtle); }
.locale-trigger svg:last-child { transition: transform 0.2s var(--ease); }
.locale-picker.open .locale-trigger svg:last-child,
.locale-field.open .locale-trigger svg:last-child { transform: rotate(180deg); }
.locale-menu {
  position: absolute; z-index: 30; top: calc(100% + 6px); left: 0;
  min-width: 176px; margin: 0; padding: 4px;
  background: var(--bg-elevated); color: var(--text);
  border: 1px solid var(--border); border-radius: 10px;
  box-shadow: var(--shadow-md);
}
.locale-menu button {
  display: flex; align-items: center; gap: 8px; width: 100%;
  min-height: 32px; padding: 0 8px; border-radius: 6px;
  color: var(--text); font-size: 13px; font-weight: 500; text-align: start;
}
.locale-menu button:hover, .locale-menu button:focus-visible { background: var(--bg-subtle); outline: none; }
.locale-menu button[aria-checked="true"] { background: var(--accent-soft); color: var(--accent-text); }
.check-slot { width: 14px; height: 14px; flex: none; }
.stars { font-size: 12px; font-variant-numeric: tabular-nums; color: var(--text-secondary); }
.github { padding-inline: 8px; }
.nav-cta-icon, .menu-toggle { display: none; }
.mobile-panel {
  position: absolute; left: 0; right: 0; top: 100%;
  max-height: calc(100vh - var(--header-h));
  overflow: auto;
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-md);
  padding: 8px var(--gutter) 20px;
}
.mobile-panel a, .locale-field {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  min-height: 48px; border-bottom: 1px solid var(--border);
  font-size: 16px; font-weight: 500;
}
.mobile-panel a[aria-current="page"] { color: var(--accent-text); }
.locale-field { flex-direction: column; align-items: stretch; gap: 6px; padding: 12px 0 4px; border-bottom: 0; }
.locale-field span { font-size: 12px; color: var(--text-tertiary); font-weight: 500; }
.locale-field .locale-trigger {
  width: 100%; justify-content: flex-start; height: 44px; padding: 0 12px;
  border: 1px solid var(--border-strong); border-radius: 8px; background: var(--bg);
}
.locale-field .locale-trigger span { margin-right: auto; font-size: 14px; color: var(--text); }
.locale-field .locale-menu { position: static; width: 100%; margin-top: 2px; box-shadow: none; }
@media (max-width: 1100px) {
  .nav-links, .locale-picker, .nav-cta, .github { display: none; }
  .nav-cta-icon, .menu-toggle { display: inline-flex; }
}
@media (max-width: 380px) {
  .word { font-size: 14px; }
}
</style>
