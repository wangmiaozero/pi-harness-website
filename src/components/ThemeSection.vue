<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { DOCS, SKINS, picture, themes } from '../data'
import type { MessageKey } from '../i18n'
import { useSite } from '../composables/useSite'
import SiteImage from './SiteImage.vue'

const { t, openImage } = useSite()
const labels = ['themes.ming', 'themes.starship', 'themes.macos'] as const
const entries = themes.map((item, index) => ({ item, label: labels[index]! }))
const lead = entries[0]!
const rest = entries.slice(1)

function open(item: { file: string; local: string; title: MessageKey }) {
  openImage({ src: picture(item), title: t(item.title), file: item.file })
}
</script>

<template>
  <section id="themes" class="section reveal" aria-labelledby="themes-title">
    <div class="container">
      <header class="section-intro">
        <p class="kicker">{{ t('themes.kicker') }}</p>
        <h2 id="themes-title">{{ t('themes.title1') }}<br /><span class="quiet">{{ t('themes.title2') }}</span></h2>
        <div>
          <p class="lede">{{ t('themes.description') }}</p>
          <a class="text-link" :href="SKINS" target="_blank" rel="noopener noreferrer">{{ t('themes.create') }} <ArrowUpRight :size="15" /></a>
        </div>
      </header>
      <div class="portfolio">
        <button class="shot-button lead" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(lead.item)">
          <div class="device media">
            <SiteImage :src="picture(lead.item)" :alt="t(lead.item.title)" :file="lead.item.file" />
          </div>
          <span class="info">
            <small>{{ t(lead.label) }}</small>
            <strong>{{ t(lead.item.title) }}</strong>
            <em>{{ t(lead.item.description) }}</em>
          </span>
        </button>
        <div class="side">
          <button v-for="entry in rest" :key="entry.item.key" class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(entry.item)">
            <div class="device media">
              <SiteImage :src="picture(entry.item)" :alt="t(entry.item.title)" :file="entry.item.file" />
            </div>
            <span class="info">
              <small>{{ t(entry.label) }}</small>
              <strong>{{ t(entry.item.title) }}</strong>
              <em>{{ t(entry.item.description) }}</em>
            </span>
          </button>
        </div>
      </div>
      <p class="note"><span>{{ t('themes.footnote') }}</span> <a :href="DOCS" target="_blank" rel="noopener noreferrer">{{ t('themes.sources') }} <ArrowUpRight :size="13" /></a></p>
    </div>
  </section>
</template>

<style scoped>
.portfolio { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.9fr); gap: 20px; align-items: start; }
.side { display: grid; gap: 20px; }
.shot-button { display: flex; flex-direction: column; gap: 12px; }
.info { display: flex; flex-direction: column; gap: 4px; min-width: 0; text-align: left; }
.info small { color: var(--text-tertiary); font-size: 12px; font-weight: 500; }
.info strong { font-size: 16px; letter-spacing: -0.02em; }
.info em { color: var(--text-secondary); font-style: normal; font-size: 13px; line-height: 1.5; }
.shot-button:hover .device { transform: translateY(-2px); }
.device { transition: transform 0.25s var(--ease); }
.note { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; margin: 18px 0 0; color: var(--text-tertiary); font-size: 13px; }
.note a { display: inline-flex; align-items: center; gap: 4px; color: var(--accent-text); font-weight: 600; }
@media (max-width: 900px) { .portfolio { grid-template-columns: 1fr; } }
</style>
