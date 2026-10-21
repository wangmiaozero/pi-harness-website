# pi-harness-website

以 **Vue 3 + TypeScript + Vite** 编写的 Pi-Harness 单页产品官网。暗色科技视觉、桌面与移动端适配、中英文切换、真实截图切换、主题图库、平台下载和开发者入口。

**项目仓库：** <https://github.com/wangmiaozero/pi-harness>

**截图来源：** <https://github.com/wangmiaozero/pi-harness/tree/main/docs>

## 1. 直接运行

准备 Node.js 22+，推荐使用 pnpm 9+。

```bash
cd pi-harness-website
npm install
npm run dev
```

访问 `http://localhost:3000`。

使用 pnpm 也可以：

```bash
pnpm install
pnpm dev
```

## 2. 本地图片素材

已从 `/Users/tree/codes/my-codes/pi-Harness/docs` 导入全部 **28 张原始图片**，保留中文分类和文件名，存放于 `assets/docs/`（主题展示、功能界面、社区）。

页面使用的 **9 张截图和主题图片**已转换为优化 WebP，存放于 `public/assets/`。网站默认加载这些本地文件，可直接预览或构建，无需下载图片或设置环境变量。

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
| 产品截图 | 6 组来自 `docs/功能界面/经典主题/` 的真实图片，标签切换与放大 |
| 功能网格 | Native Pi、Git & Worktrees、会话历史、架构图、能力生态、治理 |
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

官网默认中文，导航栏可切换英文，用户选择保存到浏览器的本地存储。

## 6. 部署

先执行：

```bash
npm install
npm run assets:sync
npm run build
```

将生成的 `dist/` 目录部署到 Vercel、Netlify、Cloudflare Pages、Nginx 或 GitHub Pages。若部署在 GitHub Pages 的子路径，修改 `vite.config.ts` 里的 `base`（如 `/pi-harness-website/`）；同时修改 `index.html` 的图标路径，以匹配子路径；本地图片路径会自动跟随 Vite 的 `base`。部署在自定义域名根目录则无需修改。

Vercel / Cloudflare Pages / Netlify 常用配置：

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
- Node: 22+

如要在云端构建时重新优化素材，可把 Build command 改为 `npm run assets:sync && npm run build`；原图完整时无需访问 GitHub Raw。

## 7. 运行限制和说明

- 此交付物是**官网源码**，并非 Pi-Harness 桌面端本身。
- 网站素材来自 Pi-Harness 项目 docs 目录中的既有截图，已随项目保存；内置品牌符号和简单示意图由 CSS/SVG 绘制。
- 本地源码包未预先安装 `node_modules`，按第 1 节安装依赖。
- 不收集账号、设备信息或访问统计；动态 GitHub API 请求由访问者浏览器直连 GitHub。
- 软件使用方式、许可证及安装安全声明请以 Pi-Harness 仓库最新资料为准。
