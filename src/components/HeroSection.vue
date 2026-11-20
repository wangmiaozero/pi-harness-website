<script setup lang="ts">
import { Apple, ArrowRight, Download, Github, Monitor, Terminal } from 'lucide-vue-next'
import { media, picture, screenshots, REPO } from '../data'
import type { MessageKey } from '../i18n'
import { useSite } from '../composables/useSite'

const { t, openImage, jumpTo } = useSite()

function byKey(key: (typeof screenshots)[number]['key']) {
  const item = screenshots.find(entry => entry.key === key)
  if (!item) throw new Error(key)
  return item
}

const workspace = byKey('workspace')
const lineup: { key: string; src: string; item: typeof workspace; title: MessageKey }[] = [
  { key: 'agents', src: media('assets/mockups/agents.webp'), item: byKey('agents'), title: byKey('agents').title },
  { key: 'harness', src: media('assets/mockups/harness.webp'), item: byKey('harness'), title: byKey('harness').title },
  { key: 'studio', src: media('assets/mockups/studio.webp'), item: workspace, title: 'metrics.languages' },
  { key: 'desktop', src: media('assets/mockups/desktop.webp'), item: byKey('subagents'), title: byKey('subagents').title },
]

function frameOf(item: { file: string; local: string; title: MessageKey }) {
  return { src: picture(item), title: t(item.title), file: item.file }
}

function enlarge(item: { file: string; local: string; title: MessageKey }) {
  openImage(frameOf(item))
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="container hero-copy">
      <p class="kicker">{{ t('hero.eyebrow') }}</p>
      <h1 id="hero-title">
        <span>{{ t('hero.title1') }}</span>
        <span class="quiet">{{ t('hero.title2') }}</span>
        <span class="quiet">{{ t('hero.title3') }}</span>
      </h1>
      <p class="lede">{{ t('hero.description') }}</p>
      <div class="cluster center hero-actions">
        <a class="btn btn-primary" href="#downloads" @click.prevent="jumpTo('downloads')">
          <Download :size="18" /> {{ t('hero.download') }} <ArrowRight :size="16" />
        </a>
        <a class="btn btn-secondary" :href="REPO" target="_blank" rel="noopener noreferrer">
          <Github :size="18" /> {{ t('hero.github') }}
        </a>
      </div>
      <ul class="os-row" :aria-label="t('hero.platforms')">
        <li><Apple :size="15" /> macOS</li>
        <li><Monitor :size="15" /> Windows</li>
        <li><Terminal :size="15" /> Linux</li>
      </ul>
      <p class="proof">{{ t('hero.bundled') }} · {{ t('hero.native') }} · {{ t('hero.local') }}</p>
    </div>
    <div class="studio">
      <div class="container-wide">
        <button class="shot-button" type="button" :aria-label="t('hero.enlarge')" @click="enlarge(workspace)">
          <img class="mock" :src="media('assets/mockups/workspace.webp')" :alt="t(workspace.title)" width="1400" height="900" />
        </button>
      </div>
      <div class="container trio">
        <figure v-for="shot in lineup" :key="shot.key">
          <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="enlarge(shot.item)">
            <img class="mock" :src="shot.src" :alt="t(shot.title)" width="1400" height="900" loading="lazy" />
          </button>
          <figcaption>{{ t(shot.title) }}</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding: 28px 0 8px; }
.hero-copy { max-width: 760px; text-align: center; }
.kicker { letter-spacing: 0.01em; margin-bottom: 8px; }
h1 { font-size: clamp(2.25rem, 4.4vw, 3.5rem); line-height: 1.04; }
h1 span { display: block; }
.lede { max-width: 38rem; margin: 12px auto 0; font-size: 16px; }
.hero-actions { margin-top: 18px; }
.os-row {
  display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;
  margin: 14px 0 0; padding: 0; list-style: none;
}
.os-row li {
  display: inline-flex; align-items: center; gap: 6px;
  min-height: 32px; padding: 0 10px;
  color: var(--text-secondary); font-size: 13px; font-weight: 500;
  border: 1px solid var(--border); border-radius: 8px; background: var(--bg-elevated);
}
.proof { margin: 8px 0 0; color: var(--text-tertiary); font-size: 13px; }
.studio {
  margin-top: 36px;
  padding: 48px 0 28px;
  background: #000;
}
.shot-button { color: inherit; display: block; width: 100%; }
.mock {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.25s var(--ease);
}
.shot-button:hover .mock { transform: translateY(-4px); }
.trio {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}
.trio figure { margin: 0; min-width: 0; }
.trio figcaption {
  margin-top: 4px;
  text-align: center;
  color: #c7c7cc;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
}
:lang(de) h1, :lang(fr) h1, :lang(ru) h1 { font-size: clamp(2rem, 3.6vw, 3rem); }
@media (max-width: 900px) {
  .trio { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 14px; }
  .studio { padding: 32px 0 20px; }
}
@media (max-width: 720px) {
  .hero { padding-top: 20px; }
  .lede { font-size: 15px; }
  .studio { margin-top: 24px; padding: 28px 0 18px; }
  .trio {
    display: flex;
    gap: 14px;
    margin-top: 22px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 8px;
  }
  .trio figure { flex: 0 0 78%; scroll-snap-align: center; }
}
</style>
