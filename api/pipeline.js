// Module 6: Market Fit — Opportunity Scoring Engine
const callClaude = require('./_claude');
// Scores opportunities on 4 dimensions (1–5) and returns ranked pipeline.

const BASE_OPPORTUNITIES = [
  { id: 'ppwr_packaging',   name: 'PPWR Compliance Innovation (Packaging Mfr.)',     pillar: 'Projects',            timeline: '2025 Q2', estimatedValue: '€60–120k', methodFit: 5, refFit: 4, deliveryFit: 5, commercialFit: 4 },
  { id: 'csrd_fmcg',        name: 'CSRD Innovation Pipeline (Large FMCG)',           pillar: 'Innovation Mgmt',     timeline: '2025 Q1', estimatedValue: '€100–250k/yr', methodFit: 5, refFit: 5, deliveryFit: 4, commercialFit: 5 },
  { id: 'ma_harmonisation', name: 'Post-M&A Innovation Harmonisation',               pillar: 'Projects',            timeline: '2025 Q3', estimatedValue: '€80–150k', methodFit: 4, refFit: 3, deliveryFit: 4, commercialFit: 4 },
  { id: 'adt_training',     name: 'ADT Methodology Training Rollout (L&D)',          pillar: 'Trainings',           timeline: '2025 Q2', estimatedValue: '€20–50k', methodFit: 5, refFit: 4, deliveryFit: 5, commercialFit: 3 },
  { id: 'us_expansion',     name: 'US CPG Innovation Management (ABInBev network)', pillar: 'Innovation Mgmt',     timeline: '2025 Q4', estimatedValue: '€150–300k/yr', methodFit: 5, refFit: 4, deliveryFit: 3, commercialFit: 5 },
  { id: 'digital_conv',     name: 'Physical-Digital Convergence Projects',           pillar: 'Projects',            timeline: '2026 Q1', estimatedValue: '€70–130k', methodFit: 3, refFit: 2, deliveryFit: 3, commercialFit: 4 },
  { id: 'sustainability',   name: 'Net-Zero Innovation Pipeline (FMCG)',             pillar: 'Projects',            timeline: '2025 Q2', estimatedValue: '€50–100k', methodFit: 5, refFit: 5, deliveryFit: 4, commercialFit: 3 },
  { id: 'health_check',     name: 'Health Check to Retainer Conversion Pipeline',   pillar: 'Innovation Mgmt',     timeline: '2025 Q1', estimatedValue: '€100k/yr', methodFit: 4, refFit: 4, deliveryFit: 5, commercialFit: 4 },
  { id: 'mid_market',       name: 'Mid-Market Innovation Sprint (€500M–€2bn CPG)',  pillar: 'Projects',            timeline: '2025 Q3', estimatedValue: '€25–50k', methodFit: 4, refFit: 3, deliveryFit: 5, commercialFit: 3 },
  { id: 'packaging_audit',  name: 'Productised Packaging Innovation Audit',         pillar: 'Projects',            timeline: '2025 Q2', estimatedValue: '€10–20k', methodFit: 5, refFit: 4, deliveryFit: 5, commercialFit: 2 },
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600');

  // Allow client to pass custom scores as query params: ?id_methodFit=3&id_refFit=4...
  const { query } = req;

  const opportunities = BASE_OPPORTUNITIES.map((opp) => {
    const mf  = parseInt(query[`${opp.id}_methodFit`]   || opp.methodFit,   10);
    const rf  = parseInt(query[`${opp.id}_refFit`]      || opp.refFit,      10);
    const df  = parseInt(query[`${opp.id}_deliveryFit`] || opp.deliveryFit, 10);
    const cf  = parseInt(query[`${opp.id}_commercialFit`]|| opp.commercialFit, 10);
    const total = mf + rf + df + cf;
    const priority = total >= 16 ? 'A' : total >= 12 ? 'B' : 'C';
    return { ...opp, methodFit: mf, refFit: rf, deliveryFit: df, commercialFit: cf, totalScore: total, priority };
  });

  opportunities.sort((a, b) => b.totalScore - a.totalScore);

  const gaps = opportunities
    .filter((o) => o.methodFit + o.refFit >= 8 && o.deliveryFit + o.commercialFit < 7)
    .map((o) => ({ name: o.name, issue: o.deliveryFit < 3 ? 'Delivery capacity' : 'Commercial fit / price point' }));

  // Claude: strategic next-action recommendation
  let claudeInsight = null;
  try {
    const top5 = opportunities.slice(0, 5).map((o) => `${o.name} (score ${o.totalScore}/20, ${o.pillar}, ${o.estimatedValue})`).join('\n');
    const raw = await callClaude(
      'You are a strategic advisor for IC-3, a 2.5-FTE boutique innovation consultancy for FMCG/CPG/packaging. Respond with valid JSON only — no markdown.',
      `Top-ranked opportunities:\n${top5}\n\nRespond as JSON: {"nextAction":"...","bestOpportunity":"...","quickWin":"...","watchout":"..."}`
    );
    claudeInsight = JSON.parse(raw);
  } catch (_) { /* non-fatal */ }

  res.json({
    opportunities,
    gaps,
    claudeInsight,
    summary: {
      priorityA: opportunities.filter((o) => o.priority === 'A').length,
      priorityB: opportunities.filter((o) => o.priority === 'B').length,
      priorityC: opportunities.filter((o) => o.priority === 'C').length,
      topOpportunity: opportunities[0]?.name,
    },
    timestamp: new Date().toISOString(),
  });
};
