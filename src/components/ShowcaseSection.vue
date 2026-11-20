<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-vue-next'
import { DOCS, picture, screenshots } from '../data'
import { useSite } from '../composables/useSite'
import SiteImage from './SiteImage.vue'

const { t, openImage, lightbox, reducedMotion } = useSite()
const slideIndex = ref(0)
const rail = ref<HTMLElement | null>(null)
const slide = computed(() => screenshots[slideIndex.value]!)

const frames = computed(() => screenshots.map(item => ({
  src: picture(item),
  title: t(item.title),
  file: item.file,
})))

function move(delta: number, focusTab: boolean) {
  slideIndex.value = (slideIndex.value + delta + screenshots.length) % screenshots.length
  if (!focusTab) return
  void nextTick(() => rail.value?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus())
}

function revealTab() {
  const root = rail.value
  const current = root?.querySelector<HTMLElement>('[aria-selected="true"]')
  if (!root || !current) return
  const left = current.offsetLeft - root.clientWidth / 2 + current.clientWidth / 2
  root.scrollTo({ left, behavior: reducedMotion.value ? 'auto' : 'smooth' })
}

watch(slideIndex, async () => { await nextTick(); revealTab() })

function onKey(event: KeyboardEvent) {
  if (lightbox.value) return
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  const target = event.target
  if (!(target instanceof HTMLElement) || !target.closest('.preview-section')) return
  event.preventDefault()
  move(event.key === 'ArrowLeft' ? -1 : 1, target.getAttribute('role') === 'tab')
}

function enlarge() {
  const frame = frames.value[slideIndex.value]
  if (frame) openImage(frame, frames.value)
}
</script>

<template>
  <section id="showcase" class="section preview-section reveal" tabindex="0" aria-labelledby="showcase-title" @keydown="onKey">
    <div class="container">
      <header class="section-intro">
        <p class="kicker">{{ t('showcase.kicker') }}</p>
        <h2 id="showcase-title">{{ t('showcase.title1') }}<br /><span class="quiet">{{ t('showcase.title2') }}</span></h2>
        <p class="lede">{{ t('showcase.description') }}</p>
      </header>

      <div id="shot-panel" class="stage" role="tabpanel" :aria-labelledby="`shot-tab-${slide.key}`">
        <button class="shot-button" type="button" :aria-label="t('showcase.enlargeLabel')" @click="enlarge">
          <div class="device media">
            <SiteImage :key="slide.key" class="swap" :src="picture(slide)" :alt="t(slide.title)" :file="slide.file" />
          </div>
        </button>
      </div>

      <div class="shot-bar">
        <div aria-live="polite">
          <p class="meta"><span class="mono">{{ String(slideIndex + 1).padStart(2, '0') }} / {{ String(screenshots.length).padStart(2, '0') }}</span> · {{ t(slide.category) }}</p>
          <h3>{{ t(slide.title) }}</h3>
          <p>{{ t(slide.description) }}</p>
        </div>
        <div class="arrows">
          <button type="button" class="icon-btn arrow" :aria-label="t('common.previous')" @click="move(-1, false)"><ChevronLeft :size="18" /></button>
          <button type="button" class="icon-btn arrow" :aria-label="t('common.next')" @click="move(1, false)"><ChevronRight :size="18" /></button>
        </div>
      </div>
      <div class="progress" aria-hidden="true"><span :style="{ width: `${((slideIndex + 1) / screenshots.length) * 100}%` }" /></div>
      <div ref="rail" class="rail" role="tablist" :aria-label="t('showcase.kicker')">
        <button
          v-for="(item, index) in screenshots"
          :id="`shot-tab-${item.key}`"
          :key="item.key"
          type="button"
          role="tab"
          :aria-selected="slideIndex === index"
          :tabindex="slideIndex === index ? 0 : -1"
          aria-controls="shot-panel"
          @click="slideIndex = index"
        >{{ t(item.category) }}</button>
      </div>
      <a class="text-link" :href="DOCS" target="_blank" rel="noopener noreferrer">{{ t('showcase.browse') }} <ArrowUpRight :size="15" /></a>
    </div>
  </section>
</template>

<style scoped>
.preview-section:focus-visible { outline: none; }
.stage { margin-bottom: 22px; }
.swap { animation: fade 0.35s var(--ease); }
.shot-bar { display: flex; justify-content: space-between; gap: 24px; align-items: flex-end; }
.meta { margin: 0 0 8px; color: var(--text-tertiary); font-size: 13px; }
.shot-bar h3 { margin: 0; font-size: clamp(1.4rem, 2vw, 1.8rem); letter-spacing: -0.03em; line-height: 1.25; }
.shot-bar p { margin: 8px 0 0; max-width: 62ch; color: var(--text-secondary); font-size: 15px; line-height: 1.65; }
.arrows { display: flex; gap: 8px; flex-shrink: 0; }
.arrow { border: 1px solid var(--border-strong); background: var(--bg-elevated); }
.progress { height: 2px; margin: 20px 0 14px; background: var(--border); border-radius: 2px; overflow: hidden; }
.progress span { display: block; height: 100%; background: var(--accent); }
.rail { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.rail button {
  flex: 0 0 auto; min-height: 36px; padding: 0 12px;
  border-radius: 8px; border: 1px solid var(--border);
  background: var(--bg-elevated); color: var(--text-secondary); font-size: 13px; font-weight: 500;
}
.rail button[aria-selected="true"] { color: var(--accent-text); border-color: var(--accent); background: var(--accent-soft); }
@keyframes fade { from { opacity: 0.45; } to { opacity: 1; } }
@media (max-width: 720px) {
  .shot-bar { flex-direction: column; align-items: stretch; }
  .arrows { align-self: flex-end; }
}
</style>
