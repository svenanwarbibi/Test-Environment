# IC-3 Market Analysis Plan
## Potentials and Opportunities for Innovation Services

**Audience:** IC-3 Strategy, Business Development, Sales  
**Scope:** DACH, EMEA, US – near-term (6–12 months)  
**Verticals:** FMCG/CPG, Packaging Manufacturers + adjacent sectors  
**Constraints:** Zero budget, desk research, 2.5 FTEs, publicly available data  
**Purpose:** Immediate manual execution; structured for later translation into an automated agentic market-intelligence process

---

## How to read this plan

Each of the six modules below follows the same structure: objective, key questions, data sources with access method, concrete steps, output format, and an automation-readiness tag (🤖 = fully automatable; 🤖/👤 = automatable with human validation; 👤 = requires human judgement). Steps flagged as parallelisable can run simultaneously across team members or, later, across agents.

Time estimates assume one person working full-time. The entire plan is designed to deliver a usable first pass in approximately 15–20 working days, with updates running on a lighter cadence thereafter.

---

## Module 1: Landscape Analysis

**Objective:** Map the competitive and adjacent playing field for systematic innovation services in FMCG/CPG, packaging, and adjacent manufacturing sectors across DACH, EMEA, and the US.

**Key questions:**

- Who competes directly with IC-3's three pillars (Innovation Management, Projects, Trainings) in physical product innovation consulting?
- Who is expanding from digital/service innovation into physical product innovation – and vice versa?
- What is the market size for innovation consulting services in the target verticals, and what share is addressable for a 2.5-FTE boutique?
- Where do large incumbents (MBB, Big 4, Accenture) leave white space that IC-3 can occupy?

**Data sources and access:**

| Source | What it provides | Access | Cadence |
|--------|-----------------|--------|---------|
| Lünendonk Study (annual, DE) | IT and management consulting market sizing, top-50 rankings, growth rates by segment | Free summary via luenendonk.de; full report c. €2,500 – use summary + press coverage | Annual, typically Q2 |
| Source Global Research | Global consulting market sizing, innovation consulting segment data | Free newsletter + selected data via sourceglobalresearch.com | Quarterly |
| Gartner Market Share: IT Services | Worldwide vendor revenue by segment and industry | Press releases and Gartner newsroom (free); full data behind paywall | Annual |
| Statista | FMCG/CPG market size, packaging industry data, R&D spend by sector | Partially free; institutional access preferred | Rolling |
| Bundesanzeiger (DE) | Annual reports of German competitors (GmbH filings: revenue, headcount, profit) | Free at bundesanzeiger.de | Annual, 6–12 month lag |
| Companies House (UK) | UK competitor filings | Free at find-and-update.company-information.service.gov.uk | Annual |
| LinkedIn Sales Navigator | Competitor headcount trends, hiring patterns, new service line launches | Free basic search; Navigator via existing subscription if available | Real-time |
| Competitor websites and blogs | Positioning, service catalogue, case studies, thought leadership topics | Free | Monthly scan |
| Clutch.co, G2 | Innovation consulting firm ratings, client reviews, pricing signals | Free | Quarterly |
| ECSI (European Consulting & Services Index) | Consulting industry performance benchmarking | Free summary data | Biannual |

**Steps:**

1. **Build a competitor longlist** (🤖 – web scraping + LinkedIn search automatable). Start from the anonymised reference shortlist of 12 competitors. Expand using Clutch.co category pages for "innovation consulting" and "product development consulting" in DACH, UK, Nordics, Benelux, and US. Target: 40–60 firms. *Parallelisable.*

2. **Classify competitors by archetype** (🤖/👤). Create a taxonomy: (a) systematic innovation methodology firms (direct competitors), (b) design-and-build consultancies with innovation practice, (c) large firms with innovation sub-units, (d) academic/methodology licensors (e.g. TRIZ providers, Design Thinking certifiers). Map each to IC-3's three pillars.

