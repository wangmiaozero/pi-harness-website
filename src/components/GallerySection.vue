<script setup lang="ts">
import { computed, ref } from 'vue'
import { Images } from 'lucide-vue-next'
import { DOCS, gallery, galleryCategories, picture, type GalleryCategory } from '../data'
import type { MessageKey } from '../i18n'
import { useSite } from '../composables/useSite'
import SiteImage from './SiteImage.vue'
import { ArrowUpRight } from 'lucide-vue-next'

const { t, openImage } = useSite()
const filter = ref<'all' | GalleryCategory>('all')
const labels: Record<GalleryCategory, MessageKey> = {
  classic: 'gallery.classic',
  ming: 'gallery.ming',
  standard: 'gallery.standard',
  themes: 'gallery.themes',
}
const counts = computed(() => Object.fromEntries(galleryCategories.map(category => [category, gallery.filter(item => item.category === category).length])) as Record<GalleryCategory, number>)
const items = computed(() => filter.value === 'all' ? gallery : gallery.filter(item => item.category === filter.value))

function open(index: number) {
  const frames = items.value.map(item => ({ src: picture(item), title: t(item.title), file: item.file }))
  const frame = frames[index]
  if (frame) openImage(frame, frames)
}
</script>

<template>
  <section id="gallery" class="section reveal" aria-labelledby="gallery-title">
    <div class="container">
      <header class="section-intro">
        <p class="kicker">{{ t('gallery.kicker') }}</p>
        <h2 id="gallery-title">{{ t('gallery.title1') }}<br /><span class="quiet">{{ t('gallery.title2') }}</span></h2>
        <p class="lede">{{ t('gallery.description') }}</p>
      </header>
      <div class="filters" :aria-label="t('gallery.kicker')">
        <button type="button" :aria-pressed="filter === 'all'" @click="filter = 'all'"><Images :size="14" /> {{ t('gallery.all') }} <span>{{ gallery.length }}</span></button>
        <button v-for="category in galleryCategories" :key="category" type="button" :aria-pressed="filter === category" @click="filter = category">{{ t(labels[category]) }} <span>{{ counts[category] }}</span></button>
      </div>
      <div class="grid">
        <button v-for="(item, index) in items" :key="item.local" type="button" class="shot-button tile" :aria-label="t('showcase.enlargeLabel')" @click="open(index)">
          <span class="frame media">
            <SiteImage :src="picture(item)" :alt="t(item.title)" :file="item.file" />
          </span>
          <span class="meta">
            <small>{{ String(index + 1).padStart(2, '0') }} · {{ t(labels[item.category]) }}</small>
            <strong>{{ t(item.title) }}</strong>
          </span>
        </button>
      </div>
      <p class="note"><span>{{ t('themes.footnote') }}</span> <a :href="DOCS" target="_blank" rel="noopener noreferrer">{{ t('themes.sources') }} <ArrowUpRight :size="13" /></a></p>
    </div>
  </section>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 22px; }
.filters button {
  display: inline-flex; align-items: center; gap: 8px;
  min-height: 36px; padding: 0 12px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg-elevated);
  color: var(--text-secondary); font-size: 13px; font-weight: 500;
}
.filters button[aria-pressed="true"] { color: var(--accent-text); border-color: var(--accent); background: var(--accent-soft); }
.filters span { color: var(--text-tertiary); font-variant-numeric: tabular-nums; font-size: 12px; }
.grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.tile {
  content-visibility: auto;
  contain-intrinsic-size: auto 280px;
  border: 1px solid var(--border); border-radius: 12px; background: var(--bg-elevated);
  padding: 8px; cursor: zoom-in;
  transition: border-color 0.2s var(--ease), transform 0.2s var(--ease);
}
.tile:hover { border-color: var(--border-strong); transform: translateY(-2px); }
.frame { display: block; aspect-ratio: 16 / 10; overflow: hidden; border-radius: 8px; background: var(--bg-subtle); }
.frame :deep(img) { width: 100%; height: 100%; object-fit: contain; object-position: center top; }
.meta { display: flex; flex-direction: column; gap: 4px; padding: 10px 6px 6px; min-width: 0; text-align: left; }
.meta small { color: var(--text-tertiary); font-size: 12px; }
.meta strong { font-size: 14px; font-weight: 600; line-height: 1.4; }
.note { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 20px 0 0; color: var(--text-tertiary); font-size: 13px; }
.note a { display: inline-flex; align-items: center; gap: 4px; color: var(--accent-text); font-weight: 600; }
@media (max-width: 1100px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
</style>
