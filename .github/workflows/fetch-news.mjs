import fs from 'fs'

function extractXML(html, id) {
  const re = new RegExp('<input[^>]*id="' + id + '"[^>]*value="([^]*?)"\\s*/?>')
  const m = html.match(re)
  if (!m) return ''
  return m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

function parseItems(xml, itemTag, sourceName) {
  const items = []
  const itemRe = new RegExp('<' + itemTag + '>[\\s\\S]*?<\\/' + itemTag + '>', 'g')
  let m
  while ((m = itemRe.exec(xml)) !== null) {
    const g = (tag) => {
      const r = new RegExp('<' + tag + '>([\\s\\S]*?)<\\/' + tag + '>')
      const x = m[0].match(r)
      return x ? x[1].trim() : ''
    }
    const link = g('link')
    const title = g('title')
    const displayDate = g('display_date')
    if (!title || !link) continue
    items.push({
      title,
      link: link.replace(/^https?:\/\/sc\.isd\.gov\.hk\/TuniS\//i, ''),
      description: (g('about') || title).slice(0, 200),
      pubDate: displayDate || g('date'),
      source: sourceName,
    })
  }
  return items
}

async function main() {
  const html = fs.readFileSync('edb_all.html', 'utf8')
  let all = []
  const categories = [
    { id: 'whatsnewsXML', tag: 'whatsnews_item', name: '教育局最新消息' },
    { id: 'pressXML', tag: 'press_item', name: '教育局新聞公報' },
    { id: 'sedXML', tag: 'sed_item', name: '教育局局長演辭' },
    { id: 'psedXML', tag: 'psed_item', name: '教育局常任秘書長演辭' },
  ]
  for (const c of categories) {
    try {
      const xml = extractXML(html, c.id)
      if (!xml) { console.log('SKIP:', c.name, '(no data)'); continue }
      const items = parseItems(xml, c.tag, c.name)
      all = all.concat(items)
      console.log('OK:', c.name, items.length)
    } catch (e) {
      console.log('FAIL:', c.name, e.message)
    }
  }
  all.sort((a, b) => {
    const da = a.pubDate.replace(/[/]/g, '-')
    const db = b.pubDate.replace(/[/]/g, '-')
    return new Date(db) - new Date(da)
  })
  all = all.slice(0, 50)
  fs.writeFileSync('news-data.json', JSON.stringify({ items: all, updated: new Date().toISOString() }, null, 2))
  console.log('Saved', all.length, 'items')
}

main().catch(e => {
  console.error('FATAL:', e.message)
  fs.writeFileSync('news-data.json', JSON.stringify({ items: [], updated: new Date().toISOString(), error: e.message }, null, 2))
  process.exitCode = 0
})
