import { computed, onMounted, ref } from 'vue'
import { RELEASES } from '../data'

export type PlatformKey = 'mac-arm' | 'mac-intel' | 'windows' | 'linux'

interface Asset { name: string; browser_download_url: string }
interface GithubRelease { tag_name: string; assets: Asset[] }

export const platforms: { key: PlatformKey; name: string; sub: string }[] = [
  { key: 'mac-arm', name: 'macOS', sub: 'Apple Silicon' },
  { key: 'mac-intel', name: 'macOS', sub: 'Intel' },
  { key: 'windows', name: 'Windows', sub: 'x64' },
  { key: 'linux', name: 'Linux', sub: 'x64' },
]

const release = ref<GithubRelease | null>(null)
const stars = ref<number | null>(null)
const platform = ref<PlatformKey>('mac-arm')
let booted = false

function assetFor(key: PlatformKey, assets: Asset[]) {
  const allowed = assets.filter(asset => !/nomascot|blockmap|\.sig$|checksum/i.test(asset.name))
  if (key === 'mac-arm') return allowed.find(asset => /arm64\.dmg$/i.test(asset.name))
  if (key === 'mac-intel') return allowed.find(asset => /\.dmg$/i.test(asset.name) && !/arm64/i.test(asset.name))
  if (key === 'windows') return allowed.find(asset => /Setup.*\.exe$/i.test(asset.name))
  return allowed.find(asset => /\.AppImage$/i.test(asset.name))
}

const selectedAsset = computed(() => assetFor(platform.value, release.value?.assets ?? []))
const downloadUrl = computed(() => selectedAsset.value?.browser_download_url ?? RELEASES)
const platformName = computed(() => {
  const item = platforms.find(entry => entry.key === platform.value)
  return item ? `${item.name} · ${item.sub}` : 'macOS · Apple Silicon'
})

export function useGithub() {
  if (!booted) {
    booted = true
    onMounted(() => {
      if (/Win/i.test(navigator.userAgent)) platform.value = 'windows'
      else if (/Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent)) platform.value = 'linux'
      void Promise.allSettled([
        fetch('https://api.github.com/repos/wangmiaozero/pi-harness/releases/latest', { headers: { Accept: 'application/vnd.github+json' } })
          .then(response => { if (!response.ok) throw new Error('release unavailable'); return response.json() })
          .then((data: GithubRelease) => { release.value = data }),
        fetch('https://api.github.com/repos/wangmiaozero/pi-harness', { headers: { Accept: 'application/vnd.github+json' } })
          .then(response => { if (!response.ok) throw new Error('stats unavailable'); return response.json() })
          .then((data: { stargazers_count: number }) => { stars.value = data.stargazers_count }),
      ])
    })
  }

  function selectPlatform(key: PlatformKey) { platform.value = key }

  return { release, stars, platform, platforms, selectedAsset, downloadUrl, platformName, selectPlatform }
}
