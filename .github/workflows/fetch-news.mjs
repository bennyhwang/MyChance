import https from 'https'
import http from 'http'
import fs from 'fs'

const SOURCES = [
  { url: 'https://www.edb.gov.hk/tc/press_release_rss.xml', name: '教育局新聞稿' },
  { url: 'https://www.edb.gov.hk/tc/whats_new_rss.xml', name: '教育局最新消息' },
  { url: 'https://life.mingpao.com/rss/lf/edu', name: '明報教育' },
  { url: 'https://www.stheadline.com/rss', name: '星島頭條', eduFilter: true },
]

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const req = mod.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function parseRSS(xml, sourceName, eduFilter) {
  const items = []
  const itemRe = /<item>[\s\S]*?<\/item>/g
  let m
  while ((m = itemRe.exec(xml)) !== null) {
    const g = (tag) => {
      const r = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>')
      const x = m[0].match(r)
      return x ? x[1].trim().replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim() : ''
    }
    const link = g('link')
    if (eduFilter && !link.match(/\/edu-news\/|\/local-school\/|\/education\//)) continue
    items.push({
      title: g('title'),
      link: link,
      description: g('description').slice(0, 200),
      pubDate: g('pubDate'),
      source: sourceName,
    })
  }
  return items
}

async function main() {
  let all = []
  for (const src of SOURCES) {
    try {
      const xml = await fetchURL(src.url)
      all = all.concat(parseRSS(xml, src.name, src.eduFilter))
      console.log('OK:', src.name)
    } catch (e) {
      console.log('FAIL:', src.name, e.message)
    }
  }
  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
  all = all.slice(0, 50)
  fs.writeFileSync('news-data.json', JSON.stringify({ items: all, updated: new Date().toISOString() }, null, 2))
  console.log('Saved', all.length, 'items')
}

main().catch(e => {
  console.error('FATAL:', e.message)
  fs.writeFileSync('news-data.json', JSON.stringify({ items: [], updated: new Date().toISOString(), error: e.message }, null, 2))
  process.exitCode = 0
})
