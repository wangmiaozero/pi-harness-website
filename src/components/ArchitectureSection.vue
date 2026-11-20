<script setup lang="ts">
import { ArrowUpRight, Eye, ShieldCheck, Terminal, Workflow } from 'lucide-vue-next'
import { REPO } from '../data'
import { useSite } from '../composables/useSite'

const { t } = useSite()
</script>

<template>
  <section class="section reveal" :aria-label="t('architecture.label')">
    <div class="container panel">
      <div class="copy">
        <p class="kicker">{{ t('architecture.kicker') }}</p>
        <h2>{{ t('architecture.title1') }}<br /><span class="quiet">{{ t('architecture.title2') }}</span></h2>
        <p>{{ t('architecture.description') }}</p>
        <a class="text-link" :href="`${REPO}#architecture`" target="_blank" rel="noopener noreferrer">{{ t('architecture.explore') }} <ArrowUpRight :size="15" /></a>
      </div>
      <div class="diagram">
        <div class="row front">
          <span class="pi" aria-hidden="true">π</span>
          <span><strong>{{ t('architecture.desktop') }}</strong><small>{{ t('architecture.workspace') }}</small></span>
        </div>
        <p class="link"><span>{{ t('architecture.controlPlane') }}</span></p>
        <div class="row harness">
          <span><Eye :size="15" /> {{ t('common.observe') }}</span>
          <span><ShieldCheck :size="15" /> {{ t('common.control') }}</span>
          <span><Workflow :size="15" /> {{ t('common.orchestrate') }}</span>
        </div>
        <p class="link"><span>{{ t('architecture.engine') }}</span></p>
        <div class="row runtime">
          <Terminal :size="18" />
          <strong>Pi Coding Agent</strong>
          <em>{{ t('common.active') }}</em>
        </div>
        <div class="chips">
          <span>{{ t('common.skills') }}</span>
          <span>MCP</span>
          <span>{{ t('common.extensions') }}</span>
          <span>{{ t('common.providers') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.panel {
  display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.9fr);
  gap: 48px; align-items: center;
  padding: 40px; border: 1px solid var(--border); border-radius: 16px; background: var(--bg-elevated);
}
h2 { margin: 0 0 16px; font-size: clamp(2rem, 3.4vw, 2.8rem); letter-spacing: -0.04em; line-height: 1.1; font-weight: 600; }
.copy > p:not(.kicker) { margin: 0; max-width: 46ch; color: var(--text-secondary); font-size: 15px; line-height: 1.7; }
.diagram { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.row, .chips span {
  border: 1px solid var(--border); border-radius: 10px; background: var(--bg);
}
.front, .runtime { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
.front strong, .runtime strong { display: block; font-size: 14px; }
.front small { display: block; margin-top: 2px; color: var(--text-tertiary); font-size: 12px; }
.pi { font-family: Georgia, serif; font-size: 28px; line-height: 1; }
.harness { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.harness span, .chips span {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 42px; padding: 8px; font-size: 13px; text-align: center;
}
.link { display: flex; justify-content: center; margin: 0; color: var(--text-tertiary); font-size: 12px; }
.runtime em { margin-left: auto; font-style: normal; color: var(--accent-text); font-size: 12px; font-weight: 600; }
.chips { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
@media (max-width: 800px) {
  .panel { grid-template-columns: 1fr; padding: 24px 18px; gap: 28px; }
  .harness, .chips { grid-template-columns: 1fr 1fr; }
  .runtime { flex-wrap: wrap; }
  .runtime em { margin-left: 0; }
}
</style>
