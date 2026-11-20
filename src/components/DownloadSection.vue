<script setup lang="ts">
import { computed } from 'vue'
import { Apple, ArrowUpRight, Check, HardDriveDownload, Monitor, Terminal } from 'lucide-vue-next'
import { REPO, RELEASES } from '../data'
import { useSite } from '../composables/useSite'
import { useGithub, type PlatformKey } from '../composables/useGithub'

const { t } = useSite()
const { release, platform, platforms, selectedAsset, downloadUrl, platformName, selectPlatform } = useGithub()
const releaseLabel = computed(() => release.value?.tag_name ?? t('release.latest'))

function iconFor(key: PlatformKey) {
  return key === 'windows' ? Monitor : key === 'linux' ? Terminal : Apple
}
</script>

<template>
  <section id="downloads" class="section reveal" aria-labelledby="download-title">
    <div class="container layout">
      <div class="copy">
        <p class="kicker">{{ t('download.kicker') }}</p>
        <h2 id="download-title">{{ t('download.title1') }}<br /><span class="quiet">{{ t('download.title2') }}</span></h2>
        <p>{{ t('download.description') }}</p>
        <p class="update">{{ t('download.update') }}</p>
        <p class="release"><span class="mono">{{ releaseLabel }}</span><span>{{ t('hero.platforms') }}</span></p>
      </div>
      <div class="card">
        <div class="card-top">
          <span>{{ t('download.choose') }}</span>
          <span>{{ t('download.free') }}</span>
        </div>
        <div class="platforms">
          <button
            v-for="item in platforms"
            :key="item.key"
            type="button"
            :class="{ selected: platform === item.key }"
            :aria-pressed="platform === item.key"
            @click="selectPlatform(item.key)"
          >
            <component :is="iconFor(item.key)" :size="18" />
            <span><strong>{{ item.name }}</strong><small>{{ item.sub }}</small></span>
            <Check v-if="platform === item.key" :size="16" class="check" />
          </button>
        </div>
        <a class="btn btn-primary btn-lg" :href="downloadUrl" target="_blank" rel="noopener noreferrer">
          <HardDriveDownload :size="18" />
          <span>{{ selectedAsset ? `${t('download.for')} ${platformName}` : t('download.releases') }}</span>
          <ArrowUpRight :size="16" />
        </a>
        <p class="filename mono">{{ selectedAsset?.name || t('download.installer') }}</p>
        <div class="links">
          <a :href="RELEASES" target="_blank" rel="noopener noreferrer">{{ t('download.all') }} <ArrowUpRight :size="14" /></a>
          <a :href="`${REPO}/blob/main/docs/release/community-release.md`" target="_blank" rel="noopener noreferrer">{{ t('download.notes') }} <ArrowUpRight :size="14" /></a>
        </div>
        <p class="caveat">{{ t('download.caveat') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.layout { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(280px, 1fr); gap: 48px; align-items: start; }
h2 { margin: 0 0 16px; font-size: clamp(2.1rem, 4vw, 3.3rem); letter-spacing: -0.042em; line-height: 1.08; font-weight: 600; }
.copy > p { margin: 0 0 14px; color: var(--text-secondary); font-size: 15px; line-height: 1.7; max-width: 46ch; }
.update { font-size: 13px !important; color: var(--text-tertiary) !important; }
.release { display: flex; flex-wrap: wrap; gap: 8px 14px; color: var(--text); font-size: 13px; }
.card {
  background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 16px;
  padding: 22px; box-shadow: var(--shadow-md);
}
.card-top, .links { display: flex; justify-content: space-between; gap: 12px; color: var(--text-tertiary); font-size: 12px; font-weight: 500; }
.platforms { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
.platforms button {
  display: flex; align-items: center; gap: 10px; min-height: 64px; padding: 10px 12px;
  text-align: left; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); color: var(--text);
}
.platforms button span { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.platforms strong { font-size: 14px; }
.platforms small { color: var(--text-tertiary); font-size: 12px; }
.platforms button.selected { border-color: var(--accent); background: var(--accent-soft); }
.check { margin-left: auto; color: var(--accent-text); }
.filename { margin: 12px 0 16px; text-align: center; color: var(--text-tertiary); font-size: 12px; overflow-wrap: anywhere; }
.links { border-top: 1px solid var(--border); padding-top: 14px; }
.links a { display: inline-flex; align-items: center; gap: 4px; color: var(--text-secondary); font-size: 13px; }
.links a:hover { color: var(--text); }
.caveat { margin: 14px 0 0; color: var(--text-tertiary); font-size: 12px; line-height: 1.6; }
@media (max-width: 800px) {
  .layout { grid-template-columns: 1fr; gap: 24px; }
  .platforms { grid-template-columns: 1fr; }
}
</style>
