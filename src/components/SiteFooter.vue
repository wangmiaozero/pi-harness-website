<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { DOCS, REPO, SDK, SKINS } from '../data'
import type { MessageKey } from '../i18n'
import { useSite } from '../composables/useSite'

const { t, jumpTo } = useSite()
const year = new Date().getFullYear()
const product: { id: string; title: MessageKey }[] = [
  { id: 'features', title: 'nav.features' },
  { id: 'showcase', title: 'nav.screenshots' },
  { id: 'films', title: 'nav.films' },
  { id: 'themes', title: 'nav.themes' },
  { id: 'gallery', title: 'nav.gallery' },
  { id: 'downloads', title: 'nav.download' },
]
</script>

<template>
  <footer class="footer">
    <div class="container grid">
      <div class="about">
        <a class="brand" href="#top" @click.prevent="jumpTo('top')"><span class="mark" aria-hidden="true">π</span><span>Pi-Harness</span></a>
        <p>{{ t('footer.tagline') }}</p>
        <small>{{ t('footer.madeFor') }}</small>
      </div>
      <div>
        <strong>{{ t('footer.product') }}</strong>
        <a v-for="item in product" :key="item.id" :href="`#${item.id}`" @click.prevent="jumpTo(item.id)">{{ t(item.title) }}</a>
      </div>
      <div>
        <strong>{{ t('footer.developers') }}</strong>
        <a :href="DOCS" target="_blank" rel="noopener noreferrer">{{ t('nav.docs') }} <ArrowUpRight :size="12" /></a>
        <a :href="REPO" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight :size="12" /></a>
        <a :href="SDK" target="_blank" rel="noopener noreferrer">Plugin SDK <ArrowUpRight :size="12" /></a>
        <a :href="`${REPO}/blob/main/CHANGELOG.md`" target="_blank" rel="noopener noreferrer">{{ t('footer.changelog') }} <ArrowUpRight :size="12" /></a>
        <a :href="SKINS" target="_blank" rel="noopener noreferrer">Skin Starter <ArrowUpRight :size="12" /></a>
      </div>
      <div>
        <strong>{{ t('footer.community') }}</strong>
        <a :href="`${REPO}/releases`" target="_blank" rel="noopener noreferrer">{{ t('download.notes') }} <ArrowUpRight :size="12" /></a>
        <a :href="`${REPO}/issues`" target="_blank" rel="noopener noreferrer">{{ t('footer.issues') }} <ArrowUpRight :size="12" /></a>
        <a :href="`${REPO}/pulls`" target="_blank" rel="noopener noreferrer">{{ t('footer.pulls') }} <ArrowUpRight :size="12" /></a>
        <a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">AGPL-3.0 <ArrowUpRight :size="12" /></a>
      </div>
    </div>
    <div class="container bottom">
      <span>© {{ year }} Pi-Harness · {{ t('footer.project') }}</span>
      <span>{{ t('footer.independent') }}</span>
      <a href="#top" @click.prevent="jumpTo('top')">{{ t('footer.top') }}</a>
    </div>
  </footer>
</template>

<style scoped>
.footer { border-top: 1px solid var(--border); padding-top: 48px; }
.grid { display: grid; grid-template-columns: 1.4fr repeat(3, minmax(0, 0.7fr)); gap: 32px; }
.brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; letter-spacing: -0.03em; }
.mark {
  width: 26px; height: 26px; display: grid; place-items: center; border-radius: 7px;
  background: var(--text); color: var(--bg); font-family: Georgia, "Songti SC", serif; font-size: 16px;
}
.about p { margin: 14px 0 8px; color: var(--text-secondary); font-size: 14px; max-width: 32ch; }
.about small { color: var(--text-tertiary); font-size: 12px; }
.grid > div:not(.about) { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.grid strong { font-size: 12px; font-weight: 600; color: var(--text-tertiary); margin-bottom: 4px; }
.grid a { font-size: 14px; color: var(--text-secondary); display: inline-flex; align-items: center; gap: 4px; }
.grid a:hover { color: var(--text); }
.bottom {
  display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center;
  margin-top: 36px; padding: 18px 0 28px; border-top: 1px solid var(--border);
  color: var(--text-tertiary); font-size: 12px;
}
.bottom a { margin-left: auto; color: var(--text-secondary); }
@media (max-width: 800px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .about { grid-column: 1 / -1; }
  .bottom a { margin-left: 0; }
}
@media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }
</style>
