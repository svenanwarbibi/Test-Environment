const https = require('https');

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

function parseRSS(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[1];
    const title = strip(b, 'title');
    const link  = strip(b, 'link');
    const desc  = strip(b, 'description')?.replace(/<[^>]+>/g, '').slice(0, 200);
    if (title) items.push({ title, link, description: desc });
  }
  return items;
}

function strip(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return m?.[1]?.trim() || null;
}

const SHIFTS = [
  {
    id: 'subscription', label: 'Project-based → Subscription / Retainer',
    alignment: 'aligned', ic3Note: 'Innovation Management pillar (from €100k/yr) already captures this.',
    keywords: ['subscription consulting','retainer','advisory relationship','recurring revenue'],
    evidence: 'Source Global Research 2023 · Lünendonk 2023',
  },
  {
    id: 'outcomes', label: 'Methodology Purchase → Outcome Guarantee',
    alignment: 'partial', ic3Note: 'IC-3 has quantified outcomes (30% CapEx cut, €30M pipeline) but needs systematic ROI reporting.',
    keywords: ['ROI consulting','outcome-based consulting','measurable results','impact measurement'],
    evidence: 'Gartner CIO Survey 2023 · Competitor intelligence 2023',
  },
  {
    id: 'specialisation', label: 'Generic Innovation → Hyper-specialisation',
    alignment: 'partial', ic3Note: 'ADT methodology and physical product focus is a genuine niche — "innovation consulting" positioning is too broad.',
    keywords: ['specialist consulting','niche consulting','vertical consulting','deep expertise'],
    evidence: 'Competitor intelligence 2023',
  },
  {
    id: 'digital', label: 'Physical-only → Physical-Digital Convergence',
    alignment: 'risk', ic3Note: 'Planned digital/services expansion is directionally correct; requires partnerships or selective hiring.',
    keywords: ['IoT packaging','smart packaging','digital twin','connected products','Industry 4.0'],
    evidence: 'McKinsey Tech Trends 2023 · Interpack trend reports',
  },
  {
    id: 'sustainability', label: 'Sustainability as Add-on → Default',
    alignment: 'aligned', ic3Note: 'Strong sustainability references (Omnia Green Gain, net-zero pipeline). Position as cross-cutting capability.',
    keywords: ['sustainable innovation','circular economy','net zero product','packaging sustainability','green innovation'],
    evidence: 'CDP 2023 · PPWR impact assessments',
  },
  {
    id: 'us_growth', label: 'EU-centric → US FMCG Investment Growth',
    alignment: 'risk', ic3Note: 'US CPG R&D spend +6.2% vs +2.8% EU (2023). IC-3 has US references (ABInBev) but no presence.',
    keywords: ['US FMCG innovation','CPG R&D investment','US consumer goods','American packaged goods'],
    evidence: 'Statista · IRI/Circana CPG reports',
  },
];

const ALIGNMENT_META = {
  aligned:  { label: 'Aligned',         color: '#059669', icon: '✅' },
  partial:  { label: 'Partial / Action needed', color: '#d97706', icon: '⚠️' },
  risk:     { label: 'Gap / Risk',       color: '#dc2626', icon: '🚨' },
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800');

  // Try to fetch a news feed and match items to shifts
  let newsItems = [];
  try {
    const xml = await fetchURL('https://feeds.bbci.co.uk/news/business/rss.xml');
    newsItems = parseRSS(xml).slice(0, 40);
  } catch (_) { /* fail silently */ }

  const shifts = SHIFTS.map((s) => {
    const matched = newsItems.filter((item) =>
      s.keywords.some((k) => `${item.title} ${item.description || ''}`.toLowerCase().includes(k.toLowerCase()))
    ).slice(0, 2);

    return {
      ...s,
      alignmentMeta: ALIGNMENT_META[s.alignment],
      liveEvidence: matched,
    };
  });

  res.json({ shifts, alignmentMeta: ALIGNMENT_META, timestamp: new Date().toISOString() });
};
