<script setup lang="ts">
import { fallbackPicture } from '../data'
import { useSite } from '../composables/useSite'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  file: string
  eager?: boolean
  width?: number
  height?: number
}>(), { width: 1600, height: 1000 })

const { t } = useSite()

function onError(event: Event) {
  const img = event.target as HTMLImageElement
  const fallback = fallbackPicture({ file: props.file })
  if (!img.dataset.retried && img.src !== fallback) {
    img.dataset.retried = 'true'
    img.src = fallback
    return
  }
  img.classList.add('img-unavailable')
  img.alt = t('image.unavailable')
}
</script>

<template>
  <img
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    :loading="eager ? 'eager' : 'lazy'"
    :fetchpriority="eager ? 'high' : undefined"
    decoding="async"
    draggable="false"
    @error="onError"
  />
</template>
