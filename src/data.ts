// Every screenshot below is from the project's own docs/ tree.
export const REPO = 'https://github.com/wangmiaozero/pi-harness'
export const RELEASES = `${REPO}/releases`
export const DOCS = `${REPO}/tree/main/docs`
export const SDK = `${REPO}/tree/main/docs/plugins`
export const SKINS = 'https://github.com/wangmiaozero/pi-harness-skin-starter'
const RAW = 'https://raw.githubusercontent.com/wangmiaozero/pi-harness/main/'
const LOCAL = import.meta.env.VITE_LOCAL_ASSETS !== 'false'

export const screenshots = [
  { key: 'workspace', file: 'docs/功能界面/经典主题/工作区.png', local: 'workspace.webp', label: '01 / WORKSPACE', zh: '真正为项目而生的工作区', en: 'One workspace. Every moving part.', descZh: '对话、项目文件、Git 与模型配置在同一工作区协同。', descEn: 'Keep your conversations, project files, Git and models in one coherent view.' },
  { key: 'harness', file: 'docs/功能界面/经典主题/工具Harness-1.png', local: 'harness.webp', label: '02 / HARNESS', zh: '每一次 Agent 运行，都尽在掌控', en: 'Every run, under control.', descZh: '查看运行轨迹、工具策略、预算与恢复状态。', descEn: 'Inspect traces, tool policies, budgets and recovery checkpoints.' },
  { key: 'agents', file: 'docs/功能界面/经典主题/多智能体-团队.png', local: 'agents.webp', label: '03 / ORCHESTRATION', zh: '让 Agent 从单打独斗到团队协作', en: 'An agent team, not a black box.', descZh: '团队、任务依赖、审查门禁与独立工作区。示例截图展示执行前状态。', descEn: 'Teams, task dependencies, review gates and isolated workspaces. Example shown before execution.' },
  { key: 'architecture', file: 'docs/功能界面/经典主题/项目架构-1.png', local: 'architecture.webp', label: '04 / ARCHITECTURE', zh: '看见代码背后的架构', en: 'Make project structure visible.', descZh: '本地分析项目目录、模块和依赖关系，帮助理解复杂代码库。', descEn: 'Explore project modules and supported static dependencies with local analysis.' },
  { key: 'models', file: 'docs/功能界面/经典主题/Provider与模型-1.png', local: 'models.webp', label: '05 / MODELS', zh: '模型与供应商，自由切换', en: 'Your providers. Your models.', descZh: '集中管理 Pi 兼容的模型、端点、凭证与连接测试。', descEn: 'Configure Pi-compatible models, endpoints, credentials and connection checks.' },
  { key: 'capabilities', file: 'docs/功能界面/经典主题/能力中心-1.png', local: 'capabilities.webp', label: '06 / CAPABILITIES', zh: '让能力按需扩展', en: 'Add capability without clutter.', descZh: 'Skills、Extensions、Packages 与 MCP，一处管理。', descEn: 'Manage Skills, Extensions, Packages and MCP from one place.' },
] as const

export const themes = [
  { key: 'ming', file: 'docs/主题展示/大明/月城书姬.png', local: 'theme-ming.webp', zh: '大明 · 月城书姬', en: 'Ming · Moon Scholar', descZh: '东方美学与桌面工具的碰撞', descEn: 'Oriental-inspired visual identity' },
  { key: 'starship', file: 'docs/主题展示/星舰/霜星领航.png', local: 'theme-starship.webp', zh: '星舰 · 霜星领航', en: 'Starship · Frost Navigator', descZh: '沉浸式科幻驾驶舱', descEn: 'Immersive sci-fi cockpit' },
  { key: 'liquid', file: 'docs/主题展示/macOS 27/Liquid Ether.png', local: 'theme-liquid.webp', zh: 'macOS 27 · Liquid Ether', en: 'macOS 27 · Liquid Ether', descZh: '轻盈透明的流体质感', descEn: 'Airy, translucent glass surfaces' },
] as const

export function picture(item: { file: string; local: string }) {
  return LOCAL ? `${import.meta.env.BASE_URL}assets/${item.local}` : `${RAW}${item.file.split('/').map(encodeURIComponent).join('/')}`
}
export function fallbackPicture(item: { file: string }) {
  return `${RAW}${item.file.split('/').map(encodeURIComponent).join('/')}`
}