3. **Extract financial signals from Bundesanzeiger** (🤖). For German competitors: pull latest available revenue, EBIT, headcount from annual filings. Flag firms with revenue growth >15% or headcount growth >20% as "expanding competitors". *Parallelisable with step 1.*

4. **Map the white space** (👤). Overlay competitor positioning against IC-3's specific strengths: physical product innovation, systematic methodology (ADT), packaging/FMCG depth, proven KPI impact (30% CapEx reduction, 80% net-zero pipeline). Identify where no competitor credibly operates.

5. **Size the addressable market** (🤖/👤). Use Lünendonk data for the DACH consulting market (c. €45bn total IT/management consulting in 2023, per Lünendonk 2023 summary). Innovation consulting is a sub-segment; Source Global Research estimates the global innovation and R&D consulting market at c. $8–12bn. For IC-3's niche (physical product innovation methodology for mid-to-large enterprises in FMCG/CPG/packaging), the directly addressable DACH market is likely in the low hundreds of millions – this figure needs validation via triangulation of Lünendonk, Statista FMCG R&D spend data, and competitor revenue aggregation.

**Output:** Competitor landscape map (spreadsheet with firm, archetype, geography, size, services overlap, financial trajectory). White-space matrix (IC-3 pillars vs. competitor coverage). Market sizing estimate with confidence bands.

**Timeline:** 5 working days for first pass.

---

## Module 2: Signal Analysis

**Objective:** Identify early and leading indicators of demand for IC-3 services – before they show up as RFPs.

**Key questions:**

- Which target companies are signalling innovation investment (capex announcements, new CDO/CIO hires, sustainability commitments)?
- Which regulatory changes are creating mandatory innovation demand?
- Where are M&A events creating integration-driven innovation needs?

**Signal categories and sources:**

| Signal type | What to look for | Source | Tag |
|-------------|-----------------|--------|-----|
| Leadership changes | New VP Innovation, CDO, Head of Packaging, Head of Sustainability appointed | LinkedIn (job change alerts), press releases | 🤖 |
| Capex / R&D announcements | New plant investments, packaging line upgrades, R&D budget increases | Annual reports (via Bundesanzeiger, SEC EDGAR for US), earnings calls | 🤖/👤 |
| Sustainability commitments | Net-zero targets, circular economy pledges, CSRD compliance plans | CDP database (free), company sustainability reports, SBTi target tracker | 🤖 |
| M&A activity | Mergers in FMCG/CPG/packaging creating post-merger innovation alignment needs | Reuters, Mergermarket (summary), Handelsblatt, FT | 🤖/👤 |
| Regulatory pressure | EU Packaging and Packaging Waste Regulation (PPWR), CSRD, Ecodesign for Sustainable Products Regulation (ESPR) | EUR-Lex, European Commission press releases | 🤖 |
| Innovation programme failures | Restructurings, layoffs in innovation teams, cancelled product launches | News monitoring (Google Alerts), Glassdoor reviews | 🤖/👤 |
| Job postings | Companies hiring for "innovation manager", "packaging innovation", "design thinking" internally – signals in-house capability gaps | LinkedIn, Indeed, Stepstone | 🤖 |
| Industry events | Speaking slots, panel topics at Interpack, FACHPACK, CFIA, PackExpo, Consumer Goods Forum | Event websites, programme PDFs | 🤖 |

**Steps:**

1. **Configure alert infrastructure** (🤖). Set up Google Alerts for 30 target accounts (derived from Module 1) plus key terms ("packaging innovation", "FMCG innovation", "systematic innovation", "innovation methodology", "design thinking training" + company names). Set up LinkedIn Sales Navigator alerts for leadership changes at target accounts. *Week 1.*

2. **Build a regulatory timeline** (🤖/👤). Map EU PPWR (expected enforcement 2025–2030 phased), CSRD (first reports due 2025 for large enterprises), ESPR (framework expected 2025–2026) against target company compliance deadlines. Each regulation creates a time-bound window of innovation demand. *Parallelisable with step 1.*

