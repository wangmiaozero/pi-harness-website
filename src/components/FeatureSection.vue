<script setup lang="ts">
import { picture, screenshots, gallery, themes, SKINS } from '../data'
import type { MessageKey } from '../i18n'
import { useSite } from '../composables/useSite'
import SiteImage from './SiteImage.vue'

const { t, openImage } = useSite()

function shot(key: (typeof screenshots)[number]['key']) {
  const item = screenshots.find(entry => entry.key === key)
  if (!item) throw new Error(key)
  return item
}
function galleryItem(local: string) {
  const item = gallery.find(entry => entry.local === local)
  if (!item) throw new Error(local)
  return item
}

const workspace = shot('workspace')
const agents = shot('agents')
const models = shot('models')
const history = shot('history')
const harness = shot('harness')
const mcp = shot('mcp')
const nativeShot = galleryItem('功能界面--经典主题--工具Harness-2.webp')
const git = galleryItem('功能界面--经典主题--Git.webp')
const theme = themes[0]

function open(item: { file: string; local: string; title: MessageKey }) {
  openImage({ src: picture(item), title: t(item.title), file: item.file })
}
</script>

<template>
  <section id="features" class="section reveal" aria-labelledby="features-title">
    <div class="container">
      <header class="section-intro">
        <p class="kicker">{{ t('philosophy.kicker') }}</p>
        <h2 id="features-title">{{ t('philosophy.title1') }}<br /><span class="quiet">{{ t('philosophy.title2') }}</span></h2>
        <p class="lede">{{ t('philosophy.description') }}</p>
      </header>

      <div class="principles">
        <article>
          <p class="index">01</p>
          <h3>{{ t('philosophy.observe') }}</h3>
          <p>{{ t('philosophy.observeDescription') }}</p>
        </article>
        <article>
          <p class="index">02</p>
          <h3>{{ t('philosophy.control') }}</h3>
          <p>{{ t('philosophy.controlDescription') }}</p>
        </article>
        <article>
          <p class="index">03</p>
          <h3>{{ t('philosophy.orchestrate') }}</h3>
          <p>{{ t('philosophy.orchestrateDescription') }}</p>
        </article>
      </div>

      <div class="bento">
        <article class="card wide">
          <div class="copy">
            <p class="kicker">{{ t('screenshots.workspace.label') }}</p>
            <h3>{{ t(workspace.title) }}</h3>
            <p>{{ t(workspace.description) }}</p>
          </div>
          <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(workspace)">
            <div class="device media"><SiteImage :src="picture(workspace)" :alt="t(workspace.title)" :file="workspace.file" /></div>
          </button>
        </article>

        <div class="pair uneven">
          <article class="card stack">
            <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(nativeShot)">
              <div class="device media inset"><SiteImage :src="picture(nativeShot)" :alt="t(nativeShot.title)" :file="nativeShot.file" /></div>
            </button>
            <div class="copy">
              <p class="kicker">{{ t('capabilities.runtime') }}</p>
              <h3>{{ t('capabilities.native') }}</h3>
              <p>{{ t('capabilities.nativeDescription') }}</p>
              <ul class="tags">
                <li>{{ t('common.trace') }}</li>
                <li>{{ t('common.replay') }}</li>
                <li>{{ t('common.evaluation') }}</li>
              </ul>
            </div>
          </article>
          <article class="card stack">
            <button class="shot-button bleed" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(agents)">
              <span class="media"><SiteImage :src="picture(agents)" :alt="t(agents.title)" :file="agents.file" /></span>
            </button>
            <div class="copy">
              <p class="kicker">{{ t(agents.category) }}</p>
              <h3>{{ t(agents.title) }}</h3>
              <p>{{ t(agents.description) }}</p>
            </div>
          </article>
        </div>

        <div class="pair">
          <article class="card stack">
            <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(models)">
              <div class="device media inset"><SiteImage :src="picture(models)" :alt="t(models.title)" :file="models.file" /></div>
            </button>
            <div class="copy">
              <p class="kicker">{{ t(models.category) }}</p>
              <h3>{{ t(models.title) }}</h3>
              <p>{{ t(models.description) }}</p>
            </div>
          </article>
          <article class="card stack">
            <button class="shot-button bleed" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(git)">
              <span class="media"><SiteImage :src="picture(git)" :alt="t(git.title)" :file="git.file" /></span>
            </button>
            <div class="copy">
              <p class="kicker">{{ t('capabilities.development') }}</p>
              <h3>{{ t('capabilities.git') }}</h3>
              <p>{{ t('capabilities.gitDescription') }}</p>
            </div>
          </article>
        </div>

        <article class="card wide flip">
          <div class="copy">
            <p class="kicker">{{ t(history.category) }}</p>
            <h3>{{ t(history.title) }}</h3>
            <p>{{ t('capabilities.historyDescription') }}</p>
          </div>
          <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(history)">
            <div class="device media"><SiteImage :src="picture(history)" :alt="t(history.title)" :file="history.file" /></div>
          </button>
        </article>

        <div class="pair uneven flip-row">
          <article class="card stack">
            <button class="shot-button bleed" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(mcp)">
              <span class="media"><SiteImage :src="picture(mcp)" :alt="t(mcp.title)" :file="mcp.file" /></span>
            </button>
            <div class="copy">
              <p class="kicker">{{ t(mcp.category) }}</p>
              <h3>{{ t('capabilities.plugins') }}</h3>
              <p>{{ t('capabilities.pluginsDescription') }}</p>
            </div>
          </article>
          <article class="card stack">
            <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(harness)">
              <div class="device media inset"><SiteImage :src="picture(harness)" :alt="t(harness.title)" :file="harness.file" /></div>
            </button>
            <div class="copy">
              <p class="kicker">{{ t(harness.category) }}</p>
              <h3>{{ t(harness.title) }}</h3>
              <p>{{ t(harness.description) }}</p>
              <ul class="tags">
                <li>{{ t('common.policy') }}</li>
                <li>{{ t('common.budget') }}</li>
                <li>{{ t('common.recovery') }}</li>
              </ul>
            </div>
          </article>
        </div>

        <article class="card wide theme">
          <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="open(theme)">
            <div class="device media"><SiteImage :src="picture(theme)" :alt="t(theme.title)" :file="theme.file" /></div>
          </button>
          <div class="copy">
            <p class="kicker">{{ t('themes.ming') }}</p>
            <h3>{{ t(theme.title) }}</h3>
            <p>{{ t('themes.description') }}</p>
            <a class="text-link" :href="SKINS" target="_blank" rel="noopener noreferrer">{{ t('themes.create') }}</a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.principles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
  margin: 8px 0 28px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
}
.index { margin: 0 0 10px; color: var(--text-tertiary); font-size: 12px; font-variant-numeric: tabular-nums; }
.principles h3 { margin: 0 0 8px; font-size: 18px; letter-spacing: -0.03em; }
.principles p { margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.65; }
.bento { display: flex; flex-direction: column; gap: 16px; }
.card {
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  min-width: 0;
  transition: border-color 0.2s var(--ease), box-shadow 0.2s var(--ease);
}
.card:hover { border-color: var(--border-strong); box-shadow: var(--shadow-md); }
.card:hover :deep(img) { transform: scale(1.015); }
.card :deep(img) { transition: transform 0.45s var(--ease); }
.wide {
  display: grid;
  grid-template-columns: minmax(0, 0.78fr) minmax(0, 1.22fr);
  gap: 28px;
  align-items: center;
  padding: 24px;
}
.wide .shot-button, .wide .device { width: 100%; }
.wide.flip { grid-template-columns: minmax(0, 1.22fr) minmax(0, 0.78fr); }
.wide.flip .copy { order: 2; }
.wide.flip .shot-button { order: 1; }
.theme { grid-template-columns: minmax(0, 1.25fr) minmax(240px, 0.75fr); }
.copy { min-width: 0; padding: 8px; }
.card h3 { margin: 0; font-size: clamp(1.35rem, 2vw, 1.85rem); letter-spacing: -0.03em; line-height: 1.2; }
.card .copy > p:last-of-type, .stack .copy > p { margin: 10px 0 0; color: var(--text-secondary); font-size: 14px; line-height: 1.65; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; }
.uneven { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); }
.flip-row { grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr); }
.stack { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.stack .copy { padding: 8px 22px 22px; }
.bleed { border-radius: 16px 16px 0 0; overflow: hidden; background: var(--bg-subtle); }
.bleed img { width: 100%; height: auto; }
.inset { margin: 16px 16px 0; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin: 16px 0 0; padding: 0; list-style: none; }
.tags li { font-size: 12px; color: var(--text-secondary); background: var(--bg-subtle); border-radius: 6px; padding: 4px 8px; }
@media (max-width: 900px) {
  .principles, .pair, .uneven, .flip-row, .wide, .side, .theme { grid-template-columns: 1fr; }
  .wide.flip .copy, .wide.flip .shot-button { order: 0; }
  .wide, .side { padding: 16px; gap: 16px; }
}
@media (max-width: 720px) {
  .principles { gap: 20px; }
}
</style>
