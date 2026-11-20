<script setup lang="ts">
import { onMounted, onUnmounted, provide, ref } from 'vue'
import { useSiteLocale } from './i18n'
import { siteKey, type LightboxState, type MediaFrame } from './context'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import FeatureSection from './components/FeatureSection.vue'
import ShowcaseSection from './components/ShowcaseSection.vue'
import FilmSection from './components/FilmSection.vue'
import ThemeSection from './components/ThemeSection.vue'
import GallerySection from './components/GallerySection.vue'
import ArchitectureSection from './components/ArchitectureSection.vue'
import DownloadSection from './components/DownloadSection.vue'
import CommunitySection from './components/CommunitySection.vue'
import FinalCta from './components/FinalCta.vue'
import SiteFooter from './components/SiteFooter.vue'
import Lightbox from './components/Lightbox.vue'

const { locale, language, t, chooseLocale } = useSiteLocale()
const reducedMotion = ref(false)
const lightbox = ref<LightboxState | null>(null)

function openImage(frame: MediaFrame, frames?: MediaFrame[]) {
  const list = frames?.length ? frames : [frame]
  const index = list.findIndex(item => item.src === frame.src && item.file === frame.file)
  const current = list[index === -1 ? 0 : index] ?? frame
  lightbox.value = { ...current, frames: list, index: index === -1 ? 0 : index }
}

function closeImage() { lightbox.value = null }

function stepImage(delta: number) {
  const box = lightbox.value
  if (!box || box.frames.length < 2) return
  const index = (box.index + delta + box.frames.length) % box.frames.length
  const next = box.frames[index]
  if (!next) return
  lightbox.value = { ...next, frames: box.frames, index }
}

function jumpTo(id: string) {
  const behavior = reducedMotion.value ? 'auto' as const : 'smooth' as const
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior })
    return
  }
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
}

provide(siteKey, {
  t, locale, language, chooseLocale, jumpTo, openImage, closeImage, stepImage, lightbox, reducedMotion,
})

let revealObserver: IntersectionObserver | undefined

onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const nodes = [...document.querySelectorAll('.reveal')]
  if (reducedMotion.value || !('IntersectionObserver' in window)) {
    nodes.forEach(node => node.classList.add('in'))
    return
  }
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('in')
      revealObserver?.unobserve(entry.target)
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })
  nodes.forEach(node => revealObserver?.observe(node))
})

onUnmounted(() => revealObserver?.disconnect())
</script>

<template>
  <div class="site" :style="{ '--image-fallback': JSON.stringify(t('images.source')) }">
    <div :inert="lightbox ? true : undefined">
      <a class="skip" href="#top" @click.prevent="jumpTo('top')">{{ t('a11y.skip') }}</a>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <FeatureSection />
        <ShowcaseSection />
        <FilmSection />
        <ThemeSection />
        <GallerySection />
        <ArchitectureSection />
        <DownloadSection />
        <CommunitySection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
    <Lightbox />
  </div>
</template>
