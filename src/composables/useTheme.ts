import { ref, watch } from 'vue'

export type ThemeName = 'light' | 'dark'

const STORAGE_KEY = 'pi-harness-site-theme'
const theme = ref<ThemeName>('light')
let wired = false

function storedTheme(): ThemeName {
  try { return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light' }
  catch { return 'light' }
}

function applyTheme(value: ThemeName, persist: boolean) {
  document.documentElement.dataset.theme = value
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#0e0e10' : '#f4f4f2')
  if (!persist) return
  try { localStorage.setItem(STORAGE_KEY, value) } catch { /* storage can be blocked */ }
}

export function useTheme() {
  if (!wired && typeof document !== 'undefined') {
    wired = true
    theme.value = document.documentElement.dataset.theme === 'dark' || storedTheme() === 'dark' ? 'dark' : 'light'
    applyTheme(theme.value, false)
    watch(theme, value => applyTheme(value, true))
  }

  function toggleTheme() { theme.value = theme.value === 'dark' ? 'light' : 'dark' }
  return { theme, toggleTheme }
}
