import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { languages, isLanguage, resolveLocale, storedLanguage, loadLanguage, saveLanguage } from '../src/i18n/language.ts'

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8')
const catalogs = Object.fromEntries(languages.map(({ code }) => [code, JSON.parse(read(`../src/i18n/locales/${code}.json`))]))
const englishKeys = Object.keys(catalogs['en-US']).sort()

test('all eight locales have the full catalog with no empty translations', () => {
  assert.equal(languages.length, 8)
  for (const [code, catalog] of Object.entries(catalogs)) {
    assert.deepEqual(Object.keys(catalog).sort(), englishKeys, code)
    for (const [key, value] of Object.entries(catalog)) {
      assert.equal(typeof value, 'string', `${code}: ${key}`)
      assert.ok(value.trim(), `${code}: ${key}`)
    }
  }
})

test('all user-facing sections, screenshots, themes and FAQ answers are translated', () => {
  for (const [code, catalog] of Object.entries(catalogs)) {
    if (code === 'en-US') continue
    for (const key of ['hero.title1', 'hero.description', 'philosophy.observeDescription', 'showcase.description',
      'screenshots.workspace.description', 'capabilities.gitDescription', 'themes.description',
      'architecture.description', 'download.description', 'community.description', 'faq.0.answer',
      'faq.1.answer', 'faq.2.answer', 'faq.3.answer', 'footer.madeFor', 'meta.title']) {
      assert.notEqual(catalog[key], catalogs['en-US'][key], `${code}: ${key} must not fall back to English`)
    }
  }
})

test('all literal and data-driven translation keys exist', () => {
  for (const path of ['../src/App.vue', '../src/i18n/index.ts']) {
    for (const match of read(path).matchAll(/\bt\('([^']+)'\)/g)) assert.ok(englishKeys.includes(match[1]), match[1])
  }
  for (const match of read('../src/data.ts').matchAll(/(?:title|description|category): '([^']+)'/g)) {
    assert.ok(englishKeys.includes(match[1]), match[1])
  }
  for (let index = 0; index < 4; index++) {
    assert.ok(englishKeys.includes(`faq.${index}.question`))
    assert.ok(englishKeys.includes(`faq.${index}.answer`))
  }
  assert.ok(!read('../src/App.vue').includes('tx('), 'no two-language helper remains')
})

test('automatic detection matches Pi-Harness language families and Chinese scripts', () => {
  for (const [tag, expected] of [
    ['en-GB', 'en-US'], ['zh', 'zh-CN'], ['zh-CN', 'zh-CN'], ['zh-SG', 'zh-CN'], ['zh-Hans', 'zh-CN'],
    ['zh-TW', 'zh-TW'], ['zh-HK', 'zh-TW'], ['zh-MO', 'zh-TW'], ['zh-Hant', 'zh-TW'], ['zh-Hant-TW', 'zh-TW'],
    ['ZH_hant_HK', 'zh-TW'], ['ja', 'ja-JP'], ['ko-KR', 'ko-KR'], ['ru-RU', 'ru-RU'],
    ['fr-CA', 'fr-FR'], ['de-AT', 'de-DE'], ['es-ES', 'en-US'], ['', 'en-US'],
  ]) assert.equal(resolveLocale('auto', tag), expected, tag)
})

test('an explicit language overrides the system language', () => {
  for (const { code } of languages) assert.equal(resolveLocale(code, 'ja-JP'), code)
})

test('saved choices migrate from the previous Chinese/English switch', () => {
  assert.equal(storedLanguage('zh'), 'zh-CN')
  assert.equal(storedLanguage('en'), 'en-US')
  for (const { code } of languages) assert.equal(storedLanguage(code), code)
  for (const invalid of [null, '', 'pt-BR', '<script>', 'en-us']) assert.equal(storedLanguage(invalid), 'auto')
  assert.equal(storedLanguage('auto'), 'auto')
  assert.equal(isLanguage(undefined), false)
})


test('loading and saving still work when browser storage is restricted', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: {
      get localStorage() { throw new Error('Storage denied') },
    } })
    assert.equal(loadLanguage(), 'auto')
    assert.doesNotThrow(() => saveLanguage('fr-FR'))
    let saved
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: {
      getItem: () => 'zh',
      setItem: (key, value) => { saved = [key, value] },
    } } })
    assert.equal(loadLanguage(), 'zh-CN')
    saveLanguage('de-DE')
    assert.deepEqual(saved, ['pi-harness-site-locale', 'de-DE'])
  } finally {
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else delete globalThis.window
  }
})
