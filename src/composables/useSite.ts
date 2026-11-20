import { inject } from 'vue'
import { siteKey } from '../context'

export function useSite() {
  const site = inject(siteKey)
  if (!site) throw new Error('Site context is missing')
  return site
}
