// ── Sidebar active link ───────────────────────────────────────────────────────
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.sidebar a');
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove('active'));
      const a = document.querySelector(`.sidebar a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    }
  }),
  { rootMargin: '-20% 0px -70% 0px' }
);
sections.forEach((s) => observer.observe(s));

// ── Shared helpers ────────────────────────────────────────────────────────────
function setStatus(el, msg, isError = false) {
  el.className = `scan-status${isError ? ' error' : ''}`;
  el.textContent = msg;
}
function btn(id) { return document.getElementById(id); }
function el(id)  { return document.getElementById(id); }
function fmt(date) {
  if (!date) return '—';
  try { return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); }
  catch { return date.slice(0, 10); }
}
function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

// ── MODULE 1: Competitor Scan ─────────────────────────────────────────────────
let activeRegion = 'dach';
let allCompanies = [];

document.querySelectorAll('.region-btn').forEach((b) => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.region-btn').forEach((x) => x.classList.remove('active'));
    b.classList.add('active');
    activeRegion = b.dataset.region;
  });
});

btn('run-scan-btn')?.addEventListener('click', async () => {
  const runBtn = btn('run-scan-btn');
  const status = el('scan-status');
  const results = el('scan-results');
  runBtn.disabled = true;
  runBtn.innerHTML = '<span class="run-icon">⏳</span> Scanning…';
  status.classList.remove('hidden'); setStatus(status, `Fetching ${activeRegion.toUpperCase()} competitor data…`);
  results.classList.add('hidden');
  try {
    const data = await fetch(`/api/competitors?region=${activeRegion}`).then((r) => r.json());
    allCompanies = data.companies;
    renderSizingCards(data.marketSizing, 'sizing-cards');
    renderArchetypeBars(data.archetypeCounts, data.archetypes, data.meta.total, 'archetype-bars');
    renderCompetitorTable(data.companies, data.archetypes);
    setStatus(status, `✓ ${data.meta.total} companies — ${data.meta.liveAdded} live from OpenCorporates, ${data.meta.curated} curated.`);
    results.classList.remove('hidden');
    const note = el('live-note');
    if (data.meta.liveError) { note.textContent = `Note: ${data.meta.liveError}`; note.classList.remove('hidden'); }
    else note.classList.add('hidden');
  } catch (e) {
    setStatus(status, `Error: ${e.message}`, true);
  } finally {
    runBtn.disabled = false; runBtn.innerHTML = '<span class="run-icon">▶</span> Run Scan';
  }
});

el('company-search')?.addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  renderCompetitorTable(allCompanies.filter((c) => `${c.name} ${c.location} ${c.archetype}`.toLowerCase().includes(q)), {});
});

function renderSizingCards(ms, containerId) {
  el(containerId).innerHTML = `
    <div class="sizing-card"><div class="s-value">${ms.globalInnovationConsulting}</div><div class="s-label">Global Innovation Consulting</div><div class="s-source">${ms.globalSource}</div></div>
    <div class="sizing-card"><div class="s-value">${ms.dachConsultingTotal}</div><div class="s-label">DACH Consulting (total)</div><div class="s-source">${ms.dachConsultingSource}</div></div>
    <div class="sizing-card"><div class="s-value">${ms.dachAddressable}</div><div class="s-label">IC-3 Addressable (est.)</div><div class="s-source">Confidence: ${ms.confidence}</div></div>`;
}

function renderArchetypeBars(counts, archetypes, total, containerId) {
  el(containerId).innerHTML = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([key, count]) => {
    const at = archetypes?.[key] || { label: key, color: '#94a3b8' };
    const pct = Math.round((count / total) * 100);
    return `<div class="arch-bar-row">
      <div class="arch-bar-label">${at.label}</div>
      <div class="arch-bar-track"><div class="arch-bar-fill" style="width:${pct}%;background:${at.color}"></div></div>
      <div class="arch-bar-count">${count}</div>
    </div>`;
  }).join('');
}

function renderCompetitorTable(companies, archetypes) {
  el('results-count').textContent = `${companies.length} companies`;
  el('results-tbody').innerHTML = companies.map((c) => {
    const at = archetypes?.[c.archetype] || { label: c.archetype || '—', color: '#94a3b8' };
    const overlap = c.services?.length ? c.services.map((s) => `<span class="tag">${s}</span>`).join(' ') : '—';
    const chip = `<span class="source-chip ${c.source === 'curated' ? 'curated' : 'opencorporates'}">${c.source === 'curated' ? 'Curated' : 'Live'}</span>`;
    return `<tr>
      <td><strong>${c.name}</strong>${c.incorporated ? `<br><span style="font-size:.72rem;color:var(--muted)">est. ${c.incorporated}</span>` : ''}</td>
      <td>${c.location || '—'}</td>
      <td><span style="color:${at.color};font-weight:600;font-size:.8rem">${at.label}</span></td>
      <td style="font-size:.8rem">${overlap}</td>
      <td>${chip}</td>
    </tr>`;
  }).join('');
}

// ── MODULE 2: Signal Monitor ──────────────────────────────────────────────────
let allSignals = [];
let activeSignalCat = 'all';

btn('run-signals-btn')?.addEventListener('click', async () => {
  const runBtn = btn('run-signals-btn');
  const status = el('signals-status');
  runBtn.disabled = true; runBtn.innerHTML = '<span class="run-icon">⏳</span> Fetching…';
  status.classList.remove('hidden'); setStatus(status, 'Fetching live signals from BBC Business and FoodNavigator…');
  el('signals-results').classList.add('hidden');
  try {
    const data = await fetch('/api/signals').then((r) => r.json());
    allSignals = data.signals;

    // Build category filter
    const filterDiv = el('signals-cat-filter');
    filterDiv.innerHTML = `<button class="region-btn active" data-cat="all">All (${data.signals.length})</button>` +
      data.categories.map((c) => {
        const cnt = data.counts[c.cat] || 0;
        return cnt ? `<button class="region-btn" data-cat="${c.cat}" style="border-color:${c.color}">${c.icon} ${c.label} (${cnt})</button>` : '';
      }).join('');

    filterDiv.querySelectorAll('.region-btn').forEach((b) => {
      b.addEventListener('click', () => {
        filterDiv.querySelectorAll('.region-btn').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        activeSignalCat = b.dataset.cat;
        renderSignals(allSignals.filter((s) => activeSignalCat === 'all' || s.cat === activeSignalCat));
      });
    });

    renderSignals(data.signals);
    setStatus(status, `✓ ${data.signals.length} signals fetched. ${data.errors.length ? `${data.errors.length} source(s) unavailable.` : 'All sources OK.'}`);
    el('signals-results').classList.remove('hidden');
  } catch (e) {
    setStatus(status, `Error: ${e.message}`, true);
  } finally {
    runBtn.disabled = false; runBtn.innerHTML = '<span class="run-icon">▶</span> Fetch Signals';
  }
});

function renderSignals(signals) {
  el('signals-count').textContent = `${signals.length} signals`;
  el('signals-tbody').innerHTML = signals.map((s) => `<tr>
    <td><span class="badge" style="background:${s.color}22;color:${s.color}">${s.icon} ${s.label}</span></td>
    <td style="font-size:.82rem">${s.link ? `<a href="${s.link}" target="_blank" style="color:var(--blue-light)">${s.title}</a>` : s.title}</td>
    <td style="font-size:.78rem;color:var(--muted)">${s.source}</td>
    <td style="font-size:.78rem;white-space:nowrap">${fmt(s.pubDate)}</td>
  </tr>`).join('');
}

// ── MODULE 3: Driver Dashboard ────────────────────────────────────────────────
btn('run-drivers-btn')?.addEventListener('click', async () => {
  const runBtn = btn('run-drivers-btn');
  const status = el('drivers-status');
  runBtn.disabled = true; runBtn.innerHTML = '<span class="run-icon">⏳</span> Loading…';
  status.classList.remove('hidden'); setStatus(status, 'Loading validated pull/push driver analysis…');
  el('drivers-results').classList.add('hidden');
  try {
    const data = await fetch('/api/drivers').then((r) => r.json());

    const trendIcon = (t) => t === 'up' ? '<span class="trend-up">↑ Increasing</span>' : t === 'down' ? '<span class="trend-down">↓ Decreasing</span>' : '<span class="trend-stable">→ Stable</span>';

    const cards = (factors, type) => factors.map((f) => `
      <div class="driver-card ${type}">
        <div class="driver-name">${f.name}</div>
        <div class="confidence-stars">${stars(f.confidence)} ${trendIcon(f.trend)}</div>
        <div class="driver-evidence">${f.evidence}</div>
        <div class="driver-source">${f.source}</div>
        ${f.note ? `<div style="font-size:.75rem;margin-top:.3rem;color:var(--blue)">${f.note}</div>` : ''}
      </div>`).join('');

    el('drivers-grid').innerHTML =
      `<div style="grid-column:1/-1;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#059669">▲ Pull Factors — Creating Demand</div>` +
      cards(data.pull, 'pull') +
      `<div style="grid-column:1/-1;font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#dc2626;margin-top:.5rem">▼ Push Factors — Creating Headwinds</div>` +
      cards(data.push, 'push');

    el('verticals-chart').innerHTML = data.verticals.map((v) => {
      const total = v.pullScore + v.pushScore;
      const pullPct = Math.round((v.pullScore / total) * 100);
      const pushPct = 100 - pullPct;
      return `<div class="vertical-row">
        <div class="vertical-label">${v.name}</div>
        <div class="vertical-track">
          <div class="vertical-pull" style="width:${pullPct}%" title="Pull: ${v.pullScore}"></div>
          <div class="vertical-push" style="width:${pushPct}%" title="Push: ${v.pushScore}"></div>
        </div>
        <div class="vertical-verdict">${v.verdict}</div>
      </div>`;
    }).join('') + `<p style="font-size:.72rem;color:var(--muted);margin-top:.5rem">Green = Pull strength · Red = Push strength</p>`;

    setStatus(status, `✓ ${data.pull.length} pull factors · ${data.push.length} push factors · ${data.verticals.length} verticals assessed.`);
    el('drivers-results').classList.remove('hidden');
  } catch (e) {
    setStatus(status, `Error: ${e.message}`, true);
  } finally {
    runBtn.disabled = false; runBtn.innerHTML = '<span class="run-icon">▶</span> Load Driver Analysis';
  }
});

// ── MODULE 4: Market Shift Tracker ───────────────────────────────────────────
btn('run-shifts-btn')?.addEventListener('click', async () => {
  const runBtn = btn('run-shifts-btn');
  const status = el('shifts-status');
  runBtn.disabled = true; runBtn.innerHTML = '<span class="run-icon">⏳</span> Scanning…';
  status.classList.remove('hidden'); setStatus(status, 'Fetching shift data and scanning for live evidence…');
  el('shifts-grid').classList.add('hidden');
  try {
    const data = await fetch('/api/shifts').then((r) => r.json());
    const grid = el('shifts-grid');
    grid.innerHTML = data.shifts.map((s) => {
      const evidence = s.liveEvidence?.length
        ? s.liveEvidence.map((e) => `<div class="shift-evidence-item">📰 ${e.link ? `<a href="${e.link}" target="_blank">${e.title}</a>` : e.title}</div>`).join('')
        : '<div class="shift-evidence-item" style="color:var(--muted)">No live news match found — check manually.</div>';
      return `<div class="shift-card" style="border-left:4px solid ${s.alignmentMeta.color}">
        <div class="shift-status" style="color:${s.alignmentMeta.color}">${s.alignmentMeta.icon} ${s.alignmentMeta.label}</div>
        <div class="shift-title">${s.label}</div>
        <div class="shift-note">${s.ic3Note}</div>
        <div style="font-size:.72rem;color:var(--muted);margin-bottom:.35rem">Evidence: ${s.evidence}</div>
        <div style="font-size:.72rem;font-weight:600;margin-bottom:.2rem">Live news:</div>
        ${evidence}
      </div>`;
    }).join('');
    setStatus(status, `✓ ${data.shifts.length} shifts mapped · ${data.shifts.filter((s) => s.liveEvidence?.length).length} with live evidence.`);
    grid.classList.remove('hidden');
  } catch (e) {
    setStatus(status, `Error: ${e.message}`, true);
  } finally {
    runBtn.disabled = false; runBtn.innerHTML = '<span class="run-icon">▶</span> Scan Shifts';
  }
});

// ── MODULE 5: Buyer Intent Monitor ───────────────────────────────────────────
btn('run-buyer-btn')?.addEventListener('click', async () => {
  const runBtn = btn('run-buyer-btn');
  const status = el('buyer-status');
  runBtn.disabled = true; runBtn.innerHTML = '<span class="run-icon">⏳</span> Scanning…';
  status.classList.remove('hidden'); setStatus(status, 'Scanning Indeed (DE) for innovation role postings…');
  el('buyer-results').classList.add('hidden');
  try {
    const data = await fetch('/api/buyer-signals').then((r) => r.json());

    el('persona-cards').innerHTML = data.personas.map((p) => `
      <div class="fit-card">
        <div class="fit-number" style="font-size:1rem">${p.title}</div>
        <p><strong>Trigger:</strong> ${p.trigger}</p>
        <p><strong>Budget:</strong> ${p.budget}</p>
        <p style="color:var(--blue-light)">${p.format}</p>
      </div>`).join('');

    el('buyer-count').textContent = `${data.jobs.length} job signals found`;
    el('buyer-tbody').innerHTML = data.jobs.map((j) => `<tr>
      <td style="font-size:.82rem"><strong>${j.title}</strong><br><span style="font-size:.72rem;color:var(--muted)">${j.source}</span></td>
      <td style="font-size:.8rem">${j.signal}</td>
      <td style="font-size:.78rem;color:var(--muted)">${j.persona}</td>
      <td><span class="priority-${j.priority}">${j.priority.toUpperCase()}</span></td>
      <td style="font-size:.75rem">${j.link ? `<a href="${j.link}" target="_blank" style="color:var(--blue-light)">View →</a>` : '—'}</td>
    </tr>`).join('');

    const errNote = data.errors.length ? ` (${data.errors.length} feed(s) unavailable)` : '';
    setStatus(status, `✓ ${data.jobs.length} job signals scanned${errNote}.`);
    el('buyer-results').classList.remove('hidden');
  } catch (e) {
    setStatus(status, `Error: ${e.message}`, true);
  } finally {
    runBtn.disabled = false; runBtn.innerHTML = '<span class="run-icon">▶</span> Scan Job Signals';
  }
});

// ── MODULE 6: Pipeline Scoring Engine ────────────────────────────────────────
btn('run-pipeline-btn')?.addEventListener('click', async () => {
  const runBtn = btn('run-pipeline-btn');
  const status = el('pipeline-status');
  runBtn.disabled = true; runBtn.innerHTML = '<span class="run-icon">⏳</span> Loading…';
  status.classList.remove('hidden'); setStatus(status, 'Loading and scoring opportunity pipeline…');
  el('pipeline-results').classList.add('hidden');
  try {
    const data = await fetch('/api/pipeline').then((r) => r.json());

    el('pipeline-summary').innerHTML = `
      <div class="sizing-card"><div class="s-value" style="color:#059669">${data.summary.priorityA}</div><div class="s-label">Priority A Opportunities</div><div class="s-source">Score ≥ 16/20</div></div>
      <div class="sizing-card"><div class="s-value" style="color:#d97706">${data.summary.priorityB}</div><div class="s-label">Priority B</div><div class="s-source">Score 12–15/20</div></div>
      <div class="sizing-card"><div class="s-value" style="color:#dc2626">${data.summary.priorityC}</div><div class="s-label">Priority C</div><div class="s-source">Score &lt; 12/20</div></div>
      <div class="sizing-card"><div class="s-value" style="font-size:.9rem;font-weight:700">${data.summary.topOpportunity}</div><div class="s-label">Top Opportunity</div><div class="s-source">Highest aggregate score</div></div>`;

    const scoreClass = (n) => n >= 4 ? 'score-high' : n >= 3 ? 'score-mid' : 'score-low';
    el('pipeline-tbody').innerHTML = data.opportunities.map((o, i) => `<tr>
      <td style="font-weight:700;color:var(--muted)">${i + 1}</td>
      <td style="font-size:.82rem"><strong>${o.name}</strong></td>
      <td><span class="tag">${o.pillar}</span></td>
      <td class="${scoreClass(o.methodFit)}">${o.methodFit}</td>
      <td class="${scoreClass(o.refFit)}">${o.refFit}</td>
      <td class="${scoreClass(o.deliveryFit)}">${o.deliveryFit}</td>
      <td class="${scoreClass(o.commercialFit)}">${o.commercialFit}</td>
      <td class="score-cell ${o.totalScore >= 16 ? 'score-high' : o.totalScore >= 12 ? 'score-mid' : 'score-low'}">${o.totalScore}</td>
      <td><span class="priority-${o.priority.toLowerCase()}">${o.priority}</span></td>
      <td style="font-size:.78rem;color:var(--muted)">${o.estimatedValue}</td>
    </tr>`).join('');

    if (data.gaps.length) {
      const gapsBox = el('gaps-box');
      gapsBox.innerHTML = `<div class="gaps-box-inner"><h4>⚠️ Offering Gaps Detected</h4><ul>${data.gaps.map((g) => `<li><strong>${g.name}</strong> — ${g.issue}</li>`).join('')}</ul></div>`;
      gapsBox.classList.remove('hidden');
    }

    setStatus(status, `✓ ${data.opportunities.length} opportunities scored · ${data.summary.priorityA} Priority A ready to pursue.`);
    el('pipeline-results').classList.remove('hidden');
  } catch (e) {
    setStatus(status, `Error: ${e.message}`, true);
  } finally {
    runBtn.disabled = false; runBtn.innerHTML = '<span class="run-icon">▶</span> Load Pipeline';
  }
});
