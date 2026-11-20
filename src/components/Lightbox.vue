<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { useSite } from '../composables/useSite'
import { setScrollLock } from '../scrollLock'
import SiteImage from './SiteImage.vue'

const { t, lightbox, closeImage, stepImage } = useSite()
const dialog = ref<HTMLElement | null>(null)

function onKey(event: KeyboardEvent) {
  if (!lightbox.value) return
  if (event.key === 'Escape') closeImage()
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault()
    stepImage(event.key === 'ArrowLeft' ? -1 : 1)
  }
  if (event.key !== 'Tab' || !dialog.value) return
  const nodes = [...dialog.value.querySelectorAll<HTMLElement>('button')]
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}

watch(lightbox, async value => {
  setScrollLock('lightbox', value !== null)
  if (!value) return
  await nextTick()
  dialog.value?.querySelector<HTMLElement>('button')?.focus()
})

window.addEventListener('keydown', onKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  setScrollLock('lightbox', false)
})
</script>

<template>
  <div
    v-if="lightbox"
    ref="dialog"
    class="lightbox"
    role="dialog"
    aria-modal="true"
    :aria-label="lightbox.title"
    @click.self="closeImage"
  >
    <div class="bar">
      <p>{{ lightbox.title }}</p>
      <div class="actions">
        <button v-if="lightbox.frames.length > 1" type="button" :aria-label="t('common.previous')" @click="stepImage(-1)"><ChevronLeft :size="20" /></button>
        <button v-if="lightbox.frames.length > 1" type="button" :aria-label="t('common.next')" @click="stepImage(1)"><ChevronRight :size="20" /></button>
        <button type="button" :aria-label="t('image.close')" @click="closeImage"><X :size="20" /></button>
      </div>
    </div>
    <SiteImage :key="lightbox.src" class="preview" :src="lightbox.src" :alt="lightbox.title" :file="lightbox.file" eager />
  </div>
</template>

<style scoped>
.lightbox {
  position: fixed; inset: 0; z-index: 70;
  display: flex; align-items: center; justify-content: center;
  padding: 72px 20px 20px;
  background: rgba(10, 10, 12, 0.92);
}
.bar {
  position: absolute; top: 0; left: 0; right: 0; min-height: 60px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 12px 16px; color: #f4f4f2;
}
.bar p { margin: 0; font-size: 14px; line-height: 1.4; }
.actions { display: flex; gap: 8px; flex-shrink: 0; }
.actions button {
  width: 36px; height: 36px; display: grid; place-items: center;
  border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.16); color: #f4f4f2;
}
.preview { max-width: min(1200px, 100%); max-height: calc(100vh - 110px); width: auto; height: auto; object-fit: contain; border-radius: 8px; }
@media (max-width: 720px) {
  .lightbox { padding: 84px 10px 12px; }
  .bar p { font-size: 13px; }
}
</style>
