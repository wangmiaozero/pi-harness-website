<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUpRight, Blocks, ChevronDown, Github, MessageCircle, Sparkles } from 'lucide-vue-next'
import { COMMUNITY, REPO, SDK, SKINS } from '../data'
import type { MessageKey } from '../i18n'
import { useSite } from '../composables/useSite'

const { t } = useSite()
const faqOpen = ref<number | null>(0)
const faqs = [0, 1, 2, 3].map(index => ({
  question: `faq.${index}.question` as MessageKey,
  answer: `faq.${index}.answer` as MessageKey,
}))
</script>

<template>
  <section class="section reveal">
    <div class="container">
      <header class="section-intro">
        <p class="kicker">{{ t('community.kicker') }}</p>
        <h2>{{ t('community.title1') }}<br /><span class="quiet">{{ t('community.title2') }}</span></h2>
        <p class="lede">{{ t('community.description') }}</p>
      </header>
      <div class="links">
        <a :href="REPO" target="_blank" rel="noopener noreferrer"><Github :size="20" /><span><strong>{{ t('community.repository') }}</strong><small>{{ t('community.source') }}</small></span><ArrowUpRight :size="16" /></a>
        <a :href="SDK" target="_blank" rel="noopener noreferrer"><Blocks :size="20" /><span><strong>Harness Plugin SDK</strong><small>{{ t('community.plugins') }}</small></span><ArrowUpRight :size="16" /></a>
        <a :href="SKINS" target="_blank" rel="noopener noreferrer"><Sparkles :size="20" /><span><strong>Skin Starter</strong><small>{{ t('community.skins') }}</small></span><ArrowUpRight :size="16" /></a>
        <a :href="COMMUNITY" target="_blank" rel="noopener noreferrer"><MessageCircle :size="20" /><span><strong>{{ t('community.contact') }}</strong><small>{{ t('community.contactDescription') }}</small></span><ArrowUpRight :size="16" /></a>
      </div>
      <div class="faq">
        <div>
          <p class="kicker">FAQ</p>
          <h3>{{ t('faq.title') }}</h3>
          <p>{{ t('faq.description') }}</p>
        </div>
        <div class="list">
          <div v-for="(faq, index) in faqs" :key="faq.question" class="item">
            <button type="button" :aria-expanded="faqOpen === index" :aria-controls="`faq-${index}`" @click="faqOpen = faqOpen === index ? null : index">
              <span>{{ t(faq.question) }}</span>
              <ChevronDown :size="18" :class="{ turned: faqOpen === index }" />
            </button>
            <div :id="`faq-${index}`" :hidden="faqOpen !== index">
              <p>{{ t(faq.answer) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.links { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; background: var(--bg-elevated); }
.links a {
  display: flex; align-items: center; gap: 14px; min-height: 96px; padding: 20px 22px;
  border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); color: var(--text);
}
.links a:nth-child(2n) { border-right: 0; }
.links a:nth-last-child(-n + 2) { border-bottom: 0; }
.links a:hover { background: var(--bg-subtle); }
.links span { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.links strong { font-size: 15px; }
.links small { color: var(--text-secondary); font-size: 13px; line-height: 1.45; }
.links svg:last-child { color: var(--text-tertiary); }
.faq { display: grid; grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr); gap: 40px; margin-top: 72px; }
.faq h3 { margin: 0 0 10px; font-size: 1.7rem; letter-spacing: -0.03em; }
.faq > div > p:last-child { margin: 0; color: var(--text-secondary); font-size: 14px; line-height: 1.65; max-width: 36ch; }
.item { border-top: 1px solid var(--border); }
.item:last-child { border-bottom: 1px solid var(--border); }
.item button { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 56px; text-align: left; font-size: 15px; font-weight: 600; }
.item button svg { color: var(--text-tertiary); transition: transform 0.2s var(--ease); }
.turned { transform: rotate(180deg); }
.item p { margin: 0 0 16px; color: var(--text-secondary); font-size: 14px; line-height: 1.7; }
@media (max-width: 800px) {
  .links { grid-template-columns: 1fr; }
  .links a { border-right: 0; }
  .links a:nth-last-child(-n + 2) { border-bottom: 1px solid var(--border); }
  .links a:last-child { border-bottom: 0; }
  .faq { grid-template-columns: 1fr; gap: 20px; margin-top: 48px; }
}
</style>
