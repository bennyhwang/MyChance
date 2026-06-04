import fs from 'fs'

function parseRSS(filePath, sourceName, eduFilter) {
  const xml = fs.readFileSync(filePath + '', 'utf8')
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
  const sources = [
    { file: 'rss_edb_press.xml', name: '教育局新聞稿' },
    { file: 'rss_edb_news.xml', name: '教育局最新消息' },
    { file: 'rss_mingpao.xml', name: '明報教育' },
    { file: 'rss_stheadline.xml', name: '星島頭條', eduFilter: true },
  ]
  for (const s of sources) {
    try {
      const items = parseRSS(s.file, s.name, s.eduFilter)
      all = all.concat(items)
      console.log('OK:', s.name, items.length)
    } catch (e) {
      console.log('FAIL:', s.name, e.message)
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