3. **Scan target company annual reports for innovation language** (🤖). For the top 20 accounts (ABInBev, Nestlé, Unilever, P&G, Henkel, Beiersdorf, Mars, Mondelez, Danone, FrieslandCampina, Arla, SIG Group, Tetra Pak, Amcor, Berry Global, Sealed Air, Schwan-STABILO, Villeroy & Boch, Colgate-Palmolive, Reckitt): download latest annual/sustainability report, search for "innovation pipeline", "R&D investment", "packaging transformation", "circular", "net zero". Extract quantified commitments. *Parallelisable.*

4. **Score and prioritise signals** (👤). Apply a simple urgency × fit matrix: how time-sensitive is the signal (regulatory deadline, M&A integration window) × how well does IC-3's offering match the implied need? Rank the top 10 opportunities.

**Output:** Signal tracker (spreadsheet, updated weekly). Regulatory timeline (Gantt chart). Prioritised opportunity shortlist with estimated engagement size.

**Timeline:** 4 working days for setup + first scan; 2 hours/week ongoing.

---

## Module 3: Drivers and Impact Factors (Pull/Push)

**Objective:** Identify and weight the forces driving demand towards (pull) and pushing companies away from (push) external innovation consulting.

**Pull factors (creating demand for IC-3):**

| Driver | Evidence / quantification | Source |
|--------|--------------------------|--------|
| Regulatory pressure (PPWR, CSRD, ESPR) | PPWR alone affects an estimated 600,000+ companies placing packaging on the EU market; compliance deadlines 2025–2030 | European Commission (2022), PPWR proposal COM/2022/677 |
| Sustainability commitments outpacing internal capabilities | 80% of top-50 FMCG companies have net-zero commitments by 2040–2050; fewer than 30% report having a concrete innovation pipeline to deliver them | CDP Global Supply Chain Report 2023; SBTi progress tracker |
| Innovation productivity gap | Large FMCG firms' R&D-to-revenue ratio has been flat at 1.5–2.5% for a decade while new product success rates have declined from c. 25% to c. 15% | Nielsen IQ "Breakthrough Innovation" reports (2018–2023); Statista FMCG R&D benchmarks |
| Talent scarcity in innovation roles | Innovation manager roles in DACH take 30–50% longer to fill than general management roles | Hays Salary Guide 2024; LinkedIn Talent Insights |
| Cost pressure demanding structured innovation | CIO/CDO priority: process optimisation at 75%, cost reduction embedded in top-3 priorities across industries | Lünendonk Study 2023; Gartner CIO Survey 2023 |
| Post-M&A innovation harmonisation | FMCG M&A activity remains elevated; 2023 global FMCG deal value c. $89bn | PwC Global M&A Trends 2024 |

**Push factors (reducing demand / creating headwinds):**

| Driver | Evidence / quantification | Source |
|--------|--------------------------|--------|
| In-house innovation capability build-up | 66% of companies building internal cross-functional innovation teams; trend accelerating since 2020 | Lünendonk 2023; anonymised competitor intelligence report (2023) |
| Budget tightening in discretionary consulting | Consulting market growth in DACH slowed from 8–10% (2021–2022) to 3–5% (2023–2024); innovation consulting is often classified as discretionary | Lünendonk 2023; BDU (Bundesverband Deutscher Unternehmensberater) market report 2024 |
| AI substitution of parts of the innovation process | Generative AI tools increasingly used for early-stage ideation and concept screening, compressing the value of generic "ideation workshop" offerings | McKinsey "The State of AI" survey 2024; BCG "AI and Innovation" report 2023 |
| Price pressure from offshore/nearshore competitors | Competitors from lower-cost-base countries offering design-and-build at 30–50% lower day rates | Anonymised competitor intelligence report (2023) |
| "Design Thinking fatigue" | Design Thinking and similar methodologies now seen as market standard, not differentiator; 78% of large enterprises claim to use some form of design thinking internally | Anonymised competitor intelligence report (2023); McKinsey Design Index |

