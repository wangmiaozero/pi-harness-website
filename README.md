# pi-harness-website

以 **Vue 3 + TypeScript + Vite** 编写的 Pi-Harness 单页产品官网。暗色科技视觉、桌面与移动端适配、8 种语言切换、真实截图切换、主题图库、平台下载和开发者入口。

**项目仓库：** <https://github.com/wangmiaozero/pi-harness>

**截图来源：** <https://github.com/wangmiaozero/pi-harness/tree/main/docs>

## 1. 直接运行

准备 Node.js 22.18+；项目固定使用 pnpm 12.9.1（见 `packageManager`）。

```bash
cd pi-harness-website
npm install
npm run dev
```

访问 `http://localhost:3000/pi-harness-website/`。

使用 pnpm 也可以：

```bash
pnpm install
pnpm dev
```

## 2. 本地图片素材

已从 `/Users/tree/codes/my-codes/pi-Harness/docs` 导入全部 **36 张原始图片**，保留中文分类和文件名，存放于 `assets/docs/`（主题展示、功能界面、社区），并随素材保留了官方文档 Markdown 以便参考。

页面使用的 **13 张截图和主题图片**已转换为优化 WebP，存放于 `public/assets/`。网站默认加载这些本地文件，可直接预览或构建，无需下载图片或设置环境变量。

更新 `assets/docs/` 中的原图后，执行以下命令重新生成页面素材：

```bash
npm run assets:sync
```

同步脚本优先读取项目内的原图，仅在对应文件缺失时从 GitHub 下载。脚本不会覆盖 `.env.local`。

如需使用在线原图，可在 `.env.local` 中设置 `VITE_LOCAL_ASSETS=false` 并重启开发服务器。图片加载失败时会显示占位效果，并提供截图仓库入口。

## 3. 页面模块

| 区块 | 内容 |
| --- | --- |
| Hero | Native Pi / 运行治理定位、工作区实机截图 |
| 核心理念 | Observe / Control / Orchestrate |
| 产品截图 | 10 组来自 `docs/功能界面/经典主题/` 的真实图片，标签切换与放大（工作区、Harness、多智能体、项目架构、模型、能力中心、实时语音、MCP 市场、子智能体、远程主机） |
| 功能网格 | Native Pi、Git & Worktrees、跨工具会话历史、架构图、能力生态（含 MCP 市场）、治理 |
| 主题图库 | 大明 / 星舰 / macOS 27 的三张真实图片 |
| 架构示意 | Native Pi + Harness Control Plane 的层级关系 |
| 下载 | macOS Apple Silicon / Intel、Windows x64、Linux x64 |
| 社区 | GitHub、Harness Plugin SDK、Skin Starter、FAQ |

## 4. 下载链接说明

网站在浏览器端读取 **GitHub 官方公开 API**：

- `https://api.github.com/repos/wangmiaozero/pi-harness/releases/latest`：动态读取最新正式发行版和实际安装包文件名。
- `https://api.github.com/repos/wangmiaozero/pi-harness`：动态读取 Star 数量。

自动匹配真实的 DMG / EXE / AppImage 下载资源；如果接口限流、报错，或者当前平台没有对应安装包，按钮自动退回到官方 Releases 页面，不会指向虚构的下载 URL。

插件 SDK 在 `main` 分支已有代码，但网站不会保证当前安装包已经包含所有最新开发功能。**正式发行状态始终以 Release Notes 为准**。

## 5. 自定义

- **颜色/排版/布局**：`src/style.css`
- **页面结构及交互**：`src/App.vue`
- **截图索引/官方入口**：`src/data.ts`
- **原始图片素材**：`assets/docs/`
- **页面 WebP 素材**：`public/assets/`
- **本地素材同步清单**：`scripts/sync-assets.mjs`
- **网页标题、SEO**：`index.html`
- **站点社交封面、图标**：`public/og-cover.svg`、`public/favicon.svg`

官网与 Pi-Harness 桌面端使用相同的 8 种语言：English、简体中文、繁體中文、日本語、한국어、Русский、Français、Deutsch。

首次访问默认跟随浏览器语言，也可在导航栏选择固定语言或“跟随系统”。语言选择保存到本地；旧版 `zh` / `en` 偏好会自动兼容，浏览器限制本地存储时仍可正常切换。页面正文、截图说明、FAQ、无障碍标签及页面标题/描述会随语言切换。

翻译文件位于 `src/i18n/locales/`，8 种语言使用相同词条。可执行 `pnpm test` 检查翻译完整性、语言识别和旧偏好迁移。

## 6. GitHub Pages 部署

站点地址：<https://wangmiaozero.github.io/pi-harness-website/>

`dist/` 已纳入版本控制，Vite 的 `base` 已设为 `/pi-harness-website/`，图片和图标会使用对应的项目子路径。

仓库的 **Settings → Pages → Build and deployment → Source** 使用 **GitHub Actions**。`.github/workflows/pages.yml` 会在推送 `main` 后自动安装锁定依赖、运行多语言测试与 TypeScript 检查、构建网站，再部署新生成的 `dist/`。无需手动在 Actions 中运行，也不依赖仓库内的 `dist/` 是否已更新。Pull Request 会自动运行检查和构建，但不会部署；也支持手动触发。

构建任务只具有源码读取权限；部署任务仅在检查和构建成功后运行。可在 [Actions](https://github.com/wangmiaozero/pi-harness-website/actions) 查看执行结果。

修改页面或素材后，提交并推送源码即可触发 CI/CD。`dist/` 继续保留在仓库中，若要同步本地构建产物，可执行：

```bash
npm run build
git add .
git commit -m "Update website"
git push
```

更新原图后，可先运行 `npm run assets:sync` 重新生成 WebP，再构建页面。部署其他域名的根目录时，将 `vite.config.ts` 的 `base` 改为 `/`，并更新 `index.html` 的社交封面地址后重新构建。

## 7. 运行限制和说明

- 此交付物是**官网源码**，并非 Pi-Harness 桌面端本身。
- 网站素材来自 Pi-Harness 项目 docs 目录中的既有截图，已随项目保存；内置品牌符号和简单示意图由 CSS/SVG 绘制。
- 本地源码包未预先安装 `node_modules`，按第 1 节安装依赖。
- 不收集账号、设备信息或访问统计；动态 GitHub API 请求由访问者浏览器直连 GitHub。
- 软件使用方式、许可证及安装安全声明请以 Pi-Harness 仓库最新资料为准。
