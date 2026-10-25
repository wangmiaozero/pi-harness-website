import type { MessageKey } from './i18n'

// Every screenshot below is from the project's own docs/ tree.
export const REPO = 'https://github.com/wangmiaozero/pi-harness'
export const RELEASES = `${REPO}/releases`
export const DOCS = `${REPO}/tree/main/docs`
export const SDK = `${REPO}/tree/main/docs/plugins`
export const SKINS = 'https://github.com/wangmiaozero/pi-harness-skin-starter'
const RAW = 'https://raw.githubusercontent.com/wangmiaozero/pi-harness/main/'
const LOCAL = import.meta.env.VITE_LOCAL_ASSETS !== 'false'

export const screenshots = [
  { key: 'workspace', category: 'screenshots.workspace.label', file: 'docs/功能界面/经典主题/工作区.png', local: 'workspace.webp', label: '01', title: 'screenshots.workspace.title', description: 'screenshots.workspace.description' },
  { key: 'harness', category: 'screenshots.harness.label', file: 'docs/功能界面/经典主题/工具Harness-1.png', local: 'harness.webp', label: '02', title: 'screenshots.harness.title', description: 'screenshots.harness.description' },
  { key: 'agents', category: 'screenshots.agents.label', file: 'docs/功能界面/经典主题/多智能体-团队.png', local: 'agents.webp', label: '03', title: 'screenshots.agents.title', description: 'screenshots.agents.description' },
  { key: 'architecture', category: 'screenshots.architecture.label', file: 'docs/功能界面/经典主题/项目架构-1.png', local: 'architecture.webp', label: '04', title: 'screenshots.architecture.title', description: 'screenshots.architecture.description' },
  { key: 'models', category: 'screenshots.models.label', file: 'docs/功能界面/经典主题/Provider与模型-1.png', local: 'models.webp', label: '05', title: 'screenshots.models.title', description: 'screenshots.models.description' },
  { key: 'capabilities', category: 'screenshots.capabilities.label', file: 'docs/功能界面/经典主题/能力中心-1.png', local: 'capabilities.webp', label: '06', title: 'screenshots.capabilities.title', description: 'screenshots.capabilities.description' },
  { key: 'voice', category: 'screenshots.voice.label', file: 'docs/功能界面/经典主题/实时语音.png', local: 'voice.webp', label: '07', title: 'screenshots.voice.title', description: 'screenshots.voice.description' },
  { key: 'mcp', category: 'screenshots.mcp.label', file: 'docs/功能界面/经典主题/MCP市场.png', local: 'mcp.webp', label: '08', title: 'screenshots.mcp.title', description: 'screenshots.mcp.description' },
  { key: 'subagents', category: 'screenshots.subagents.label', file: 'docs/功能界面/经典主题/子智能体.png', local: 'subagents.webp', label: '09', title: 'screenshots.subagents.title', description: 'screenshots.subagents.description' },
  { key: 'remoteHosts', category: 'screenshots.remoteHosts.label', file: 'docs/功能界面/经典主题/远程主机.png', local: 'remote-hosts.webp', label: '10', title: 'screenshots.remoteHosts.title', description: 'screenshots.remoteHosts.description' },
] as const satisfies readonly { key: string; file: string; local: string; title: MessageKey; description: MessageKey; label: string; category: MessageKey }[]

export const themes = [
  { key: 'ming', file: 'docs/主题展示/大明/月城书姬.png', local: 'theme-ming.webp', title: 'skins.ming.title', description: 'skins.ming.description' },
  { key: 'starship', file: 'docs/主题展示/星舰/霜星领航.png', local: 'theme-starship.webp', title: 'skins.starship.title', description: 'skins.starship.description' },
  { key: 'liquid', file: 'docs/主题展示/macOS 27/Liquid Ether.png', local: 'theme-liquid.webp', title: 'skins.liquid.title', description: 'skins.liquid.description' },
] as const satisfies readonly { key: string; file: string; local: string; title: MessageKey; description: MessageKey }[]

export function picture(item: { file: string; local: string }) {
  return LOCAL ? `${import.meta.env.BASE_URL}assets/${item.local}` : `${RAW}${item.file.split('/').map(encodeURIComponent).join('/')}`
}
export function fallbackPicture(item: { file: string }) {
  return `${RAW}${item.file.split('/').map(encodeURIComponent).join('/')}`
}

