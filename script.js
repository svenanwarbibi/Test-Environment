// Active sidebar link on scroll
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".sidebar a");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove("active"));
        const a = document.querySelector(`.sidebar a[href="#${e.target.id}"]`);
        if (a) a.classList.add("active");
      }
    });
  },
  { rootMargin: "-20% 0px -70% 0px" }
);
sections.forEach((s) => observer.observe(s));

// ── Landscape Analysis Live Scan ──────────────────────────────────────────────

let activeRegion = "dach";
let allCompanies = [];

document.querySelectorAll(".region-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".region-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeRegion = btn.dataset.region;
  });
});

document.getElementById("run-scan-btn").addEventListener("click", runScan);

async function runScan() {
  const btn = document.getElementById("run-scan-btn");
  const status = document.getElementById("scan-status");
  const results = document.getElementById("scan-results");

  btn.disabled = true;
  btn.innerHTML = '<span class="run-icon">⏳</span> Scanning…';
  status.className = "scan-status";
  status.textContent = `Fetching competitor data for ${activeRegion.toUpperCase()} region…`;
  results.classList.add("hidden");

  try {
    const res = await fetch(`/api/competitors?region=${activeRegion}`);
    if (!res.ok) throw new Error(`API error ${res.status}`);
    const data = await res.json();

    allCompanies = data.companies;
    renderResults(data);

    status.textContent = `Scan complete — ${data.meta.total} companies found (${data.meta.liveAdded} live additions from OpenCorporates).`;
    results.classList.remove("hidden");
  } catch (err) {
    status.className = "scan-status error";
    status.textContent = `Scan failed: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="run-icon">▶</span> Run Scan';
  }
}

function renderResults(data) {
  renderSizingCards(data.marketSizing);
  renderArchetypeBars(data.archetypeCounts, data.archetypes, data.meta.total);
  renderTable(data.companies, data.archetypes);

  const note = document.getElementById("live-note");
  if (data.meta.liveError) {
    note.textContent = `Note: Live OpenCorporates fetch returned an error (${data.meta.liveError}). Showing curated dataset only.`;
    note.classList.remove("hidden");
  } else {
    note.classList.add("hidden");
  }

  document.getElementById("company-search").addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allCompanies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.archetype?.toLowerCase().includes(q)
    );
    renderTable(filtered, data.archetypes);
  });
}

function renderSizingCards(ms) {
  document.getElementById("sizing-cards").innerHTML = `
    <div class="sizing-card">
      <div class="s-value">${ms.globalInnovationConsulting}</div>
      <div class="s-label">Global Innovation Consulting Market</div>
      <div class="s-source">${ms.globalSource}</div>
    </div>
    <div class="sizing-card">
      <div class="s-value">${ms.dachConsultingTotal}</div>
      <div class="s-label">DACH Consulting Market (total)</div>
      <div class="s-source">${ms.dachConsultingSource}</div>
    </div>
    <div class="sizing-card">
      <div class="s-value">${ms.dachAddressable}</div>
      <div class="s-label">IC-3 Addressable (est.)</div>
      <div class="s-source">Confidence: ${ms.confidence}</div>
    </div>
  `;
}

function renderArchetypeBars(counts, archetypes, total) {
  const container = document.getElementById("archetype-bars");
  container.innerHTML = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const at = archetypes[key] || archetypes.unknown;
      const pct = Math.round((count / total) * 100);
      return `
        <div class="arch-bar-row">
          <div class="arch-bar-label">${at.label}</div>
          <div class="arch-bar-track">
            <div class="arch-bar-fill" style="width:${pct}%;background:${at.color}"></div>
          </div>
          <div class="arch-bar-count">${count}</div>
        </div>`;
    })
    .join("");
}

function renderTable(companies, archetypes) {
  const tbody = document.getElementById("results-tbody");
  document.getElementById("results-count").textContent = `${companies.length} companies`;

  tbody.innerHTML = companies
    .map((c) => {
      const at = archetypes[c.archetype] || archetypes.unknown;
      const overlap = c.services?.length
        ? c.services.map((s) => `<span class="tag">${s}</span>`).join(" ")
        : "—";
      const chip = `<span class="source-chip ${c.source === "curated" ? "curated" : "opencorporates"}">${c.source === "curated" ? "Curated" : "Live"}</span>`;
      return `
        <tr>
          <td><strong>${c.name}</strong>${c.incorporated ? `<br><span style="font-size:.75rem;color:var(--muted)">est. ${c.incorporated}</span>` : ""}</td>
          <td>${c.location || "—"}</td>
          <td><span style="color:${at.color};font-weight:600;font-size:.82rem;">${at.label}</span></td>
          <td style="font-size:.82rem;">${overlap}</td>
          <td>${chip}</td>
        </tr>`;
    })
    .join("");
}
