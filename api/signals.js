const https = require('https');
const callClaude = require('./_claude');

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'IC3-Market-Intelligence/1.0', Accept: 'text/xml,application/rss+xml' },
      timeout: 6000,
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function parseRSS(xml, sourceName) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const block = m[1];
    const title = strip(block, 'title');
    const link  = strip(block, 'link') || attr(block, 'link', 'href');
    const desc  = strip(block, 'description')?.replace(/<[^>]+>/g, '').slice(0, 250);
    const date  = strip(block, 'pubDate') || strip(block, 'dc:date');
    if (title) items.push({ title, link, description: desc, pubDate: date, source: sourceName });
  }
  return items;
}

function strip(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return m?.[1]?.trim() || null;
}

function attr(xml, tag, attrName) {
  const m = xml.match(new RegExp(`<${tag}[^>]+${attrName}="([^"]+)"`, 'i'));
  return m?.[1] || null;
}

const SIGNAL_RULES = [
  { cat: 'regulatory', label: 'Regulatory', color: '#7c3aed', icon: '📋', keywords: ['PPWR','CSRD','ESPR','regulation','compliance','EU packaging','sustainable products','packaging waste','ecodesign','net zero'] },
  { cat: 'ma',         label: 'M&A',        color: '#dc2626', icon: '🤝', keywords: ['acquisition','acquires','merger','takeover','buys ','acquired','deal value','private equity','buyout'] },
  { cat: 'capex',      label: 'Capex / R&D',color: '#2563eb', icon: '🏭', keywords: ['investment','R&D','plant','factory','production line','capex','research spend','new facility','innovation fund'] },
  { cat: 'leadership', label: 'Leadership', color: '#059669', icon: '👤', keywords: ['appoints','appoint','names ','hires ','CDO','CIO','VP Innovation','Chief Innovation','Head of Packaging','Head of Sustainability','new CEO','new CFO'] },
  { cat: 'events',     label: 'Events',     color: '#d97706', icon: '📅', keywords: ['Interpack','FACHPACK','PackExpo','Consumer Goods Forum','innovation summit','packaging summit','CFIA'] },
  { cat: 'failure',    label: 'Restructuring Signal', color: '#64748b', icon: '⚠️', keywords: ['restructur','layoffs','job cuts','cancelled','abandon','discontinue','write-off','innovation team'] },
];

function categorise(title, desc) {
  const text = `${title} ${desc || ''}`.toLowerCase();
  for (const rule of SIGNAL_RULES) {
    if (rule.keywords.some((k) => text.includes(k.toLowerCase()))) {
      return { cat: rule.cat, label: rule.label, color: rule.color, icon: rule.icon };
    }
  }
  return { cat: 'general', label: 'General Business', color: '#94a3b8', icon: '📰' };
}

const SOURCES = [
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC Business' },
  { url: 'https://www.foodnavigator.com/rss/editorial',    name: 'FoodNavigator' },
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=900');

  const allItems = [];
  const errors   = [];

  await Promise.allSettled(
    SOURCES.map(async (src) => {
      try {
        const xml = await fetchURL(src.url);
        parseRSS(xml, src.name).slice(0, 30).forEach((item) => {
          allItems.push({ ...item, ...categorise(item.title, item.description) });
        });
      } catch (e) {
        errors.push({ source: src.name, error: e.message });
      }
    })
  );

  allItems.sort((a, b) => {
    if (a.cat === 'general' && b.cat !== 'general') return 1;
    if (a.cat !== 'general' && b.cat === 'general') return -1;
    return new Date(b.pubDate || 0) - new Date(a.pubDate || 0);
  });

  // Count by category
  const counts = {};
  allItems.forEach((i) => { counts[i.cat] = (counts[i.cat] || 0) + 1; });

  // Claude: interpret top signals for IC-3
  let claudeInsight = null;
  try {
    const headlines = allItems.slice(0, 12).map((i) => `[${i.label}] ${i.title}`).join('\n');
    const raw = await callClaude(
      'You are a market intelligence analyst for IC-3, a boutique innovation consultancy for FMCG/CPG/packaging. Respond with valid JSON only — no markdown.',
      `These are the latest market signals:\n${headlines}\n\nRespond as JSON: {"topSignal":"...","ic3Action":"...","urgency":"high|medium|low","rationale":"..."}`
    );
    claudeInsight = JSON.parse(raw);
  } catch (_) { /* non-fatal */ }

  res.json({
    signals: allItems.slice(0, 50),
    counts,
    categories: SIGNAL_RULES,
    claudeInsight,
    errors,
    timestamp: new Date().toISOString(),
  });
};
