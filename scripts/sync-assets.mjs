/** Optimize imported Pi-Harness screenshots, downloading only if no local copy exists. */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const output = path.join(root, 'public', 'assets')
const localDocs = path.join(root, 'assets', 'docs')
const BASE = 'https://raw.githubusercontent.com/wangmiaozero/pi-harness/main/'
const sources = [
  ['workspace.webp','docs/功能界面/经典主题/工作区.png'],
  ['harness.webp','docs/功能界面/经典主题/工具Harness-1.png'],
  ['agents.webp','docs/功能界面/经典主题/多智能体-团队.png'],
  ['architecture.webp','docs/功能界面/经典主题/项目架构-1.png'],
  ['models.webp','docs/功能界面/经典主题/Provider与模型-1.png'],
  ['capabilities.webp','docs/功能界面/经典主题/能力中心-1.png'],
  ['voice.webp','docs/功能界面/经典主题/实时语音.png'],
  ['mcp.webp','docs/功能界面/经典主题/MCP市场.png'],
  ['subagents.webp','docs/功能界面/经典主题/子智能体.png'],
  ['remote-hosts.webp','docs/功能界面/经典主题/远程主机.png'],
  ['theme-ming.webp','docs/主题展示/大明/月城书姬.png'],
  ['theme-starship.webp','docs/主题展示/星舰/霜星领航.png'],
  ['theme-liquid.webp','docs/主题展示/macOS 27/Liquid Ether.png'],
]
await fs.mkdir(output, { recursive:true })
let ok = 0
for (const [out, file] of sources) {
  const url = BASE + file.split('/').map(encodeURIComponent).join('/')
  const localFile = path.join(localDocs, file.slice('docs/'.length))
  let bytes
  try {
    bytes = await fs.readFile(localFile)
    console.log(`Reading ${localFile}`)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    console.log(`Downloading ${file}`)
    const r = await fetch(url, {signal: AbortSignal.timeout(60000)})
    if (!r.ok) throw new Error(`Download failed (${r.status}): ${url}`)
    bytes = Buffer.from(await r.arrayBuffer())
  }
  if (bytes.byteLength > 40*1024*1024) throw new Error(`Asset too large: ${file}`)
  const image = sharp(bytes, {limitInputPixels: 75_000_000}).rotate()
  const targetWidth = out.startsWith('theme-') ? 1200 : 1800
  const result = await image.resize({width:targetWidth,withoutEnlargement:true}).webp({quality:79,effort:5}).toBuffer()
  await fs.writeFile(path.join(output,out), result)
  console.log(`  ${out} (${Math.round(result.byteLength/1024)} KB)`)
  ok++
}
if(ok!==sources.length) throw new Error('Not all images were downloaded')
console.log(`\nSynced ${ok} assets. The website uses local optimized WebP files by default.`)