**Steps:**

1. **Validate and quantify each driver** (🤖/👤). For each factor above, verify the cited data point is current. Where data is from 2023, search for 2024/2025 updates. Flag any driver where the evidence is weaker than "probable" (>60% confidence).

2. **Weight relative impact on IC-3's target segments** (👤). Not all drivers affect FMCG/CPG/packaging equally. Regulatory pressure (PPWR) is disproportionately strong for packaging. AI substitution risk is lower for physical product innovation than for digital/service innovation. Build a weighted scorecard.

3. **Identify net-effect by vertical** (👤). For each target vertical (FMCG, CPG, packaging manufacturers, adjacent: automotive, chemicals, sanitary), calculate whether the pull or push forces dominate.

**Output:** Pull/push driver matrix with weightings. Net-effect assessment by vertical. Risk register for push factors, including mitigation options for IC-3 positioning.

**Timeline:** 3 working days.

---

## Module 4: Market Shifts

**Objective:** Map structural changes in how innovation services are bought, delivered, and valued in IC-3's target markets.

**Key shifts to track:**

| Shift | Description | Implication for IC-3 | Evidence source |
|-------|-------------|---------------------|----------------|
| From project-based to subscription/retainer | Companies increasingly prefer ongoing advisory relationships over one-off projects | IC-3's Innovation Management pillar (from 100k€/yr) is already positioned for this; strengthen the recurring-revenue narrative | Source Global Research 2023; Lünendonk 2023 |
| From methodology purchase to outcome guarantee | Buyers want measurable results, not workshop hours; "what's the ROI?" is the dominant procurement question | IC-3 has quantified outcomes (30% CapEx cut, €30M pipeline) – but needs to systematise ROI measurement and reporting | Anonymised competitor intelligence (2023); Gartner CIO survey 2023 |
| From generic innovation to hyper-specialisation | Small consultancies that survive are those with deep vertical or methodological specialisation; generalists lose to in-house teams or larger firms | IC-3's ADT methodology and physical product focus is a genuine niche – but "innovation consulting" positioning is too broad; sharpening required | Anonymised competitor intelligence (2023) |
| From physical-only to physical-digital convergence | Even traditionally physical product companies now require digital integration (IoT packaging, smart products, digital twins for production) | IC-3's planned expansion into digital/services innovation is directionally correct; but execution requires capability partnerships or selective hiring | McKinsey "Tech Trends" 2023; Interpack trend reports |
| From sustainability as add-on to sustainability as default | Sustainability is no longer a separate innovation workstream; it is embedded in every product development brief | IC-3 already has strong sustainability references (circular packaging, Omnia Green Gain, net-zero pipeline); needs to position sustainability not as a separate offering but as a cross-cutting capability | CDP 2023; PPWR impact assessments |
| Geographic shift: US FMCG innovation investment growing faster than EU | US CPG companies increased R&D spend by 6.2% in 2023 vs. 2.8% in EU; driven by competitive pressure and consumer premiumisation | IC-3 has US client references (ABInBev) but no US presence; partnership or remote delivery model required for US expansion | Statista; IRI/Circana CPG industry reports |

**Steps:**

1. **Validate each shift with at least two independent sources** (🤖/👤). The shifts above are hypotheses derived from the competitor analysis and public market data. Each needs corroboration. *Parallelisable.*

2. **Map IC-3's current positioning against each shift** (👤). Where is IC-3 already aligned? Where is it misaligned? Where is there an opportunity to lead?

3. **Identify timing windows** (👤). Some shifts are gradual (physical-digital convergence); others have hard deadlines (PPWR compliance phases). For each, estimate the window of maximum opportunity for IC-3.

**Output:** Market shift map with IC-3 alignment assessment. Timing matrix. Strategic implications for each of the three pillars.

**Timeline:** 3 working days.

---

## Module 5: Customer Expectations

