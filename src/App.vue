<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowRight, ArrowUpRight, Github, Download, ExternalLink, Menu, X,
  Layers3, Radar, ShieldCheck, Workflow, Terminal, Check, Copy, ArrowLeft,
  ChevronLeft, ChevronRight, ChevronDown, Play, Box, GitBranch, Cpu,
  Globe2, Monitor, Apple, Laptop, HardDriveDownload, ArrowDown,
  Sparkles, Blocks, Code2, GitFork, Heart, Eye, FileClock,
  CircleDot, LockKeyhole, SunMoon, Activity, Network, Zap,
} from 'lucide-vue-next'
import { useSiteLocale, languages, type MessageKey } from './i18n'
import { screenshots, themes, picture, fallbackPicture, REPO, RELEASES, DOCS, SDK, SKINS } from './data'

type PlatformKey = 'mac-arm' | 'mac-intel' | 'windows' | 'linux'
interface Asset { name: string; browser_download_url: string }
interface GithubRelease { tag_name: string; assets: Asset[]; published_at: string }
const { locale, language, t, chooseLocale } = useSiteLocale()
const mobileOpen = ref(false)
const slideIndex = ref(0)
const slide = computed(() => screenshots[slideIndex.value]!)
const release = ref<GithubRelease | null>(null)
const stars = ref<number | null>(null)
const platform = ref<PlatformKey>('mac-arm')
const lightbox = ref<{ src: string; title: string } | null>(null)
const faqOpen = ref<number | null>(0)
const copyState = ref(false)
const reducedMotion = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

const nav: { id: string; title: MessageKey }[] = [
  { id: 'features', title: 'nav.features' },
  { id: 'showcase', title: 'nav.showcase' },
  { id: 'themes', title: 'nav.themes' },
  { id: 'downloads', title: 'nav.downloads' },
]
const platforms: { key: PlatformKey; name: string; sub: string }[] = [
  { key: 'mac-arm', name: 'macOS', sub: 'Apple Silicon' },
  { key: 'mac-intel', name: 'macOS', sub: 'Intel' },
  { key: 'windows', name: 'Windows', sub: 'x64' },
  { key: 'linux', name: 'Linux', sub: 'x64' },
]
const platformName = computed(() => {
  const p = platforms.find(p => p.key === platform.value)
  return p ? `${p.name} · ${p.sub}` : 'macOS · Apple Silicon'
})
function assetFor(key: PlatformKey) {
  const entries = release.value?.assets ?? []
  const allowed = entries.filter(a => !/nomascot|blockmap|\.sig$|checksum/i.test(a.name))
  if (key === 'mac-arm') return allowed.find(a => /arm64\.dmg$/i.test(a.name))
  if (key === 'mac-intel') return allowed.find(a => /\.dmg$/i.test(a.name) && !/arm64/i.test(a.name))
  if (key === 'windows') return allowed.find(a => /Setup.*\.exe$/i.test(a.name))
  return allowed.find(a => /\.AppImage$/i.test(a.name))
}
const selectedAsset = computed(() => assetFor(platform.value))
const downloadUrl = computed(() => selectedAsset.value?.browser_download_url ?? RELEASES)
const releaseLabel = computed(() => release.value?.tag_name ?? t('release.latest'))
const displayStars = computed(() => stars.value === null ? '—' : new Intl.NumberFormat(locale.value, { notation: stars.value >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(stars.value))
const faqs = [0, 1, 2, 3].map(index => ({
  question: `faq.${index}.question` as MessageKey,
  answer: `faq.${index}.answer` as MessageKey,
}))

function nextSlide(delta: number) { slideIndex.value = (slideIndex.value + delta + screenshots.length) % screenshots.length }
function jumpSlide(index: number) { slideIndex.value = index }
function openImage(src: string, title: string) { lightbox.value = { src, title }; document.body.style.overflow = 'hidden' }
function closeImage() { lightbox.value = null; document.body.style.overflow = '' }
function imageError(event: Event, item: { file: string }) {
  const img = event.target as HTMLImageElement
  const fallback = fallbackPicture(item)
  if (!img.dataset.retried && img.src !== fallback) {
    img.dataset.retried = 'true'
    img.src = fallback
  } else { img.classList.add('img-unavailable'); img.setAttribute('alt', t('image.unavailable')) }
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && lightbox.value) closeImage()
  if (event.key === 'Escape') mobileOpen.value = false
  if (!lightbox.value && event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return
  if (lightbox.value) return
  if (event.key === 'ArrowLeft' && document.activeElement?.closest('.preview-section')) nextSlide(-1)
  if (event.key === 'ArrowRight' && document.activeElement?.closest('.preview-section')) nextSlide(1)
}
async function copyClone() {
  try {
    await navigator.clipboard.writeText('git clone https://github.com/wangmiaozero/pi-harness.git')
    copyState.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => copyState.value = false, 2100)
  } catch { window.prompt(t('copy.command'), 'git clone https://github.com/wangmiaozero/pi-harness.git') }
}

function selectPlatform(next: PlatformKey) { platform.value = next }
function jumpTo(id: string) { mobileOpen.value = false; document.querySelector(`#${id}`)?.scrollIntoView({ behavior: reducedMotion.value ? 'auto' : 'smooth' }) }
function iconForPlatform(key: PlatformKey) { return key === 'mac-arm' || key === 'mac-intel' ? Apple : key === 'windows' ? Monitor : Terminal }
onMounted(() => {
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.addEventListener('keydown', onKey)
  if (/Win/i.test(navigator.userAgent)) platform.value = 'windows'
  else if (/Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent)) platform.value = 'linux'
  Promise.allSettled([
    fetch('https://api.github.com/repos/wangmiaozero/pi-harness/releases/latest', { headers: { Accept: 'application/vnd.github+json' } }).then(r => { if (!r.ok) throw new Error('release unavailable'); return r.json() }).then((d: GithubRelease) => { release.value = d }),
    fetch('https://api.github.com/repos/wangmiaozero/pi-harness', { headers: { Accept: 'application/vnd.github+json' } }).then(r => { if (!r.ok) throw new Error('stats unavailable'); return r.json() }).then((d: { stargazers_count: number }) => { stars.value = d.stargazers_count }),
  ]).catch(() => {/* graceful fallback */})
})
onUnmounted(() => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; if (copyTimer) clearTimeout(copyTimer) })
</script>

