/** Optimize every imported Pi-Harness screenshot, downloading only if no local copy exists. */
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const output = path.join(root, 'public', 'assets')
const localDocs = path.join(root, 'assets', 'docs')
const BASE = 'https://raw.githubusercontent.com/wangmiaozero/pi-harness/main/'

// Curated hero/showcase/theme renders keep their stable file names and sizes.
const sources = [
  ['workspace.webp','docs/功能界面/经典主题/工作区.png',1800],
  ['harness.webp','docs/功能界面/经典主题/工具Harness-1.png',1800],
  ['agents.webp','docs/功能界面/经典主题/多智能体-团队.png',1800],
  ['architecture.webp','docs/功能界面/经典主题/项目架构-1.png',1800],
  ['models.webp','docs/功能界面/经典主题/Provider与模型-1.png',1800],
  ['capabilities.webp','docs/功能界面/经典主题/能力中心-1.png',1800],
  ['voice.webp','docs/功能界面/经典主题/实时语音.png',1800],
  ['mcp.webp','docs/功能界面/经典主题/MCP市场.png',1800],
  ['subagents.webp','docs/功能界面/经典主题/子智能体.png',1800],
  ['remote-hosts.webp','docs/功能界面/经典主题/远程主机.png',1800],
  ['theme-ming.webp','docs/主题展示/大明/月城书姬.png',1200],
  ['theme-starship.webp','docs/主题展示/星舰/霜星领航.png',1200],
  ['theme-liquid.webp','docs/主题展示/macOS 27/Liquid Ether.png',1200],
]

/** Every image under assets/docs also gets a full-size slug render for the gallery. */
async function discover(dir, prefix = '') {
  const found = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) found.push(...await discover(path.join(dir, entry.name), rel))
    else if (/\.(png|jpe?g)$/i.test(entry.name)) found.push(rel)
  }
  return found.sort()
}

async function loadBytes(file) {
  const url = BASE + file.split('/').map(encodeURIComponent).join('/')
  const localFile = path.join(localDocs, file.slice('docs/'.length))
  try {
    const bytes = await fs.readFile(localFile)
    console.log(`Reading ${localFile}`)
    return bytes
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    console.log(`Downloading ${file}`)
    const r = await fetch(url, {signal: AbortSignal.timeout(60000)})
    if (!r.ok) throw new Error(`Download failed (${r.status}): ${url}`)
    return Buffer.from(await r.arrayBuffer())
  }
}

await fs.mkdir(output, { recursive:true })
let ok = 0
const jobs = sources.map(([out, file, width]) => ({ out, file, width, slug: null }))
for (const rel of await discover(localDocs)) {
  const file = `docs/${rel}`
  const slug = `${rel.split('/').join('--').replace(/\.(png|jpe?g)$/i, '')}.webp`
  if (jobs.some(j => j.file === file)) jobs.push({ out: slug, file, width: 1800, slug })
  else jobs.push({ out: slug, file, width: 1800, slug })
}
for (const { out, file, width } of jobs) {
  const bytes = await loadBytes(file)
  if (bytes.byteLength > 40*1024*1024) throw new Error(`Asset too large: ${file}`)
  const image = sharp(bytes, {limitInputPixels: 75_000_000}).rotate()
  const result = await image.resize({width,withoutEnlargement:true}).webp({quality:79,effort:5}).toBuffer()
  await fs.writeFile(path.join(output,out), result)
  console.log(`  ${out} (${Math.round(result.byteLength/1024)} KB)`)
  ok++
}
if(ok!==jobs.length) throw new Error('Not all images were processed')
console.log(`\nSynced ${ok} assets (curated + full gallery). The website uses local optimized WebP files by default.`)
