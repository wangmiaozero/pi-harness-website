import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'

const root = new URL('../', import.meta.url)
const data = readFileSync(new URL('src/data.ts', root), 'utf8')
const gallery = data.slice(data.indexOf('export const gallery:'))
const galleryFiles = [...gallery.matchAll(/file: '([^']+)'/g)].map(match => match[1])
function images(dir) {
  return readdirSync(new URL(dir, root), { withFileTypes: true }).flatMap(entry => {
    const file = `${dir}/${entry.name}`
    return entry.isDirectory() ? images(file) : /\.(png|jpe?g)$/i.test(file) ? [file.replace('assets/', '')] : []
  })
}

test('gallery covers every bundled upstream image exactly once', () => {
  assert.equal(new Set(galleryFiles).size, galleryFiles.length, 'duplicate gallery image')
  assert.deepEqual([...galleryFiles].sort(), images('assets/docs').sort())
})

test('all gallery, showcase and theme images have sources and optimized renders', () => {
  for (const [, file, local] of data.matchAll(/file: '([^']+)', local: '([^']+)'/g)) {
    assert.ok(existsSync(new URL(`assets/${file}`, root)), `missing source: ${file}`)
    assert.ok(existsSync(new URL(`public/assets/${local}`, root)), `missing render: ${local}`)
  }
})