<template>
  <div class="site-shell" :style="{ '--image-fallback': JSON.stringify(t('images.source')) }">
    <div class="site-noise" aria-hidden="true"></div>
    <header class="top-header">
      <div class="nav-container">
        <a href="#top" class="brand" :aria-label="t('brand.home')" @click.prevent="jumpTo('top')">
          <span class="brand-mark"><span>π</span><i></i></span>
          <span class="brand-name">pi<span>·</span>harness</span>
          <span class="brand-beta">{{ t('brand.openSource') }}</span>
        </a>
        <nav class="nav-links" :aria-label="t('nav.main')">
          <a v-for="item in nav" :key="item.id" :href="`#${item.id}`" @click.prevent="jumpTo(item.id)">{{ t(item.title) }}</a>
          <a :href="SDK" target="_blank" rel="noopener noreferrer">{{ t('nav.docs') }} <ArrowUpRight :size="13" /></a>
        </nav>
        <div class="nav-actions">
          <label class="locale-picker"><Globe2 :size="16" aria-hidden="true" /><select :value="language" @change="chooseLocale(($event.target as HTMLSelectElement).value)" :aria-label="t('language.label')"><option value="auto">{{ t('language.auto') }}</option><option v-for="item in languages" :key="item.code" :value="item.code" :lang="item.code">{{ item.label }}</option></select><ChevronDown :size="12" aria-hidden="true" /></label>
          <a class="nav-gh" :href="REPO" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github :size="19" /></a>
          <a class="nav-download" href="#downloads" @click.prevent="jumpTo('downloads')">{{ t('nav.getApp') }} <ArrowUpRight :size="16" /></a>
          <button class="mobile-menu-toggle" @click="mobileOpen = !mobileOpen" :aria-label="t('nav.toggle')"><X v-if="mobileOpen" :size="22" /><Menu v-else :size="22" /></button>
        </div>
      </div>
      <nav v-if="mobileOpen" class="mobile-nav" :aria-label="t('nav.mobile')">
        <a v-for="item in nav" :key="item.id" :href="`#${item.id}`" @click.prevent="jumpTo(item.id)">{{ t(item.title) }}</a>
        <a :href="SDK" target="_blank" rel="noopener noreferrer">{{ t('nav.documentation') }}</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-glow hero-glow-one" aria-hidden="true"></div>
        <div class="hero-glow hero-glow-two" aria-hidden="true"></div>
        <div class="hero-grid container">
          <div class="hero-content">
            <div class="eyebrow"><span class="live-ping"></span>{{ t('hero.eyebrow') }}<ArrowUpRight :size="12" /></div>
            <h1 id="hero-title"><span class="title-top">{{ t('hero.title1') }}</span><span class="title-gradient">{{ t('hero.title2') }}</span><span class="title-gradient title-emphasis">{{ t('hero.title3') }}</span></h1>
            <p class="hero-description">{{ t('hero.description') }}</p>
            <div class="hero-ctas">
              <a class="button-primary" href="#downloads" @click.prevent="jumpTo('downloads')"><Download :size="18" /> {{ t('hero.download') }} <ArrowRight :size="17" /></a>
              <a class="button-subtle" :href="REPO" target="_blank" rel="noopener noreferrer"><Github :size="18" /> {{ t('hero.github') }} <ArrowUpRight :size="15" /></a>
            </div>
            <div class="hero-proof"><span class="hero-proof-dot"></span><span>{{ t('hero.platforms') }}</span><span class="proof-separator"></span><span>{{ t('hero.bundled') }}</span></div>
          </div>
          <div class="hero-visual">
            <div class="hero-orbit orbit-one" aria-hidden="true"></div><div class="hero-orbit orbit-two" aria-hidden="true"></div>
            <div class="visual-label visual-label-top"><span class="visual-label-dot"></span> {{ t('hero.runtime') }} <span class="visual-status">● {{ t('common.online') }}</span></div>
            <div class="hero-window frame-dark" @click="openImage(picture(screenshots[0]), t(screenshots[0].title))" role="button" tabindex="0" @keydown.enter="openImage(picture(screenshots[0]),t(screenshots[0].title))" :aria-label="t('hero.enlarge')">
              <div class="window-toolbar"><span class="traffic-lights"><i></i><i></i><i></i></span><span class="window-title"><span class="window-mini-logo">π</span> pi-harness / workspace</span><span class="toolbar-right"><CircleDot :size="11" /> {{ t('hero.native') }}</span></div>
              <img :src="picture(screenshots[0])" :alt="t(screenshots[0].title)" fetchpriority="high" @error="imageError($event,screenshots[0])" />
            </div>
            <div class="floating-chip chip-run"><Activity :size="16"/><span><strong>{{ t('hero.observable') }}</strong><small>{{ t('hero.traceReplay') }}</small></span><span class="chip-pulse"></span></div>
            <div class="floating-chip chip-agent"><Network :size="16"/><span><strong>{{ t('hero.multiAgent') }}</strong><small>{{ t('hero.taskDag') }}</small></span></div>
            <div class="visual-bottom-label"><span>01</span><span class="visual-rule"></span><span>{{ t('hero.builtOn') }}</span></div>
          </div>
        </div>
        <div class="hero-base container">
          <div class="base-title"><span class="tiny-line"></span>{{ t('hero.why') }}</div>
          <div class="base-highlights"><span><Check :size="15"/> {{ t('hero.native') }}</span><span><Check :size="15"/> {{ t('hero.local') }}</span><span><Check :size="15"/> {{ t('hero.open') }}</span></div>
        </div>
      </section>

      <section class="metric-band" :aria-label="t('metrics.overview')">
        <div class="container metrics-inner">
          <div class="metric"><span class="metric-icon"><Github :size="17"/></span><div><strong>{{ displayStars }}</strong><span>GitHub Stars <span class="metric-live">↗</span></span></div></div>
          <div class="metric"><span class="metric-icon"><Monitor :size="17"/></span><div><strong>03</strong><span>{{ t('metrics.platforms') }}</span></div></div>
          <div class="metric"><span class="metric-icon"><Globe2 :size="17"/></span><div><strong>{{ String(languages.length).padStart(2, '0') }}</strong><span>{{ t('metrics.languages') }}</span></div></div>
          <div class="metric"><span class="metric-icon"><Zap :size="17"/></span><div><strong>100%</strong><span>{{ t('metrics.native') }}</span></div></div>
        </div>
      </section>

      <section id="features" class="section features-section container">
        <div class="section-heading"><div><p class="section-kicker"><span>01</span> / {{ t('philosophy.kicker') }}</p><h2>{{ t('philosophy.title1') }}<br/><span class="heading-muted">{{ t('philosophy.title2') }}</span></h2></div><p class="section-lead">{{ t('philosophy.description') }}</p></div>
        <div class="pillar-grid">
          <article class="pillar-card pillar-observe"><div class="pillar-head"><span class="pillar-number">01 / {{ t('common.observe') }}</span><div class="pillar-icon"><Radar :size="24" :stroke-width="1.6"/></div></div><div class="pillar-art art-observe"><div class="art-scan"></div><span class="art-line line-1"></span><span class="art-line line-2"></span><span class="art-line line-3"></span><span class="art-line line-4"></span><span class="art-pulse p1"></span><span class="art-pulse p2"></span><span class="art-text">{{ t('common.run') }} #0842 <b>● {{ t('common.active') }}</b></span></div><div class="pillar-copy"><h3>{{ t('philosophy.observe') }}</h3><p>{{ t('philosophy.observeDescription') }}</p><div class="pillar-tags"><span>{{ t('common.trace') }}</span><span>{{ t('common.replay') }}</span><span>{{ t('common.evaluation') }}</span></div></div></article>
          <article class="pillar-card pillar-control"><div class="pillar-head"><span class="pillar-number">02 / {{ t('common.control') }}</span><div class="pillar-icon"><ShieldCheck :size="24" :stroke-width="1.6"/></div></div><div class="pillar-art art-control"><div class="control-ring ring-out"></div><div class="control-ring ring-in"></div><ShieldCheck class="control-center" :size="57" :stroke-width="1.15"/><span class="control-indicator c1"></span><span class="control-indicator c2"></span><span class="control-indicator c3"></span></div><div class="pillar-copy"><h3>{{ t('philosophy.control') }}</h3><p>{{ t('philosophy.controlDescription') }}</p><div class="pillar-tags"><span>{{ t('common.policy') }}</span><span>{{ t('common.budget') }}</span><span>{{ t('common.recovery') }}</span></div></div></article>
          <article class="pillar-card pillar-orchestrate"><div class="pillar-head"><span class="pillar-number">03 / {{ t('common.orchestrate') }}</span><div class="pillar-icon"><Workflow :size="24" :stroke-width="1.6"/></div></div><div class="pillar-art art-agents"><div class="agent-node agent-master"><Cpu :size="19"/></div><span class="agent-connector connector-a"></span><span class="agent-connector connector-b"></span><span class="agent-connector connector-c"></span><div class="agent-node agent-one"><Code2 :size="17"/></div><div class="agent-node agent-two"><GitBranch :size="17"/></div><div class="agent-node agent-three"><ShieldCheck :size="17"/></div></div><div class="pillar-copy"><h3>{{ t('philosophy.orchestrate') }}</h3><p>{{ t('philosophy.orchestrateDescription') }}</p><div class="pillar-tags"><span>{{ t('hero.multiAgent') }}</span><span>{{ t('hero.taskDag') }}</span></div></div></article>
        </div>
      </section>

      <section id="showcase" class="section preview-section">
        <div class="container">
          <div class="section-heading preview-heading"><div><p class="section-kicker"><span>02</span> / {{ t('showcase.kicker') }}</p><h2>{{ t('showcase.title1') }}<br/><span class="heading-muted">{{ t('showcase.title2') }}</span></h2></div><p class="section-lead">{{ t('showcase.description') }}</p></div>
          <div class="showcase-layout">
            <div class="showcase-main"><div class="showcase-glow" aria-hidden="true"></div><div class="preview-window frame-dark"><div class="window-toolbar"><span class="traffic-lights"><i></i><i></i><i></i></span><span class="window-title">{{ slide.label }} / {{ t(slide.category) }} <span class="preview-filename">/ pi-harness</span></span><button class="maximize" :aria-label="t('showcase.enlarge')" @click="openImage(picture(slide),t(slide.title))"><ExternalLink :size="14"/></button></div><button class="screenshot-button" @click="openImage(picture(slide),t(slide.title))" :aria-label="t('showcase.enlargeLabel')"><img :key="slide.key" :src="picture(slide)" :alt="t(slide.title)" loading="lazy" @error="imageError($event,slide)" /></button></div></div>
            <div class="showcase-sidebar"><div class="showcase-topline"><span>{{ slide.label }} / {{ t(slide.category) }}</span><div class="showcase-arrows"><button @click="nextSlide(-1)" :aria-label="t('common.previous')"><ChevronLeft :size="18"/></button><button @click="nextSlide(1)" :aria-label="t('common.next')"><ChevronRight :size="18"/></button></div></div><h3>{{ t(slide.title) }}</h3><p>{{ t(slide.description) }}</p><div class="showcase-divider"></div><div class="showcase-index"><span>{{ String(slideIndex+1).padStart(2,'0') }}</span><div class="index-line"><div :style="{width:`${((slideIndex+1)/screenshots.length)*100}%`}"></div></div><span>{{ String(screenshots.length).padStart(2,'0') }}</span></div><div class="showcase-tabs"><button v-for="(item,index) in screenshots" :key="item.key" :class="{active:slideIndex===index}" @click="jumpSlide(index)"><span>{{ String(index+1).padStart(2,'0') }}</span><span>{{ t(item.title) }}</span><ArrowUpRight :size="14"/></button></div><a :href="`${DOCS}`" class="showcase-link" target="_blank" rel="noopener noreferrer">{{ t('showcase.browse') }} <ArrowUpRight :size="15"/></a></div>
          </div>
        </div>
      </section>

      <section class="section capability-section container">
        <div class="section-heading"><div><p class="section-kicker"><span>03</span> / {{ t('capabilities.kicker') }}</p><h2>{{ t('capabilities.title1') }}<br/><span class="heading-muted">{{ t('capabilities.title2') }}</span></h2></div><p class="section-lead">{{ t('capabilities.description') }}</p></div>
        <div class="capability-grid">
          <article><div class="cap-icon"><Layers3 :size="22"/></div><h3>{{ t('capabilities.native') }}</h3><p>{{ t('capabilities.nativeDescription') }}</p><span>01 — {{ t('capabilities.runtime') }}</span></article>
          <article><div class="cap-icon"><GitFork :size="22"/></div><h3>{{ t('capabilities.git') }}</h3><p>{{ t('capabilities.gitDescription') }}</p><span>02 — {{ t('capabilities.development') }}</span></article>
          <article><div class="cap-icon"><FileClock :size="22"/></div><h3>{{ t('capabilities.history') }}</h3><p>{{ t('capabilities.historyDescription') }}</p><span>03 — {{ t('capabilities.continuity') }}</span></article>
          <article><div class="cap-icon"><Network :size="22"/></div><h3>{{ t('capabilities.architecture') }}</h3><p>{{ t('capabilities.architectureDescription') }}</p><span>04 — {{ t('capabilities.intelligence') }}</span></article>
          <article><div class="cap-icon"><Blocks :size="22"/></div><h3>{{ t('capabilities.plugins') }}</h3><p>{{ t('capabilities.pluginsDescription') }}</p><span>05 — {{ t('capabilities.ecosystem') }}</span></article>
          <article><div class="cap-icon"><LockKeyhole :size="22"/></div><h3>{{ t('capabilities.governance') }}</h3><p>{{ t('capabilities.governanceDescription') }}</p><span>06 — {{ t('capabilities.governanceTag') }}</span></article>
        </div>
      </section>

      <section id="themes" class="section theme-section"><div class="container"><div class="section-heading"><div><p class="section-kicker"><span>04</span> / {{ t('themes.kicker') }}</p><h2>{{ t('themes.title1') }}<br/><span class="heading-muted">{{ t('themes.title2') }}</span></h2></div><div class="section-lead theme-lead"><p>{{ t('themes.description') }}</p><a :href="SKINS" target="_blank" rel="noopener noreferrer">{{ t('themes.create') }} <ArrowUpRight :size="15"/></a></div></div>
        <div class="theme-grid"><button v-for="(item,index) in themes" :key="item.key" class="theme-card" @click="openImage(picture(item),t(item.title))"><div class="theme-photo"><img :src="picture(item)" :alt="t(item.title)" loading="lazy" @error="imageError($event,item)" /><div class="theme-photo-overlay"></div><span class="theme-card-tag">{{ t(index===0?'themes.ming':index===1?'themes.starship':'themes.macos') }}</span><span class="theme-zoom"><ArrowUpRight :size="20"/></span></div><div class="theme-info"><div><h3>{{ t(item.title) }}</h3><p>{{ t(item.description) }}</p></div><span>{{ String(index+1).padStart(2,'0') }}</span></div></button></div>
        <div class="theme-footnote"><SunMoon :size="17"/><span>{{ t('themes.footnote') }}</span><a :href="DOCS" target="_blank" rel="noopener noreferrer">{{ t('themes.sources') }} <ArrowUpRight :size="13"/></a></div>
      </div></section>

      <section class="section architecture-section container"><div class="architecture-panel"><div class="architecture-copy"><p class="section-kicker"><span>05</span> / {{ t('architecture.kicker') }}</p><h2>{{ t('architecture.title1') }}<br/><span>{{ t('architecture.title2') }}</span></h2><p>{{ t('architecture.description') }}</p><a :href="`${REPO}#architecture`" target="_blank" rel="noopener noreferrer">{{ t('architecture.explore') }} <ArrowUpRight :size="15"/></a></div><div class="architecture-diagram" :aria-label="t('architecture.label')"><div class="diagram-row diagram-front"><span class="diagram-icon">π</span><div><strong>{{ t('architecture.desktop') }}</strong><small>{{ t('architecture.workspace') }}</small></div></div><div class="diagram-link"><span></span><span>{{ t('architecture.controlPlane') }}</span><span></span></div><div class="diagram-row diagram-harness"><div class="diagram-box"><Eye :size="15"/><span>{{ t('common.observe') }}</span></div><div class="diagram-box"><ShieldCheck :size="15"/><span>{{ t('common.control') }}</span></div><div class="diagram-box"><Workflow :size="15"/><span>{{ t('common.orchestrate') }}</span></div></div><div class="diagram-link"><span></span><span>{{ t('architecture.engine') }}</span><span></span></div><div class="diagram-row diagram-runtime"><Terminal :size="20"/><strong>Pi Coding Agent</strong><span class="runtime-live">● {{ t('common.active') }}</span></div><div class="diagram-bottom"><span>{{ t('common.skills') }}</span><span>MCP</span><span>{{ t('common.extensions') }}</span><span>{{ t('common.providers') }}</span></div></div></div></section>

      <section id="downloads" class="section download-section"><div class="container"><div class="download-container"><div class="download-head"><p class="section-kicker"><span>06</span> / {{ t('download.kicker') }}</p><h2>{{ t('download.title1') }}<br/><span>{{ t('download.title2') }}</span></h2><p>{{ t('download.description') }}</p><div class="release-inline"><span class="release-dot"></span><span>{{ releaseLabel }}</span><span class="release-split">/</span><span>macOS · Windows · Linux</span></div></div><div class="download-card"><div class="download-card-top"><span>{{ t('download.choose') }}</span><span class="free-label"><span class="free-dot"></span>{{ t('download.free') }}</span></div><div class="platform-picker"><button v-for="p in platforms" :key="p.key" :class="['platform-option',{selected:platform===p.key}]" @click="selectPlatform(p.key)"><component :is="iconForPlatform(p.key)" :size="21"/><span><strong>{{ p.name }}</strong><small>{{ p.sub }}</small></span><Check v-if="platform===p.key" class="platform-check" :size="16"/></button></div><a class="download-action" :href="downloadUrl" target="_blank" rel="noopener noreferrer"><HardDriveDownload :size="19"/><span>{{ selectedAsset ? t('download.for') + ' ' + platformName : t('download.releases') }}</span><ArrowUpRight :size="18"/></a><div class="download-filename"><span>{{ selectedAsset?.name || t('download.installer') }}</span></div><div class="download-links"><a :href="RELEASES" target="_blank" rel="noopener noreferrer">{{ t('download.all') }} <ArrowUpRight :size="14"/></a><a :href="`${REPO}/blob/main/docs/release/community-release.md`" target="_blank" rel="noopener noreferrer">{{ t('download.notes') }} <ArrowUpRight :size="14"/></a></div><p class="download-caveat">{{ t('download.caveat') }}</p></div></div></div></section>

      <section class="section community-section container"><div class="community-intro"><div><p class="section-kicker"><span>07</span> / {{ t('community.kicker') }}</p><h2>{{ t('community.title1') }}<br/><span class="heading-muted">{{ t('community.title2') }}</span></h2></div><p>{{ t('community.description') }}</p></div><div class="community-grid"><a :href="REPO" target="_blank" rel="noopener noreferrer" class="community-tile"><Github :size="24"/><span><strong>{{ t('community.repository') }}</strong><small>{{ t('community.source') }}</small></span><ArrowUpRight :size="21"/></a><a :href="SDK" target="_blank" rel="noopener noreferrer" class="community-tile"><Blocks :size="24"/><span><strong>Harness Plugin SDK</strong><small>{{ t('community.plugins') }}</small></span><ArrowUpRight :size="21"/></a><a :href="SKINS" target="_blank" rel="noopener noreferrer" class="community-tile"><Sparkles :size="24"/><span><strong>Skin Starter</strong><small>{{ t('community.skins') }}</small></span><ArrowUpRight :size="21"/></a></div>
      <div class="faq-wrap"><div class="faq-side"><p class="section-kicker">FAQ / {{ t('faq.kicker') }}</p><h3>{{ t('faq.title') }}</h3><p>{{ t('faq.description') }}</p></div><div class="faq-list"><div v-for="(faq,index) in faqs" :key="index" :class="['faq-item',{open:faqOpen===index}]"><button @click="faqOpen=faqOpen===index?null:index" :aria-expanded="faqOpen===index"><span>{{ t(faq.question) }}</span><ChevronDown :size="18"/></button><p v-if="faqOpen===index">{{ t(faq.answer) }}</p></div></div></div></section>

      <section class="final-cta"><div class="container final-inner"><div class="final-orb" aria-hidden="true"></div><div class="final-kicker"><span class="live-ping"></span>{{ t('final.kicker') }}</div><h2>{{ t('final.title1') }}<br/><em>{{ t('final.title2') }}</em></h2><div class="final-actions"><a class="button-primary" href="#downloads" @click.prevent="jumpTo('downloads')"><Download :size="18"/> {{ t('final.download') }} <ArrowRight :size="17"/></a><button class="button-subtle" @click="copyClone"><Check v-if="copyState" :size="17"/><Copy v-else :size="17"/> {{ copyState ? t('copy.done') : 'git clone ...' }}</button></div></div></section>
    </main>

    <footer class="site-footer"><div class="container footer-main"><div class="footer-about"><a href="#top" class="brand footer-brand" @click.prevent="jumpTo('top')"><span class="brand-mark"><span>π</span><i></i></span><span class="brand-name">pi<span>·</span>harness</span></a><p>{{ t('footer.tagline') }}</p><small>{{ t('footer.madeFor') }}</small></div><div class="footer-column"><strong>{{ t('footer.product') }}</strong><a href="#features" @click.prevent="jumpTo('features')">{{ t('nav.features') }}</a><a href="#showcase" @click.prevent="jumpTo('showcase')">{{ t('nav.screenshots') }}</a><a href="#themes" @click.prevent="jumpTo('themes')">{{ t('nav.themes') }}</a><a href="#downloads" @click.prevent="jumpTo('downloads')">{{ t('nav.download') }}</a></div><div class="footer-column"><strong>{{ t('footer.developers') }}</strong><a :href="REPO" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight :size="12"/></a><a :href="SDK" target="_blank" rel="noopener noreferrer">Plugin SDK <ArrowUpRight :size="12"/></a><a :href="`${REPO}/blob/main/CHANGELOG.md`" target="_blank" rel="noopener noreferrer">{{ t('footer.changelog') }} <ArrowUpRight :size="12"/></a><a :href="SKINS" target="_blank" rel="noopener noreferrer">Skin Starter <ArrowUpRight :size="12"/></a></div><div class="footer-column"><strong>{{ t('footer.community') }}</strong><a :href="`${REPO}/issues`" target="_blank" rel="noopener noreferrer">{{ t('footer.issues') }} <ArrowUpRight :size="12"/></a><a :href="`${REPO}/pulls`" target="_blank" rel="noopener noreferrer">{{ t('footer.pulls') }} <ArrowUpRight :size="12"/></a><a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">AGPL-3.0 <ArrowUpRight :size="12"/></a></div></div><div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} Pi-Harness · {{ t('footer.project') }}</span><span>{{ t('footer.independent') }}</span><a href="#top" @click.prevent="jumpTo('top')">{{ t('footer.top') }} ↑</a></div></footer>

    <div v-if="lightbox" class="lightbox" role="dialog" aria-modal="true" :aria-label="lightbox.title" @click.self="closeImage"><div class="lightbox-bar"><span>{{ lightbox.title }}</span><button @click="closeImage" :aria-label="t('image.close')"><X :size="22"/></button></div><img :src="lightbox.src" :alt="lightbox.title" /></div>
  </div>
</template>
