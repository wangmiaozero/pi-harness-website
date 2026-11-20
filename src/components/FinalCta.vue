<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { ArrowRight, Check, Copy, Download } from 'lucide-vue-next'
import { useSite } from '../composables/useSite'

const { t, jumpTo } = useSite()
const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined
const command = 'git clone https://github.com/wangmiaozero/pi-harness.git'

async function copyClone() {
  try {
    await navigator.clipboard.writeText(command)
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { copied.value = false }, 2100)
  } catch {
    window.prompt(t('copy.command'), command)
  }
}

onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<template>
  <section class="cta reveal">
    <div class="container">
      <p class="kicker">{{ t('final.kicker') }}</p>
      <h2>{{ t('final.title1') }}<br /><span class="quiet">{{ t('final.title2') }}</span></h2>
      <div class="cluster center">
        <a class="btn btn-primary" href="#downloads" @click.prevent="jumpTo('downloads')"><Download :size="18" /> {{ t('final.download') }} <ArrowRight :size="16" /></a>
        <button class="btn btn-secondary" type="button" @click="copyClone">
          <Check v-if="copied" :size="16" />
          <Copy v-else :size="16" />
          {{ copied ? t('copy.done') : 'git clone' }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta { padding: 72px 0 96px; text-align: center; border-top: 1px solid var(--border); }
h2 { font-size: clamp(2.2rem, 5vw, 3.6rem); margin: 0 0 28px; }
</style>
