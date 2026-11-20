<script setup lang="ts">
import { computed, ref } from 'vue'
import { Play } from 'lucide-vue-next'
import { films, media } from '../data'
import { useSite } from '../composables/useSite'

const { t, lightbox } = useSite()
const filmIndex = ref(0)
const player = ref<HTMLVideoElement | null>(null)
const film = computed(() => films[filmIndex.value]!)

function jump(index: number) {
  player.value?.pause()
  filmIndex.value = index
}

function onKey(event: KeyboardEvent) {
  if (lightbox.value || event.target instanceof HTMLVideoElement) return
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
  const target = event.target
  if (!(target instanceof HTMLElement) || !target.closest('.film-section')) return
  event.preventDefault()
  const delta = event.key === 'ArrowLeft' ? -1 : 1
  jump((filmIndex.value + delta + films.length) % films.length)
}
</script>

<template>
  <section id="films" class="section film-section reveal" tabindex="0" aria-labelledby="films-title" @keydown="onKey">
    <div class="container">
      <header class="section-intro">
        <p class="kicker">{{ t('films.kicker') }}</p>
        <h2 id="films-title">{{ t('films.title1') }}<br /><span class="quiet">{{ t('films.title2') }}</span></h2>
        <p class="lede">{{ t('films.description') }}</p>
      </header>
      <div class="device player">
        <video
          :key="film.key"
          ref="player"
          :src="media(film.file)"
          :poster="media(film.poster)"
          controls
          playsinline
          preload="metadata"
          :aria-label="t(film.title)"
        />
      </div>
      <div class="film-grid">
        <button
          v-for="(item, index) in films"
          :key="item.key"
          type="button"
          class="film-card"
          :aria-pressed="filmIndex === index"
          :aria-label="`${t('films.play')}: ${t(item.title)}`"
          @click="jump(index)"
        >
          <span class="poster">
            <img :src="media(item.poster)" :alt="t(item.title)" width="1600" height="1039" loading="lazy" />
            <span class="play" aria-hidden="true"><Play :size="16" /></span>
          </span>
          <span class="meta">
            <strong>{{ t(item.title) }}</strong>
            <small class="mono">{{ item.duration }}</small>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.film-section:focus-visible { outline: none; }
.player { margin-bottom: 16px; }
.player video { background: #0c0c0e; aspect-ratio: 1600 / 1039; object-fit: contain; }
.film-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.film-card {
  display: flex; flex-direction: column; gap: 10px; min-width: 0; text-align: left; color: inherit;
  padding: 8px; border-radius: 12px; border: 1px solid var(--border); background: var(--bg-elevated);
}
.film-card[aria-pressed="true"] { border-color: var(--accent); }
.film-card:hover { border-color: var(--border-strong); }
.poster { position: relative; display: block; overflow: hidden; border-radius: 8px; background: var(--bg-subtle); }
.poster img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; }
.play {
  position: absolute; right: 8px; bottom: 8px; width: 28px; height: 28px;
  display: grid; place-items: center; border-radius: 50%;
  background: var(--bg-elevated); color: var(--text);
}
.meta { display: flex; flex-direction: column; gap: 2px; padding: 0 4px 4px; min-width: 0; }
.meta strong { font-size: 13px; font-weight: 600; line-height: 1.35; }
.meta small { color: var(--text-tertiary); font-size: 12px; }
@media (max-width: 900px) { .film-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) {
  .film-grid { grid-template-columns: 1fr; }
  .poster img { object-fit: contain; }
}
</style>