export type GalleryCategory = 'classic' | 'ming' | 'standard' | 'themes' | 'community'
export interface GalleryItem { category: GalleryCategory; file: string; local: string; title: MessageKey }

// Every image from the project's docs/ tree, grouped by upstream category.
export const gallery: GalleryItem[] = [
  { category: 'classic', file: 'docs/功能界面/经典主题/工作区.png', local: '功能界面--经典主题--工作区.webp', title: 'screenshots.workspace.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/工具Harness-1.png', local: '功能界面--经典主题--工具Harness-1.webp', title: 'screenshots.harness.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/工具Harness-2.png', local: '功能界面--经典主题--工具Harness-2.webp', title: 'gallery.harness2' },
  { category: 'classic', file: 'docs/功能界面/经典主题/多智能体-团队.png', local: '功能界面--经典主题--多智能体-团队.webp', title: 'screenshots.agents.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/多智能体-任务依赖.png', local: '功能界面--经典主题--多智能体-任务依赖.webp', title: 'gallery.taskDependencies' },
  { category: 'classic', file: 'docs/功能界面/经典主题/项目架构-1.png', local: '功能界面--经典主题--项目架构-1.webp', title: 'screenshots.architecture.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/项目架构-2.png', local: '功能界面--经典主题--项目架构-2.webp', title: 'gallery.architecture2' },
  { category: 'classic', file: 'docs/功能界面/经典主题/项目架构-3.png', local: '功能界面--经典主题--项目架构-3.webp', title: 'gallery.architecture3' },
  { category: 'classic', file: 'docs/功能界面/经典主题/Provider与模型-1.png', local: '功能界面--经典主题--Provider与模型-1.webp', title: 'screenshots.models.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/Provider与模型-2.png', local: '功能界面--经典主题--Provider与模型-2.webp', title: 'gallery.providers2' },
  { category: 'classic', file: 'docs/功能界面/经典主题/能力中心-1.png', local: '功能界面--经典主题--能力中心-1.webp', title: 'screenshots.capabilities.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/能力中心-2.png', local: '功能界面--经典主题--能力中心-2.webp', title: 'gallery.capabilities2' },
  { category: 'classic', file: 'docs/功能界面/经典主题/能力中心-3.png', local: '功能界面--经典主题--能力中心-3.webp', title: 'gallery.capabilities3' },
  { category: 'classic', file: 'docs/功能界面/经典主题/Git.png', local: '功能界面--经典主题--Git.webp', title: 'gallery.git' },
  { category: 'classic', file: 'docs/功能界面/经典主题/通用设置.png', local: '功能界面--经典主题--通用设置.webp', title: 'gallery.generalSettings' },
  { category: 'classic', file: 'docs/功能界面/经典主题/主题皮肤库.png', local: '功能界面--经典主题--主题皮肤库.webp', title: 'gallery.skinGallery' },
  { category: 'classic', file: 'docs/功能界面/经典主题/AI.png', local: '功能界面--经典主题--AI.webp', title: 'gallery.aiPreferences' },
  { category: 'classic', file: 'docs/功能界面/经典主题/实时语音.png', local: '功能界面--经典主题--实时语音.webp', title: 'screenshots.voice.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/工作区语音.png', local: '功能界面--经典主题--工作区语音.webp', title: 'gallery.workspaceVoice' },
  { category: 'classic', file: 'docs/功能界面/经典主题/快捷键.png', local: '功能界面--经典主题--快捷键.webp', title: 'gallery.shortcuts' },
  { category: 'classic', file: 'docs/功能界面/经典主题/指令.png', local: '功能界面--经典主题--指令.webp', title: 'gallery.instructions' },
  { category: 'classic', file: 'docs/功能界面/经典主题/MCP服务器.png', local: '功能界面--经典主题--MCP服务器.webp', title: 'gallery.mcpServers' },
  { category: 'classic', file: 'docs/功能界面/经典主题/MCP市场.png', local: '功能界面--经典主题--MCP市场.webp', title: 'screenshots.mcp.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/子智能体.png', local: '功能界面--经典主题--子智能体.webp', title: 'screenshots.subagents.title' },
  { category: 'classic', file: 'docs/功能界面/经典主题/远程主机.png', local: '功能界面--经典主题--远程主机.webp', title: 'screenshots.remoteHosts.title' },
  { category: 'ming', file: 'docs/功能界面/大明/Git.png', local: '功能界面--大明--Git.webp', title: 'gallery.mingGit' },
  { category: 'ming', file: 'docs/功能界面/大明/Provider与模型.png', local: '功能界面--大明--Provider与模型.webp', title: 'gallery.mingProviders' },
  { category: 'ming', file: 'docs/功能界面/大明/能力中心.png', local: '功能界面--大明--能力中心.webp', title: 'gallery.mingCapabilities' },
  { category: 'ming', file: 'docs/功能界面/大明/项目架构.png', local: '功能界面--大明--项目架构.webp', title: 'gallery.mingArchitecture' },
  { category: 'ming', file: 'docs/功能界面/大明/通用设置.png', local: '功能界面--大明--通用设置.webp', title: 'gallery.mingSettings' },
  { category: 'ming', file: 'docs/功能界面/大明/主题皮肤库.png', local: '功能界面--大明--主题皮肤库.webp', title: 'gallery.mingSkinGallery' },
  { category: 'standard', file: 'docs/主题展示/经典主题/dark.png', local: '主题展示--经典主题--dark.webp', title: 'gallery.themeDark' },
  { category: 'standard', file: 'docs/主题展示/经典主题/soft-dark.png', local: '主题展示--经典主题--soft-dark.webp', title: 'gallery.themeSoftDark' },
  { category: 'standard', file: 'docs/主题展示/经典主题/light.png', local: '主题展示--经典主题--light.webp', title: 'gallery.themeLight' },
  { category: 'standard', file: 'docs/主题展示/经典主题/soft-light.png', local: '主题展示--经典主题--soft-light.webp', title: 'gallery.themeSoftLight' },
  { category: 'standard', file: 'docs/主题展示/经典主题/pink.png', local: '主题展示--经典主题--pink.webp', title: 'gallery.themePink' },
  { category: 'standard', file: 'docs/主题展示/经典主题/purple.png', local: '主题展示--经典主题--purple.webp', title: 'gallery.themePurple' },
  { category: 'standard', file: 'docs/主题展示/经典主题/green.png', local: '主题展示--经典主题--green.webp', title: 'gallery.themeGreen' },
  { category: 'standard', file: 'docs/主题展示/经典主题/blue.png', local: '主题展示--经典主题--blue.webp', title: 'gallery.themeBlue' },
  { category: 'standard', file: 'docs/主题展示/经典主题/orange.png', local: '主题展示--经典主题--orange.webp', title: 'gallery.themeOrange' },
  { category: 'standard', file: 'docs/主题展示/经典主题/red.png', local: '主题展示--经典主题--red.webp', title: 'gallery.themeRed' },
  { category: 'standard', file: 'docs/主题展示/经典主题/cyan.png', local: '主题展示--经典主题--cyan.webp', title: 'gallery.themeCyan' },
  { category: 'standard', file: 'docs/主题展示/经典主题/macos27-light.png', local: '主题展示--经典主题--macos27-light.webp', title: 'gallery.themeMacos27Light' },
  { category: 'standard', file: 'docs/主题展示/经典主题/macos27.png', local: '主题展示--经典主题--macos27.webp', title: 'gallery.themeMacos27Dark' },
  { category: 'themes', file: 'docs/主题展示/大明/雪境朝臣.png', local: '主题展示--大明--雪境朝臣.webp', title: 'gallery.snowOfficial' },
  { category: 'themes', file: 'docs/主题展示/大明/雪夜笛姬.png', local: '主题展示--大明--雪夜笛姬.webp', title: 'gallery.snowFlute' },
  { category: 'themes', file: 'docs/主题展示/大明/月城书姬.png', local: '主题展示--大明--月城书姬.webp', title: 'skins.ming.title' },
  { category: 'themes', file: 'docs/主题展示/星舰/霜星领航.png', local: '主题展示--星舰--霜星领航.webp', title: 'skins.starship.title' },
  { category: 'themes', file: 'docs/主题展示/macOS 27/Liquid Ether.png', local: '主题展示--macOS 27--Liquid Ether.webp', title: 'skins.liquid.title' },
  { category: 'community', file: 'docs/社区/qq-group.jpg', local: '社区--qq-group.webp', title: 'gallery.qqGroup' },
]

export const galleryCategories: GalleryCategory[] = ['classic', 'ming', 'standard', 'themes', 'community']
