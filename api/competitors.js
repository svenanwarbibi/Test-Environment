const https = require('https');

// Curated base list — real firms, manually validated
const SEED = [
  { name: "HYVE Innovation Research", location: "Munich, DE", jurisdiction: "de", archetype: "systematic", services: ["Innovation Management", "Projects"], size: "51–200", source: "curated" },
  { name: "Strategyzer", location: "Zurich, CH", jurisdiction: "ch", archetype: "methodology", services: ["Trainings", "Projects"], size: "11–50", source: "curated" },
  { name: "Innolytics", location: "Leipzig, DE", jurisdiction: "de", archetype: "methodology", services: ["Trainings", "Innovation Management"], size: "11–50", source: "curated" },
  { name: "Board of Innovation", location: "Antwerp, BE", jurisdiction: "be", archetype: "systematic", services: ["Projects", "Trainings"], size: "51–200", source: "curated" },
  { name: "Arthur D. Little", location: "Munich, DE", jurisdiction: "de", archetype: "large_sub", services: ["Innovation Management"], size: "501–1000", source: "curated" },
  { name: "Roland Berger", location: "Munich, DE", jurisdiction: "de", archetype: "large_sub", services: ["Innovation Management", "Projects"], size: "5001–10000", source: "curated" },
  { name: "EY-Parthenon", location: "Frankfurt, DE", jurisdiction: "de", archetype: "large_sub", services: ["Innovation Management"], size: "10001+", source: "curated" },
  { name: "McKinsey (Innovation Practice)", location: "Munich, DE", jurisdiction: "de", archetype: "large_sub", services: ["Innovation Management"], size: "10001+", source: "curated" },
  { name: "BCG Platinion", location: "Munich, DE", jurisdiction: "de", archetype: "large_sub", services: ["Projects", "Innovation Management"], size: "10001+", source: "curated" },
  { name: "Innosight", location: "Boston, MA", jurisdiction: "us", archetype: "systematic", services: ["Innovation Management", "Projects"], size: "51–200", source: "curated" },
  { name: "IDEO", location: "Palo Alto, CA", jurisdiction: "us", archetype: "design_build", services: ["Projects"], size: "201–500", source: "curated" },
  { name: "Doblin (Deloitte)", location: "London, GB", jurisdiction: "gb", archetype: "large_sub", services: ["Innovation Management", "Projects"], size: "10001+", source: "curated" },
  { name: "Fahrenheit 212 (Capgemini)", location: "New York, NY", jurisdiction: "us", archetype: "large_sub", services: ["Projects"], size: "10001+", source: "curated" },
  { name: "Designit (Wipro)", location: "Copenhagen, DK", jurisdiction: "dk", archetype: "design_build", services: ["Projects"], size: "201–500", source: "curated" },
  { name: "Continuum (Capgemini)", location: "Boston, MA", jurisdiction: "us", archetype: "design_build", services: ["Projects"], size: "10001+", source: "curated" },
  { name: "Jump Associates", location: "San Mateo, CA", jurisdiction: "us", archetype: "systematic", services: ["Projects", "Innovation Management"], size: "51–200", source: "curated" },
  { name: "Innovation One", location: "London, GB", jurisdiction: "gb", archetype: "systematic", services: ["Innovation Management", "Trainings"], size: "11–50", source: "curated" },
  { name: "Idean (Capgemini)", location: "Helsinki, FI", jurisdiction: "fi", archetype: "design_build", services: ["Projects"], size: "10001+", source: "curated" },
];

const ARCHETYPES = {
  systematic:   { label: "Systematic Innovation Methodology", color: "#dc2626" },
  design_build: { label: "Design-and-Build Consultancy",       color: "#2563eb" },
  large_sub:    { label: "Large Firm / Innovation Sub-unit",   color: "#7c3aed" },
  methodology:  { label: "Methodology / Training Licensor",    color: "#059669" },
  unknown:      { label: "Unclassified",                       color: "#94a3b8" },
};

const MARKET_SIZING = {
  dachConsultingTotal: "€45bn",
  dachConsultingSource: "Lünendonk 2023",
  globalInnovationConsulting: "$8–12bn",
  globalSource: "Source Global Research 2023",
  dachAddressable: "Low hundreds of millions",
  confidence: "±30%",
  fmcgRdSpendGrowthEU: "+2.8% (2023)",
  fmcgRdSpendGrowthUS: "+6.2% (2023)",
};

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'IC3-Market-Intelligence/1.0', Accept: 'application/json' },
      timeout: 7000,
    }, (res) => {
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { reject(new Error('JSON parse failed')); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

const REGION_CONFIG = {
  dach: { jurisdictions: ['de', 'at', 'ch'], terms: ['Innovationsberatung', 'Innovationsmanagement'] },
  emea: { jurisdictions: ['gb', 'fr', 'nl', 'se'], terms: ['innovation consulting', 'innovation management'] },
  us:   { jurisdictions: ['us'],                   terms: ['innovation consulting'] },
};

async function fetchOpenCorporates(term, jurisdiction) {
  const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(term)}&jurisdiction_code=${jurisdiction}&per_page=10&inactive=false`;
  const data = await get(url);
  return (data.results?.companies || []).map((c) => ({
    name: c.company.name
      .toLowerCase()
      .replace(/\b\w/g, (ch) => ch.toUpperCase()),
    location: [c.company.registered_address?.city, jurisdiction.toUpperCase()].filter(Boolean).join(', '),
    jurisdiction,
    archetype: 'unknown',
    services: [],
    incorporated: c.company.incorporation_date?.slice(0, 4) || null,
    status: c.company.current_status || null,
    source: 'opencorporates',
    registrationNumber: c.company.company_number,
  }));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=1800');

  const region = (req.query.region || 'dach').toLowerCase();
  const config = REGION_CONFIG[region] || REGION_CONFIG.dach;

  // Seed base filtered by region
  const regionJurs = new Set(config.jurisdictions);
  const base = SEED.filter((c) => regionJurs.has(c.jurisdiction));

  // Try live fetch from OpenCorporates (first jurisdiction, first term only — keep it fast)
  let liveAdded = [];
  let liveError = null;
  try {
    const live = await fetchOpenCorporates(config.terms[0], config.jurisdictions[0]);
    const existingNames = new Set(base.map((c) => c.name.toLowerCase()));
    liveAdded = live.filter((c) => !existingNames.has(c.name.toLowerCase())).slice(0, 10);
  } catch (e) {
    liveError = e.message;
  }

  const companies = [...base, ...liveAdded];

  // Archetype summary
  const archetypeCounts = {};
  companies.forEach((c) => {
    const key = c.archetype || 'unknown';
    archetypeCounts[key] = (archetypeCounts[key] || 0) + 1;
  });

  res.json({
    region,
    companies,
    archetypeCounts,
    archetypes: ARCHETYPES,
    marketSizing: MARKET_SIZING,
    meta: {
      total: companies.length,
      curated: base.length,
      liveAdded: liveAdded.length,
      liveError,
      timestamp: new Date().toISOString(),
    },
  });
};