**Objective:** Understand what innovation decision-makers in FMCG/CPG/packaging actually want from an external innovation partner – and where current offerings (including IC-3's) fall short.

**Key questions:**

- What are the top 3 unmet needs when companies hire innovation consultants?
- What kills deals – price, methodology, references, or something else?
- How do procurement processes differ by company size and region?

**Data sources:**

| Source | What it provides | Access |
|--------|-----------------|--------|
| IC-3's own client relationships | Direct feedback from long-term partners (ABInBev, METRO, Philip Morris, V&B) on what they value and what they wish were different | Informal conversations – "friends and family" interviews; 4–6 conversations at 30 min each |
| LinkedIn polls and posts from innovation leaders | Sentiment on innovation consulting value, pain points, budget decisions | Free monitoring; can also post targeted polls from IC-3's company page |
| Gartner / Forrester buyer surveys | What enterprise buyers prioritise when selecting consultants | Summary findings usually free via press releases; full reports behind paywall |
| Interpack / FACHPACK post-event surveys | Packaging industry innovation priorities and technology interests | Event organisers' publications; Messe Düsseldorf press office |
| Lünendonk "Client Perspective" supplements | Why enterprises choose specific consultancies; satisfaction drivers | Included in Lünendonk annual study supplements |
| Glassdoor / Kununu reviews of competitor firms | Client-side feedback embedded in employee reviews (e.g. "our clients complained about...") | Free |

**Steps:**

1. **Conduct 4–6 informal interviews** (👤). With existing client contacts (the "friends and family" network). Use a structured but conversational guide covering: (a) what triggered their last search for an innovation partner, (b) what criteria they used to select, (c) what they would change about how they worked with IC-3 or other firms, (d) what they see as the biggest upcoming innovation challenge. Record and code themes. *This is the single highest-value activity in the entire plan – primary data from actual buyers.*

2. **Analyse win/loss patterns** (👤). IC-3 likely does not have formal win/loss tracking. Reconstruct from memory: the last 10 pitches. Which were won, which lost, why? Code the reasons. Compare against the anonymised competitor intelligence finding that the top reasons for losing are: (i) lack of access to decision-makers, (ii) high price point, (iii) lack of embodied domain expertise, (iv) client priority changes, (v) unconvincing expertise demonstration.

3. **Map the procurement journey** (🤖/👤). For mid-sized enterprises (500–5,000 employees): who initiates the search for an innovation partner? (Typically Head of Innovation, VP R&D, or COO.) Who approves the budget? (Typically CFO or board.) What procurement frameworks apply? (For >50k€: usually formal RFP or at least competitive quotes.) This determines IC-3's go-to-market: the free Health Check and Trial Workshop are designed as entry points to bypass formal procurement for initial engagement. Validate whether this actually works.

4. **Build buyer personas** (👤). Based on the above, create 3–4 buyer personas: e.g. "VP Innovation at a €2bn+ FMCG company under PPWR pressure"; "Head of Packaging at a mid-sized CPG firm wanting to modernise"; "L&D Director at a large enterprise wanting to build internal innovation capability". For each persona: pain points, budget authority, decision timeline, preferred engagement format.

**Output:** Interview summary (anonymised). Win/loss analysis. Buyer persona profiles. Gap analysis: what customers expect vs. what IC-3 currently delivers.

**Timeline:** 4 working days (interviews will stretch across 2 weeks due to scheduling).

---

## Module 6: Market Fit (IC-3 Offering)

**Objective:** Assess how well IC-3's current three-pillar offering fits the identified market opportunities – and where adjustments are needed.

**Current offering structure:**

| Pillar | Target buyer | Entry point | Full engagement | Core value proposition |
|--------|-------------|-------------|-----------------|----------------------|
| Innovation Trainings | Learning departments | Methodology introduction (2h, free) | From 20k€ | Build internal innovation capability via ADT methodology |
| Innovation Projects | Project teams | Trial Workshop (½ day, 5k€) | From 50k€ | Systematic ideation, concept development, de-risking for specific challenges |
| Innovation Management | Innovation departments | Health Check (2h, free) | From 100k€/yr | End-to-end innovation management from strategy to execution |

**Fit assessment framework:**

For each opportunity identified in Modules 1–5, score the fit along four dimensions:

1. **Methodology fit** (1–5): Does IC-3's ADT methodology directly address the customer's problem? (Score 5 = core ADT application, e.g. physical product innovation; Score 1 = tangential, e.g. pure digital transformation.)

2. **Reference fit** (1–5): Does IC-3 have credible, named references in the buyer's industry and problem domain? (Score 5 = multiple named references with quantified outcomes; Score 1 = no relevant references.)

3. **Delivery fit** (1–5): Can IC-3 deliver with 2.5 FTEs, potentially with freelance support? (Score 5 = standard workshop/project format; Score 1 = requires sustained multi-person team presence.)

4. **Commercial fit** (1–5): Is the opportunity financially attractive at IC-3's price points? (Score 5 = buyer's budget aligns with 50k–100k+ range and IC-3's margins; Score 1 = extreme price pressure or requires significant unpaid business development.)

**Steps:**

1. **Score existing opportunities** (👤). Apply the framework to the top 10 opportunities from Module 2's signal analysis. Identify the 3–5 with the highest aggregate score.

2. **Identify offering gaps** (👤). Where opportunities score high on methodology and reference fit but low on delivery or commercial fit, identify specific adjustments: partnership with a digital consultancy for physical-digital convergence work? A lighter "innovation sprint" format below the 50k€ threshold for mid-market entry? An "innovation audit" productised offering that competes with the free Health Check but delivers more depth at a price point (e.g. 10–15k€)?

3. **Assess the digital/services expansion** (👤). IC-3's plan to widen beyond physical product innovation into digital and services: which of the identified market opportunities specifically require this expansion? What minimal capability addition (hire, partnership, tool) would be needed? What is the risk of diluting IC-3's current niche positioning?

4. **Build a prioritised opportunity pipeline** (👤). Combine all six modules into a single ranked list of opportunities with estimated deal size, probability, timeline, and required actions.

**Output:** Scored opportunity matrix. Offering gap analysis. Recommended adjustments to the three-pillar model. Prioritised pipeline (top 10).

**Timeline:** 3 working days; dependent on completion of Modules 1–5.

---

## Execution Sequence and Dependencies

| Week | Module | Activities | Dependencies |
|------|--------|-----------|-------------|
| 1 | 1 (Landscape) | Competitor longlist, classification, Bundesanzeiger pulls | None |
| 1 | 2 (Signals) | Alert setup, regulatory timeline, first annual report scan | None – parallelisable with Module 1 |
| 2 | 1 (Landscape) | White-space mapping, market sizing | Module 1 step 1–3 |
| 2 | 3 (Pull/Push) | Driver validation, weighting | Modules 1–2 first pass |
| 2–3 | 5 (Customers) | Interview scheduling and execution, win/loss reconstruction | None – interviews should start Week 1 |
| 3 | 4 (Market Shifts) | Shift validation, IC-3 alignment, timing | Modules 1–3 |
| 3–4 | 6 (Market Fit) | Scoring, gap analysis, pipeline build | All previous modules |

**Total estimated effort:** 15–20 working days elapsed over 4 calendar weeks.

---

## Automation Roadmap

For the envisioned permanent agentic market-intelligence process, the following components can be automated first (highest ROI):

1. **Signal monitoring** (Module 2): Google Alerts, LinkedIn job-change tracking, SEC/Bundesanzeiger filing alerts, regulatory tracker. Achievable with existing tools (Google Alerts, LinkedIn, RSS feeds) + a lightweight orchestration layer.

2. **Competitor tracking** (Module 1): Periodic scraping of competitor websites for service catalogue changes, blog topics, case study additions, hiring patterns. LinkedIn headcount tracking.

3. **Annual report scanning** (Module 2/3): Automated download and keyword extraction from publicly filed annual and sustainability reports.

4. **News monitoring** (Module 2): Targeted news monitoring for M&A, leadership changes, plant investments at target accounts.

The components requiring ongoing human judgement are: buyer interviews (Module 5), win/loss analysis (Module 5), opportunity scoring (Module 6), and strategic interpretation of all outputs.

---

## Reference List

Anonymised competitor intelligence report (2023). *Internal reference document, competitor landscape analysis for a German digital innovation consultancy, September 2023.* [Not publicly available; used with anonymisation.]

BDU (2024). *Facts & Figures zum Beratermarkt.* Bundesverband Deutscher Unternehmensberater. Available at: https://www.bdu.de/fachthemen/marktstudie/ (Accessed: 12 June 2026).

CDP (2023). *Global Supply Chain Report 2023.* Carbon Disclosure Project. Available at: https://www.cdp.net/en/research (Accessed: 12 June 2026).

European Commission (2022). *Proposal for a Regulation on Packaging and Packaging Waste (PPWR).* COM/2022/677. Available at: https://environment.ec.europa.eu/topics/waste-and-recycling/packaging-waste_en (Accessed: 12 June 2026).

Gartner (2023). *Gartner CIO and Technology Executive Survey 2023.* Available at: https://www.gartner.com/en/information-technology/trends/cio-agenda (Accessed: 12 June 2026).

Gartner (2022). *Market Share: IT Services, Worldwide, 2022.* [Paywall; summary data via Gartner newsroom.]

Hays (2024). *Hays Salary Guide 2024 – Germany.* Available at: https://www.hays.de/personaldienstleistung/gehaltsreport (Accessed: 12 June 2026).

IC-3 GmbH (2026). *Innovation Instigators – Company Presentation.* [Internal document.]

IC-3 GmbH (2026). *IC-3 Website.* Available at: https://www.ic-3.com (Accessed: 12 June 2026).

Lünendonk (2023). *Lünendonk-Studie 2023: Der Markt für IT-Beratung und IT-Service in Deutschland.* Lünendonk & Hossenfelder GmbH. Available at: https://www.luenendonk.de (Accessed: 12 June 2026).

McKinsey (2023). *McKinsey Technology Trends Outlook 2023.* Available at: https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-top-trends-in-tech (Accessed: 12 June 2026).

McKinsey (2024). *The State of AI in 2024.* Available at: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai (Accessed: 12 June 2026).

Nielsen IQ (2023). *Breakthrough Innovation Report.* [Summary via nielseniq.com.]

PwC (2024). *Global M&A Trends in Consumer Markets 2024.* Available at: https://www.pwc.com/gx/en/services/deals/trends.html (Accessed: 12 June 2026).

SBTi (2024). *Science Based Targets Progress Report.* Available at: https://sciencebasedtargets.org/reports/sbti-progress-report-2024 (Accessed: 12 June 2026).

Source Global Research (2023). *The Global Consulting Market in 2023.* Available at: https://www.sourceglobalresearch.com (Accessed: 12 June 2026).

---

## Key Assumptions and Caveats

1. **Market sizing is approximate.** Innovation consulting is not a cleanly defined segment in standard industry classifications. The figures cited are triangulations from multiple sources and carry ±30% uncertainty.

2. **Competitor financial data lags.** Bundesanzeiger filings for GmbH entities are typically 6–18 months behind. The latest available data for most competitors will be FY2024 at best.

3. **The anonymised competitor analysis is from September 2023.** Market conditions have evolved, particularly around AI adoption and regulatory timelines. All data points from that document should be treated as directional, not current.

4. **The single assumption whose reversal would most change this plan:** If IC-3's long-term clients are not representative of the broader market's needs (i.e. if IC-3's relationship-based model has created a filter bias), then the customer expectations module may produce misleading signals. Mitigation: include at least 1–2 interviews with prospects who did *not* become clients.
