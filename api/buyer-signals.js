const https = require('https');
const callClaude = require('./_claude');

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'IC3-Market-Intelligence/1.0', Accept: 'text/xml,application/rss+xml' },
      timeout: 7000,
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function parseJobRSS(xml, source) {
  const jobs = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[1];
    const title = strip(b, 'title');
    const link  = strip(b, 'link');
    const desc  = strip(b, 'description')?.replace(/<[^>]+>/g, '').slice(0, 300);
    const date  = strip(b, 'pubDate');
    if (title) jobs.push({ title, link, description: desc, pubDate: date, source });
  }
  return jobs;
}

function strip(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i'));
  return m?.[1]?.trim() || null;
}

// Signal classification: what do job titles tell us about buyer expectations?
const JOB_SIGNALS = [
  { pattern: /innovation manag/i,       signal: 'Internal innovation capability gap',   persona: 'Head of Innovation / VP R&D', priority: 'high' },
  { pattern: /packaging innovation/i,    signal: 'Packaging transformation need',        persona: 'Head of Packaging', priority: 'high' },
  { pattern: /design thinking/i,         signal: 'Internal DT capability build (push)',  persona: 'L&D / HR', priority: 'medium' },
  { pattern: /product development/i,     signal: 'New product pipeline pressure',        persona: 'VP R&D / Project Teams', priority: 'high' },
  { pattern: /sustainability innov/i,    signal: 'Sustainability-driven innovation need', persona: 'Head of Sustainability', priority: 'high' },
  { pattern: /open innovation/i,         signal: 'Ecosystem / partner-sourced innovation', persona: 'Head of Innovation', priority: 'medium' },
  { pattern: /digital innov/i,           signal: 'Physical-digital convergence need',    persona: 'CDO / Head of Digital', priority: 'medium' },
  { pattern: /r&d manager|r&d director/i,signal: 'R&D capability investment',            persona: 'VP R&D', priority: 'medium' },
  { pattern: /circular economy/i,        signal: 'PPWR / circular compliance need',      persona: 'Head of Sustainability', priority: 'high' },
];

function classifyJob(title, desc) {
  for (const rule of JOB_SIGNALS) {
    if (rule.pattern.test(title) || rule.pattern.test(desc || '')) {
      return { signal: rule.signal, persona: rule.persona, priority: rule.priority };
    }
  }
  return { signal: 'General innovation / R&D hiring', persona: 'Unknown', priority: 'low' };
}

// Indeed job RSS feeds (public, no auth required)
const JOB_FEEDS = [
  { url: 'https://de.indeed.com/rss?q=innovation+manager&l=Deutschland&fromage=14', label: 'Innovation Manager – DE' },
  { url: 'https://de.indeed.com/rss?q=packaging+innovation&fromage=14',             label: 'Packaging Innovation – DE' },
  { url: 'https://de.indeed.com/rss?q=innovationsmanager&l=Deutschland&fromage=14', label: 'Innovationsmanager – DE' },
];

// Curated buyer persona definitions from the plan
const PERSONAS = [
  { id: 'vp_innovation', title: 'VP Innovation at €2bn+ FMCG', trigger: 'PPWR compliance deadline + net-zero gap', budget: '€100k–€300k/yr', format: 'Innovation Management retainer', urgency: 'high' },
  { id: 'head_packaging', title: 'Head of Packaging at mid-size CPG', trigger: 'Packaging line modernisation + regulation', budget: '€50k–€100k/project', format: 'Innovation Project', urgency: 'high' },
  { id: 'ld_director', title: 'L&D Director at large enterprise', trigger: 'Internal capability build-up for innovation', budget: '€20k–€60k/programme', format: 'Innovation Trainings', urgency: 'medium' },
  { id: 'coo', title: 'COO / CFO under cost pressure', trigger: 'CapEx reduction + structured R&D ROI demand', budget: '€80k–€200k', format: 'Innovation Management / Projects', urgency: 'medium' },
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800');

  const jobs  = [];
  const errors = [];

  await Promise.allSettled(
    JOB_FEEDS.map(async (feed) => {
      try {
        const xml = await fetchURL(feed.url);
        parseJobRSS(xml, feed.label).slice(0, 15).forEach((job) => {
          jobs.push({ ...job, ...classifyJob(job.title, job.description) });
        });
      } catch (e) {
        errors.push({ feed: feed.label, error: e.message });
      }
    })
  );

  // Sort by priority
  const order = { high: 0, medium: 1, low: 2 };
  jobs.sort((a, b) => (order[a.priority] || 2) - (order[b.priority] || 2));

  // Count by persona
  const personaCounts = {};
  jobs.forEach((j) => { personaCounts[j.persona] = (personaCounts[j.persona] || 0) + 1; });

  // Claude: synthesise buyer patterns and IC-3 fit
  let claudeInsight = null;
  try {
    const titles = jobs.slice(0, 15).map((j) => j.title).join(', ');
    const raw = await callClaude(
      'You are a market intelligence analyst for IC-3, a boutique innovation consultancy for FMCG/CPG/packaging. Respond with valid JSON only — no markdown.',
      `These innovation-related roles are being hired in Germany: ${titles}. What do they signal about what buyers need from external innovation partners? Respond as JSON: {"topNeed":"...","buyerPatterns":["...","...","..."],"ic3Fit":"high|medium|low","gap":"...","recommendation":"..."}`
    );
    claudeInsight = JSON.parse(raw);
  } catch (_) { /* non-fatal */ }

  res.json({ jobs: jobs.slice(0, 40), personaCounts, personas: PERSONAS, claudeInsight, errors, timestamp: new Date().toISOString() });
};
