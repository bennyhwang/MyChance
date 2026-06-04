import https from 'https'
import http from 'http'
import fs from 'fs'

const SOURCES = [
  { url: 'http://www.edb.gov.hk/tc/press_release_rss.xml', name: '教育局新聞稿' },
  { url: 'http://www.edb.gov.hk/tc/whats_new_rss.xml', name: '教育局最新消息' },
  { url: 'https://life.mingpao.com/rss/lf/edu', name: '明報教育' },
  { url: 'https://www.hk01.com/rss/教育', name: '香港01' },
]

function fetchURL(url) {
  const mod = url.startsWith('https') ? https : http
  return new Promise((resolve, reject) => {
    const req = mod.get(url, { timeout: 15000 }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve(data))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

function parseRSS(xml, sourceName) {
  const items = []
  const itemRe = /<item>[\s\S]*?<\/item>/g
  let m
  while ((m = itemRe.exec(xml)) !== null) {
    const g = (tag) => {
      const r = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>')
      const x = m[0].match(r)
      return x ? x[1].trim().replace(/<[^>]+>/g, '') : ''
    }
    items.push({
      title: g('title'),
      link: g('link'),
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
      all = all.concat(parseRSS(xml, src.name))
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

main()
