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
