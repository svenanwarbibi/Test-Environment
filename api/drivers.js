module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  const pull = [
    { id: 'regulatory', name: 'Regulatory Pressure (PPWR, CSRD, ESPR)', evidence: '600,000+ companies affected by PPWR; compliance deadlines 2025–2030', source: 'European Commission 2022', confidence: 5, trend: 'up', note: 'Enforcement timelines confirmed 2024.' },
    { id: 'sustainability_gap', name: 'Sustainability Commitments Outpacing Capabilities', evidence: '80% of top-50 FMCG have net-zero targets; <30% have a concrete innovation pipeline', source: 'CDP 2023 · SBTi', confidence: 4, trend: 'up', note: 'Gap widening as 2025 CSRD reporting begins.' },
    { id: 'productivity_gap', name: 'Innovation Productivity Gap', evidence: 'New product success rates declined from c.25% to c.15% over 10 years', source: 'Nielsen IQ 2018–2023', confidence: 4, trend: 'stable', note: 'R&D-to-revenue ratio flat at 1.5–2.5%.' },
    { id: 'talent', name: 'Talent Scarcity in Innovation Roles', evidence: 'Innovation roles take 30–50% longer to fill in DACH than general management', source: 'Hays Salary Guide 2024', confidence: 3, trend: 'up', note: 'AI tools creating new hybrid role demand.' },
    { id: 'cost_pressure', name: 'Cost Pressure Demanding Structured Innovation', evidence: 'Process optimisation in top-3 priorities at 75% of firms', source: 'Lünendonk 2023 · Gartner CIO Survey 2023', confidence: 4, trend: 'stable', note: 'CapEx reduction framing resonates with buyers.' },
    { id: 'ma', name: 'Post-M&A Innovation Harmonisation Need', evidence: 'Global FMCG M&A deal value c.$89bn in 2023', source: 'PwC Global M&A Trends 2024', confidence: 4, trend: 'stable', note: 'Integration window typically 12–24 months post-close.' },
  ];

  const push = [
    { id: 'inhouse', name: 'In-house Capability Build-up', evidence: '66% of companies building internal cross-functional innovation teams', source: 'Lünendonk 2023', confidence: 4, trend: 'up', note: 'Creates a "build-vs-buy" decision at client level.' },
    { id: 'budget', name: 'Budget Tightening in Discretionary Consulting', evidence: 'DACH consulting growth slowed from 8–10% (2021–22) to 3–5% (2023–24)', source: 'Lünendonk 2023 · BDU 2024', confidence: 4, trend: 'stable', note: 'Innovation consulting classified as discretionary at most firms.' },
    { id: 'ai', name: 'AI Substitution of Early-Stage Ideation', evidence: 'GenAI tools compressing value of generic ideation workshops', source: 'McKinsey State of AI 2024', confidence: 3, trend: 'up', note: 'Physical product innovation less affected than digital/service.' },
    { id: 'price', name: 'Price Pressure from Nearshore Competitors', evidence: '30–50% lower day rates from competitors in lower-cost markets', source: 'Competitor intelligence 2023', confidence: 3, trend: 'up', note: 'Affects project work more than management retainers.' },
    { id: 'dt_fatigue', name: '"Design Thinking Fatigue"', evidence: '78% of large enterprises claim internal design thinking capability', source: 'McKinsey Design Index · Competitor intelligence 2023', confidence: 4, trend: 'up', note: 'Generic methodology positioning is eroding; specialisation required.' },
  ];

  // Net pull vs push score per vertical (sum of confidence × direction)
  const verticals = [
    { name: 'FMCG / CPG',                    pullScore: 22, pushScore: 11, verdict: 'Pull dominates' },
    { name: 'Packaging Manufacturers',         pullScore: 25, pushScore:  9, verdict: 'Pull dominates strongly (PPWR)' },
    { name: 'Adjacent (Auto, Chem, Sanitary)', pullScore: 16, pushScore: 14, verdict: 'Balanced — selective targeting advised' },
  ];

  res.json({ pull, push, verticals, timestamp: new Date().toISOString() });
};
