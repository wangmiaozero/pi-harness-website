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
import { screenshots, themes, picture, fallbackPicture, REPO, RELEASES, DOCS, SDK, SKINS } from './data'

type Locale = 'zh' | 'en'
type PlatformKey = 'mac-arm' | 'mac-intel' | 'windows' | 'linux'
interface Asset { name: string; browser_download_url: string }
interface GithubRelease { tag_name: string; assets: Asset[]; published_at: string }
const locale = ref<Locale>('zh')
const zh = computed(() => locale.value === 'zh')
const tx = (cn: string, en: string) => zh.value ? cn : en
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

const nav = [
  { id: 'features', zh: '核心能力', en: 'Features' },
  { id: 'showcase', zh: '产品预览', en: 'Showcase' },
  { id: 'themes', zh: '主题美学', en: 'Themes' },
  { id: 'downloads', zh: '下载安装', en: 'Download' },
]
const platforms: { key: PlatformKey; zh: string; en: string; sub: string }[] = [
  { key: 'mac-arm', zh: 'macOS', en: 'macOS', sub: 'Apple Silicon' },
  { key: 'mac-intel', zh: 'macOS', en: 'macOS', sub: 'Intel' },
  { key: 'windows', zh: 'Windows', en: 'Windows', sub: 'x64' },
  { key: 'linux', zh: 'Linux', en: 'Linux', sub: 'x64' },
]
const platformName = computed(() => {
  const p = platforms.find(p => p.key === platform.value)
  return p ? `${zh.value ? p.zh : p.en} · ${p.sub}` : 'macOS · Apple Silicon'
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
const releaseLabel = computed(() => release.value?.tag_name ?? tx('最新正式版', 'Latest release'))
const displayStars = computed(() => stars.value === null ? '—' : new Intl.NumberFormat('en-US', { notation: stars.value >= 1000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(stars.value))
const faqs = [
  { zh: '安装 Pi-Harness 之前需要安装 Node.js 或 Pi 吗？', en: 'Do I need to install Node.js or Pi first?', azh: '不需要。社区发行版内置 Pi 和 Node.js / npm / npx，安装后即可配置模型并开始使用。开发官网源码本身需要 Node.js。', aen: 'No. Community desktop builds bundle Pi and Node.js / npm / npx. Set up your model provider and start. Building this website from source separately requires Node.js.' },
  { zh: '它会替代 Pi Coding Agent 吗？', en: 'Does it replace Pi Coding Agent?', azh: '不会。原生 Pi 仍是唯一默认 Agent 执行引擎；Pi-Harness 在其上提供可视化工作区、运行治理、恢复与多 Agent 编排。', aen: 'No. Native Pi remains the default agent execution engine. Pi-Harness adds a visual workspace, operational controls, recovery and orchestration around it.' },
  { zh: 'Harness Plugins 和 Pi Extensions 有什么区别？', en: 'What is the difference between Harness Plugins and Pi Extensions?', azh: 'Pi Extensions 扩展 Agent 的原生行为；Harness Plugins 扩展 Pi-Harness 的运行观察、评估、导出和 Agent Team 模板能力。插件 SDK 已在仓库 main 分支开发，具体功能是否包含在安装包中以对应 Release 为准。', aen: 'Pi Extensions extend native agent behavior; Harness Plugins extend run observation, evaluation, export and team templates. The SDK is in the repository main branch; check each release for packaged availability.' },
  { zh: 'macOS 或 Windows 提示不受信任怎么办？', en: 'Why do macOS or Windows show security warnings?', azh: '社区安装包可能没有 Apple Developer ID 公证或 Windows 代码签名。请仅从官方 GitHub Releases 下载，核对校验信息，并按照系统官方安全提示处理。不要关闭系统安全保护。', aen: 'Community installers may lack Apple Developer ID notarization or Windows code signing. Download only from official GitHub Releases, verify the checksums and follow OS-provided security prompts. Do not disable security protections.' },
]

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
  } else { img.classList.add('img-unavailable'); img.setAttribute('alt', tx('图片未能加载，请访问仓库截图索引', 'Image unavailable — view screenshots in repo')) }
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && lightbox.value) closeImage()
  if (event.key === 'Escape') mobileOpen.value = false
  if (!lightbox.value && event.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return
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
  } catch { window.prompt(tx('复制 Git 命令', 'Copy Git command'), 'git clone https://github.com/wangmiaozero/pi-harness.git') }
}
function chooseLocale(next: Locale) {
  locale.value = next
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
  window.localStorage.setItem('pi-harness-site-locale', next)
}
function selectPlatform(next: PlatformKey) { platform.value = next }
function jumpTo(id: string) { mobileOpen.value = false; document.querySelector(`#${id}`)?.scrollIntoView({ behavior: reducedMotion.value ? 'auto' : 'smooth' }) }
function iconForPlatform(key: PlatformKey) { return key === 'mac-arm' || key === 'mac-intel' ? Apple : key === 'windows' ? Monitor : Terminal }
onMounted(() => {
  try { const saved = window.localStorage.getItem('pi-harness-site-locale'); if (saved === 'zh' || saved === 'en') chooseLocale(saved) } catch { /* privacy mode */ }
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
  <div class="site-shell">
    <div class="site-noise" aria-hidden="true"></div>
    <header class="top-header">
      <div class="nav-container">
        <a href="#top" class="brand" aria-label="Pi-Harness homepage" @click.prevent="jumpTo('top')">
          <span class="brand-mark"><span>π</span><i></i></span>
          <span class="brand-name">pi<span>·</span>harness</span>
          <span class="brand-beta">OPEN SOURCE</span>
        </a>
        <nav class="nav-links" :aria-label="tx('主导航', 'Main navigation')">
          <a v-for="item in nav" :key="item.id" :href="`#${item.id}`" @click.prevent="jumpTo(item.id)">{{ tx(item.zh,item.en) }}</a>
          <a :href="SDK" target="_blank" rel="noopener noreferrer">{{ tx('开发文档', 'Docs') }} <ArrowUpRight :size="13" /></a>
        </nav>
        <div class="nav-actions">
          <button class="locale-button" @click="chooseLocale(zh ? 'en' : 'zh')" :aria-label="tx('Switch to English', '切换中文')"><Globe2 :size="16" /> <span>{{ zh ? 'EN' : '中' }}</span></button>
          <a class="nav-gh" :href="REPO" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github :size="19" /></a>
          <a class="nav-download" href="#downloads" @click.prevent="jumpTo('downloads')">{{ tx('免费下载', 'Get the app') }} <ArrowUpRight :size="16" /></a>
          <button class="mobile-menu-toggle" @click="mobileOpen = !mobileOpen" :aria-label="tx('切换导航', 'Toggle menu')"><X v-if="mobileOpen" :size="22" /><Menu v-else :size="22" /></button>
        </div>
      </div>
      <nav v-if="mobileOpen" class="mobile-nav" :aria-label="tx('移动端导航', 'Mobile navigation')">
        <a v-for="item in nav" :key="item.id" :href="`#${item.id}`" @click.prevent="jumpTo(item.id)">{{ tx(item.zh,item.en) }}</a>
        <a :href="SDK" target="_blank" rel="noopener noreferrer">{{ tx('开发文档', 'Documentation') }}</a>
      </nav>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-glow hero-glow-one" aria-hidden="true"></div>
        <div class="hero-glow hero-glow-two" aria-hidden="true"></div>
        <div class="hero-grid container">
          <div class="hero-content">
            <div class="eyebrow"><span class="live-ping"></span>{{ tx('原生 Pi · 面向真正的工程实践', 'NATIVE PI · BUILT FOR REAL ENGINEERING') }}<ArrowUpRight :size="12" /></div>
            <h1 id="hero-title"><span class="title-top">{{ tx('不止是对话。', 'Beyond the chat.') }}</span><span class="title-gradient">{{ tx('让 Agent 真正', 'Take control of') }}</span><span class="title-gradient title-emphasis">{{ tx('尽在掌控。', 'every agent run.') }}</span></h1>
            <p class="hero-description">{{ tx('以原生 Pi Coding Agent 为引擎，将运行轨迹、权限治理、断点恢复与多 Agent 协作，汇聚成一个强大的桌面工作台。','A native Pi Coding Agent workspace for observing runs, governing actions, recovering work, and orchestrating agent teams.') }}</p>
            <div class="hero-ctas">
              <a class="button-primary" href="#downloads" @click.prevent="jumpTo('downloads')"><Download :size="18" /> {{ tx('免费获取 Pi-Harness', 'Download Pi-Harness') }} <ArrowRight :size="17" /></a>
              <a class="button-subtle" :href="REPO" target="_blank" rel="noopener noreferrer"><Github :size="18" /> {{ tx('查看 GitHub', 'View on GitHub') }} <ArrowUpRight :size="15" /></a>
            </div>
            <div class="hero-proof"><span class="hero-proof-dot"></span><span>{{ tx('macOS · Windows · Linux', 'macOS · Windows · Linux') }}</span><span class="proof-separator"></span><span>{{ tx('内置 Pi + Node.js', 'Pi + Node.js bundled') }}</span></div>
          </div>
          <div class="hero-visual">
            <div class="hero-orbit orbit-one" aria-hidden="true"></div><div class="hero-orbit orbit-two" aria-hidden="true"></div>
            <div class="visual-label visual-label-top"><span class="visual-label-dot"></span> PI RUNTIME <span class="visual-status">● ONLINE</span></div>
            <div class="hero-window frame-dark" @click="openImage(picture(screenshots[0]), tx(screenshots[0].zh,screenshots[0].en))" role="button" tabindex="0" @keydown.enter="openImage(picture(screenshots[0]),tx(screenshots[0].zh,screenshots[0].en))" :aria-label="tx('放大查看工作区截图', 'Enlarge workspace screenshot')">
              <div class="window-toolbar"><span class="traffic-lights"><i></i><i></i><i></i></span><span class="window-title"><span class="window-mini-logo">π</span> pi-harness / workspace</span><span class="toolbar-right"><CircleDot :size="11" /> NATIVE PI</span></div>
              <img :src="picture(screenshots[0])" alt="Pi-Harness Workspace — screenshot from official GitHub docs" fetchpriority="high" @error="imageError($event,screenshots[0])" />
            </div>
            <div class="floating-chip chip-run"><Activity :size="16"/><span><strong>{{ tx('运行可观测', 'Run observable') }}</strong><small>Trace / Replay</small></span><span class="chip-pulse"></span></div>
            <div class="floating-chip chip-agent"><Network :size="16"/><span><strong>{{ tx('多 Agent 协作', 'Multi-Agent') }}</strong><small>Task DAG / Worktrees</small></span></div>
            <div class="visual-bottom-label"><span>01</span><span class="visual-rule"></span><span>BUILT ON NATIVE PI</span></div>
          </div>
        </div>
        <div class="hero-base container">
          <div class="base-title"><span class="tiny-line"></span>{{ tx('为什么选择 PI-HARNESS', 'WHY PI-HARNESS') }}</div>
          <div class="base-highlights"><span><Check :size="15"/> {{ tx('真正的原生 Pi', 'Native Pi') }}</span><span><Check :size="15"/> {{ tx('默认本地优先', 'Local-first') }}</span><span><Check :size="15"/> {{ tx('开源社区发行', 'Open source') }}</span></div>
        </div>
      </section>

      <section class="metric-band" aria-label="Pi-Harness overview">
        <div class="container metrics-inner">
          <div class="metric"><span class="metric-icon"><Github :size="17"/></span><div><strong>{{ displayStars }}</strong><span>GitHub Stars <span class="metric-live">↗</span></span></div></div>
          <div class="metric"><span class="metric-icon"><Monitor :size="17"/></span><div><strong>03</strong><span>{{ tx('桌面操作系统', 'Desktop platforms') }}</span></div></div>
          <div class="metric"><span class="metric-icon"><Globe2 :size="17"/></span><div><strong>08</strong><span>{{ tx('界面语言', 'UI languages') }}</span></div></div>
          <div class="metric"><span class="metric-icon"><Zap :size="17"/></span><div><strong>100%</strong><span>{{ tx('围绕原生 Pi', 'Built on native Pi') }}</span></div></div>
        </div>
      </section>

      <section id="features" class="section features-section container">
        <div class="section-heading"><div><p class="section-kicker"><span>01</span> / {{ tx('核心理念', 'THE PHILOSOPHY') }}</p><h2>{{ tx('让复杂的 Agent 工作', 'Clarity for every') }}<br/><span class="heading-muted">{{ tx('变得清晰可控。', 'complex agent run.') }}</span></h2></div><p class="section-lead">{{ tx('不重造 Agent 引擎。只把开发者真正需要的运行洞察、控制与协作能力，放在触手可及的位置。','We do not rebuild the agent. We bring operational visibility, control and coordination into one focused desktop.') }}</p></div>
        <div class="pillar-grid">
          <article class="pillar-card pillar-observe"><div class="pillar-head"><span class="pillar-number">01 / OBSERVE</span><div class="pillar-icon"><Radar :size="24" :stroke-width="1.6"/></div></div><div class="pillar-art art-observe"><div class="art-scan"></div><span class="art-line line-1"></span><span class="art-line line-2"></span><span class="art-line line-3"></span><span class="art-line line-4"></span><span class="art-pulse p1"></span><span class="art-pulse p2"></span><span class="art-text">RUN #0842 <b>● ACTIVE</b></span></div><div class="pillar-copy"><h3>{{ tx('看见每一步', 'See what happens.') }}</h3><p>{{ tx('Runs、Trace、Replay、Evaluation。不是猜测 Agent 在做什么，而是有迹可循。','Runs, traces, replay and evaluations. Understand what your agent actually did.') }}</p><div class="pillar-tags"><span>TRACE</span><span>REPLAY</span><span>EVALUATION</span></div></div></article>
          <article class="pillar-card pillar-control"><div class="pillar-head"><span class="pillar-number">02 / CONTROL</span><div class="pillar-icon"><ShieldCheck :size="24" :stroke-width="1.6"/></div></div><div class="pillar-art art-control"><div class="control-ring ring-out"></div><div class="control-ring ring-in"></div><ShieldCheck class="control-center" :size="57" :stroke-width="1.15"/><span class="control-indicator c1"></span><span class="control-indicator c2"></span><span class="control-indicator c3"></span></div><div class="pillar-copy"><h3>{{ tx('掌握控制权', 'Stay in control.') }}</h3><p>{{ tx('工具策略、运行预算、Checkpoints 与恢复。为每一次探索留下退路。','Policies, budgets, checkpoints and recovery. Build guardrails into every workflow.') }}</p><div class="pillar-tags"><span>POLICY</span><span>BUDGET</span><span>RECOVERY</span></div></div></article>
          <article class="pillar-card pillar-orchestrate"><div class="pillar-head"><span class="pillar-number">03 / ORCHESTRATE</span><div class="pillar-icon"><Workflow :size="24" :stroke-width="1.6"/></div></div><div class="pillar-art art-agents"><div class="agent-node agent-master"><Cpu :size="19"/></div><span class="agent-connector connector-a"></span><span class="agent-connector connector-b"></span><span class="agent-connector connector-c"></span><div class="agent-node agent-one"><Code2 :size="17"/></div><div class="agent-node agent-two"><GitBranch :size="17"/></div><div class="agent-node agent-three"><ShieldCheck :size="17"/></div></div><div class="pillar-copy"><h3>{{ tx('协作而非混乱', 'Work as a team.') }}</h3><p>{{ tx('Agent Teams、Task DAG、独立 Worktree 与审查门禁，让协作有序发生。','Agent teams, task DAGs, isolated worktrees and review gates, working together.') }}</p><div class="pillar-tags"><span>MULTI-AGENT</span><span>TASK DAG</span></div></div></article>
        </div>
      </section>

      <section id="showcase" class="section preview-section">
        <div class="container">
          <div class="section-heading preview-heading"><div><p class="section-kicker"><span>02</span> / {{ tx('实机界面', 'PRODUCT IN ACTION') }}</p><h2>{{ tx('一个工作台。', 'Everything connected.') }}<br/><span class="heading-muted">{{ tx('连接所有工作流。', 'Nothing in the way.') }}</span></h2></div><p class="section-lead">{{ tx('所有图片均来自 Pi-Harness GitHub 仓库 docs/ 目录中的真实产品截图。','Every preview is a real product screenshot from the Pi-Harness GitHub docs/ directory.') }}</p></div>
          <div class="showcase-layout">
            <div class="showcase-main"><div class="showcase-glow" aria-hidden="true"></div><div class="preview-window frame-dark"><div class="window-toolbar"><span class="traffic-lights"><i></i><i></i><i></i></span><span class="window-title">{{ slide.label }} <span class="preview-filename">/ pi-harness</span></span><button class="maximize" :aria-label="tx('放大截图', 'Open full screenshot')" @click="openImage(picture(slide),tx(slide.zh,slide.en))"><ExternalLink :size="14"/></button></div><button class="screenshot-button" @click="openImage(picture(slide),tx(slide.zh,slide.en))" :aria-label="tx('点击放大产品截图','Click to enlarge product screenshot')"><img :key="slide.key" :src="picture(slide)" :alt="tx(slide.zh,slide.en)" loading="lazy" @error="imageError($event,slide)" /></button></div></div>
            <div class="showcase-sidebar"><div class="showcase-topline"><span>{{ slide.label }}</span><div class="showcase-arrows"><button @click="nextSlide(-1)" :aria-label="tx('上一张', 'Previous')"><ChevronLeft :size="18"/></button><button @click="nextSlide(1)" :aria-label="tx('下一张', 'Next')"><ChevronRight :size="18"/></button></div></div><h3>{{ tx(slide.zh,slide.en) }}</h3><p>{{ tx(slide.descZh,slide.descEn) }}</p><div class="showcase-divider"></div><div class="showcase-index"><span>{{ String(slideIndex+1).padStart(2,'0') }}</span><div class="index-line"><div :style="{width:`${((slideIndex+1)/screenshots.length)*100}%`}"></div></div><span>{{ String(screenshots.length).padStart(2,'0') }}</span></div><div class="showcase-tabs"><button v-for="(item,index) in screenshots" :key="item.key" :class="{active:slideIndex===index}" @click="jumpSlide(index)"><span>{{ String(index+1).padStart(2,'0') }}</span><span>{{ tx(item.zh,item.en) }}</span><ArrowUpRight :size="14"/></button></div><a :href="`${DOCS}`" class="showcase-link" target="_blank" rel="noopener noreferrer">{{ tx('查看全部官方截图', 'Browse all official screenshots') }} <ArrowUpRight :size="15"/></a></div>
          </div>
        </div>
      </section>

      <section class="section capability-section container">
        <div class="section-heading"><div><p class="section-kicker"><span>03</span> / {{ tx('超越终端', 'BUILT FOR BUILDERS') }}</p><h2>{{ tx('从开始到交付，', 'From first prompt') }}<br/><span class="heading-muted">{{ tx('始终与你并肩。', 'to final commit.') }}</span></h2></div><p class="section-lead">{{ tx('保留 Pi 的原生灵活性，同时让项目管理、运行复盘和工具生态形成闭环。','Keep the flexibility of native Pi while connecting project management, run analysis and a rich tooling ecosystem.') }}</p></div>
        <div class="capability-grid">
          <article><div class="cap-icon"><Layers3 :size="22"/></div><h3>{{ tx('原生 Pi 驱动', 'Native Pi inside') }}</h3><p>{{ tx('Pi 会话、模型、Tools 与原生 Extensions 保持兼容。','Pi sessions, models, tools and native extensions remain compatible.') }}</p><span>01 — RUNTIME</span></article>
          <article><div class="cap-icon"><GitFork :size="22"/></div><h3>{{ tx('Git 与 Worktree', 'Git & worktrees') }}</h3><p>{{ tx('文件浏览、差异对比、版本管理与隔离开发空间。','Review diffs, inspect files and isolate changes in worktrees.') }}</p><span>02 — DEVELOPMENT</span></article>
          <article><div class="cap-icon"><FileClock :size="22"/></div><h3>{{ tx('跨工具会话历史', 'Cross-tool history') }}</h3><p>{{ tx('本地查看多种 Coding Agent 的历史记录，按需移交给 Pi。','Review local history from other coding agents and hand off to Pi when needed.') }}</p><span>03 — CONTINUITY</span></article>
          <article><div class="cap-icon"><Network :size="22"/></div><h3>{{ tx('项目架构地图', 'Architecture maps') }}</h3><p>{{ tx('用本地静态分析帮助理解项目模块及支持的依赖关系。','Explore modules and supported static dependencies using local analysis.') }}</p><span>04 — INTELLIGENCE</span></article>
          <article><div class="cap-icon"><Blocks :size="22"/></div><h3>{{ tx('能力与插件', 'Skills & plugins') }}</h3><p>{{ tx('统一管理 Skills、MCP、Pi Extensions；Harness SDK 也在持续演进。','Manage Skills, MCP and Pi Extensions; the Harness SDK is evolving.') }}</p><span>05 — ECOSYSTEM</span></article>
          <article><div class="cap-icon"><LockKeyhole :size="22"/></div><h3>{{ tx('运行治理', 'Operational governance') }}</h3><p>{{ tx('预算、策略、运行审计与检查点，降低失控风险。','Budgets, policies, run diagnostics and checkpoints for better oversight.') }}</p><span>06 — GOVERNANCE</span></article>
        </div>
      </section>

      <section id="themes" class="section theme-section"><div class="container"><div class="section-heading"><div><p class="section-kicker"><span>04</span> / {{ tx('设计也是生产力', 'A WORKSPACE WITH CHARACTER') }}</p><h2>{{ tx('强大的工具，', 'Engineering meets') }}<br/><span class="heading-muted">{{ tx('也值得拥有美感。', 'personal expression.') }}</span></h2></div><div class="section-lead theme-lead"><p>{{ tx('从大明风雅到星舰驾驶舱，再到 Liquid Ether。工作台也可以有自己的灵魂。','From the Ming collection to a starship cockpit and Liquid Ether, make your workspace feel like yours.') }}</p><a :href="SKINS" target="_blank" rel="noopener noreferrer">{{ tx('创建自己的皮肤', 'Create a custom skin') }} <ArrowUpRight :size="15"/></a></div></div>
        <div class="theme-grid"><button v-for="(item,index) in themes" :key="item.key" class="theme-card" @click="openImage(picture(item),tx(item.zh,item.en))"><div class="theme-photo"><img :src="picture(item)" :alt="tx(item.zh,item.en)" loading="lazy" @error="imageError($event,item)" /><div class="theme-photo-overlay"></div><span class="theme-card-tag">{{ index===0?'MING COLLECTION':index===1?'STARSHIP COCKPIT':'MACOS INSPIRED' }}</span><span class="theme-zoom"><ArrowUpRight :size="20"/></span></div><div class="theme-info"><div><h3>{{ tx(item.zh,item.en) }}</h3><p>{{ tx(item.descZh,item.descEn) }}</p></div><span>{{ String(index+1).padStart(2,'0') }}</span></div></button></div>
        <div class="theme-footnote"><SunMoon :size="17"/><span>{{ tx('主题图片来自仓库 docs/主题展示，最终效果可能因系统与版本有所不同。','Theme artwork is from docs/主题展示; appearance may vary by version and system.') }}</span><a :href="DOCS" target="_blank" rel="noopener noreferrer">{{ tx('查看素材来源', 'View sources') }} <ArrowUpRight :size="13"/></a></div>
      </div></section>

      <section class="section architecture-section container"><div class="architecture-panel"><div class="architecture-copy"><p class="section-kicker"><span>05</span> / {{ tx('专注本质', 'ONE AGENT ENGINE') }}</p><h2>{{ tx('不是又一个', 'Not another') }}<br/><span>{{ tx('Agent Runtime。', 'agent runtime.') }}</span></h2><p>{{ tx('Pi 是引擎，Pi-Harness 是驾驶舱。我们不重复构建 Agent Loop，而是让已有能力变得可见、可控、可扩展。','Pi is the engine. Pi-Harness is the cockpit. We do not rebuild the agent loop—we make the original one visible, controllable and extensible.') }}</p><a :href="`${REPO}#architecture`" target="_blank" rel="noopener noreferrer">{{ tx('探索项目架构', 'Explore the architecture') }} <ArrowUpRight :size="15"/></a></div><div class="architecture-diagram" aria-label="Pi Harness architecture"><div class="diagram-row diagram-front"><span class="diagram-icon">π</span><div><strong>Pi-Harness Desktop</strong><small>Workspace · Git · Themes</small></div></div><div class="diagram-link"><span></span><span>CONTROL PLANE</span><span></span></div><div class="diagram-row diagram-harness"><div class="diagram-box"><Eye :size="15"/><span>Observe</span></div><div class="diagram-box"><ShieldCheck :size="15"/><span>Control</span></div><div class="diagram-box"><Workflow :size="15"/><span>Orchestrate</span></div></div><div class="diagram-link"><span></span><span>NATIVE ENGINE</span><span></span></div><div class="diagram-row diagram-runtime"><Terminal :size="20"/><strong>Pi Coding Agent</strong><span class="runtime-live">● ACTIVE</span></div><div class="diagram-bottom"><span>SKILLS</span><span>MCP</span><span>EXTENSIONS</span><span>PROVIDERS</span></div></div></div></section>

      <section id="downloads" class="section download-section"><div class="container"><div class="download-container"><div class="download-head"><p class="section-kicker"><span>06</span> / {{ tx('开始使用', 'READY WHEN YOU ARE') }}</p><h2>{{ tx('下一次灵感，', 'Your next big idea') }}<br/><span>{{ tx('从这里开始。', 'starts here.') }}</span></h2><p>{{ tx('安装即用。原生 Pi 与 Node.js 随社区发行版一同提供，无需提前搭建复杂环境。','Install and start. Community builds bundle native Pi and Node.js, with no separate runtime setup required.') }}</p><div class="release-inline"><span class="release-dot"></span><span>{{ releaseLabel }}</span><span class="release-split">/</span><span>macOS · Windows · Linux</span></div></div><div class="download-card"><div class="download-card-top"><span>{{ tx('选择你的系统', 'CHOOSE YOUR PLATFORM') }}</span><span class="free-label"><span class="free-dot"></span>{{ tx('免费 · 开源', 'FREE · OPEN SOURCE') }}</span></div><div class="platform-picker"><button v-for="p in platforms" :key="p.key" :class="['platform-option',{selected:platform===p.key}]" @click="selectPlatform(p.key)"><component :is="iconForPlatform(p.key)" :size="21"/><span><strong>{{ tx(p.zh,p.en) }}</strong><small>{{ p.sub }}</small></span><Check v-if="platform===p.key" class="platform-check" :size="16"/></button></div><a class="download-action" :href="downloadUrl" target="_blank" rel="noopener noreferrer"><HardDriveDownload :size="19"/><span>{{ selectedAsset ? tx('下载适用于', 'Download for') + ' ' + platformName : tx('前往 Releases 下载', 'Download from Releases') }}</span><ArrowUpRight :size="18"/></a><div class="download-filename"><span>{{ selectedAsset?.name || tx('安装包根据最新官方 Release 自动匹配', 'Get the appropriate installer from the latest release') }}</span></div><div class="download-links"><a :href="RELEASES" target="_blank" rel="noopener noreferrer">{{ tx('所有版本', 'All releases') }} <ArrowUpRight :size="14"/></a><a :href="`${REPO}/blob/main/docs/release/community-release.md`" target="_blank" rel="noopener noreferrer">{{ tx('安装与签名说明', 'Install & signing notes') }} <ArrowUpRight :size="14"/></a></div><p class="download-caveat">{{ tx('提示：社区构建可能触发系统安全警告。请确认官方来源并核验发行版校验信息。','Community builds may trigger OS security prompts. Verify downloads against the official release metadata.') }}</p></div></div></div></section>

      <section class="section community-section container"><div class="community-intro"><div><p class="section-kicker"><span>07</span> / {{ tx('开放的未来', 'BUILT IN THE OPEN') }}</p><h2>{{ tx('开源，不只是', 'Open source is') }}<br/><span class="heading-muted">{{ tx('一个标签。', 'a way of building.') }}</span></h2></div><p>{{ tx('源代码、Issue、插件开发文档和皮肤模板都在 GitHub。你的每一个想法，都可以成为项目的一部分。','Source code, issues, plugin documentation and skin templates live on GitHub. There is room to contribute.') }}</p></div><div class="community-grid"><a :href="REPO" target="_blank" rel="noopener noreferrer" class="community-tile"><Github :size="24"/><span><strong>GitHub Repository</strong><small>{{ tx('浏览源码 · Star 项目 · 参与贡献', 'Source · Star · Contribute') }}</small></span><ArrowUpRight :size="21"/></a><a :href="SDK" target="_blank" rel="noopener noreferrer" class="community-tile"><Blocks :size="24"/><span><strong>Harness Plugin SDK</strong><small>{{ tx('为运行治理构建自己的插件', 'Build extensions for the control plane') }}</small></span><ArrowUpRight :size="21"/></a><a :href="SKINS" target="_blank" rel="noopener noreferrer" class="community-tile"><Sparkles :size="24"/><span><strong>Skin Starter</strong><small>{{ tx('创造独一无二的工作台', 'Create your perfect workspace') }}</small></span><ArrowUpRight :size="21"/></a></div>
      <div class="faq-wrap"><div class="faq-side"><p class="section-kicker">FAQ / {{ tx('常见问题', 'QUESTIONS') }}</p><h3>{{ tx('还有疑问？', 'Good to know.') }}</h3><p>{{ tx('从环境、架构到插件安全，这里有一些开始使用前值得了解的事。','A few things worth knowing about runtime setup, architecture and plugins.') }}</p></div><div class="faq-list"><div v-for="(faq,index) in faqs" :key="index" :class="['faq-item',{open:faqOpen===index}]"><button @click="faqOpen=faqOpen===index?null:index" :aria-expanded="faqOpen===index"><span>{{ tx(faq.zh,faq.en) }}</span><ChevronDown :size="18"/></button><p v-if="faqOpen===index">{{ tx(faq.azh,faq.aen) }}</p></div></div></div></section>

      <section class="final-cta"><div class="container final-inner"><div class="final-orb" aria-hidden="true"></div><div class="final-kicker"><span class="live-ping"></span>{{ tx('下一段旅程', 'START YOUR NEXT CHAPTER') }}</div><h2>{{ tx('让 Pi 继续强大。', 'Let Pi do the coding.') }}<br/><em>{{ tx('让你掌控全局。', 'You stay in control.') }}</em></h2><div class="final-actions"><a class="button-primary" href="#downloads" @click.prevent="jumpTo('downloads')"><Download :size="18"/> {{ tx('开始使用 Pi-Harness', 'Get Pi-Harness') }} <ArrowRight :size="17"/></a><button class="button-subtle" @click="copyClone"><Check v-if="copyState" :size="17"/><Copy v-else :size="17"/> {{ copyState ? tx('已复制', 'Copied!') : 'git clone ...' }}</button></div></div></section>
    </main>

    <footer class="site-footer"><div class="container footer-main"><div class="footer-about"><a href="#top" class="brand footer-brand" @click.prevent="jumpTo('top')"><span class="brand-mark"><span>π</span><i></i></span><span class="brand-name">pi<span>·</span>harness</span></a><p>{{ tx('The Operational Superset of Pi Coding Agent.', 'The Operational Superset of Pi Coding Agent.') }}</p><small>Made for developers, with native Pi at heart.</small></div><div class="footer-column"><strong>{{ tx('产品', 'PRODUCT') }}</strong><a href="#features" @click.prevent="jumpTo('features')">{{ tx('核心能力', 'Features') }}</a><a href="#showcase" @click.prevent="jumpTo('showcase')">{{ tx('界面预览', 'Screenshots') }}</a><a href="#themes" @click.prevent="jumpTo('themes')">{{ tx('主题图库', 'Themes') }}</a><a href="#downloads" @click.prevent="jumpTo('downloads')">{{ tx('下载', 'Download') }}</a></div><div class="footer-column"><strong>{{ tx('开发者', 'DEVELOPERS') }}</strong><a :href="REPO" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight :size="12"/></a><a :href="SDK" target="_blank" rel="noopener noreferrer">Plugin SDK <ArrowUpRight :size="12"/></a><a :href="`${REPO}/blob/main/CHANGELOG.md`" target="_blank" rel="noopener noreferrer">Changelog <ArrowUpRight :size="12"/></a><a :href="SKINS" target="_blank" rel="noopener noreferrer">Skin Starter <ArrowUpRight :size="12"/></a></div><div class="footer-column"><strong>{{ tx('社区', 'COMMUNITY') }}</strong><a :href="`${REPO}/issues`" target="_blank" rel="noopener noreferrer">Issues <ArrowUpRight :size="12"/></a><a :href="`${REPO}/pulls`" target="_blank" rel="noopener noreferrer">Pull Requests <ArrowUpRight :size="12"/></a><a :href="`${REPO}/blob/main/LICENSE`" target="_blank" rel="noopener noreferrer">AGPL-3.0 <ArrowUpRight :size="12"/></a></div></div><div class="container footer-bottom"><span>© {{ new Date().getFullYear() }} Pi-Harness · Open-source community project</span><span>{{ tx('独立开源项目 · 非 Pi 官方网站', 'Independent open-source website · Not the official Pi website') }}</span><a href="#top" @click.prevent="jumpTo('top')">{{ tx('返回顶部', 'Back to top') }} ↑</a></div></footer>

    <div v-if="lightbox" class="lightbox" role="dialog" aria-modal="true" :aria-label="lightbox.title" @click.self="closeImage"><div class="lightbox-bar"><span>{{ lightbox.title }}</span><button @click="closeImage" :aria-label="tx('关闭预览', 'Close image')"><X :size="22"/></button></div><img :src="lightbox.src" :alt="lightbox.title" /></div>
  </div>
</template>
