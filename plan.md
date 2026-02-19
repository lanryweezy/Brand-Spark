# Brandspark Demo + Full Build Plan (2025–2030 Viability)

This plan prioritizes a clean, product-ready Demo Page powered by existing mock data to showcase Brandspark's core value, then incrementally evolves into a fully autonomous, AI-driven marketing system. It is optimized for fast iteration on Vite + React frontend and Flask backend.

## 0) Goals

- Deliver a polished, no-backend-required Demo experience using mock data (fast).
- Showcase the end-to-end loop: plan &#8594; generate &#8594; schedule &#8594; analyze (simulated).
- Establish a production-capable roadmap: AI Orchestrator, Tone Learning, AI SEO Visibility, Ad Experiments, Analytics & Attribution, Integrations.
- Keep costs low; enable Render deployment.
- Maintain a single source of truth in this plan.md.

---

## 1) Demo Page (Mock-only) — Scope and UX

Purpose: A guided, high-signal walkthrough of Brandspark’s value using existing components and mock services (services/apiService.ts).

Key features (all using mock data):
- Overview
  - Brand Selector (mock brands)
  - KPI snapshots (from mock analytics, financials)
- AI Studio Highlights
  - Social Post Generator (mock)
  - Ad Copy Generator (mock)
  - Blog Ideas (mock)
- Content Calendar
  - Display mock events, add a simulated post
- Asset Repository
  - Show generated items (from mocks)
- Analytics Snapshot
  - Social, Ads, Email, Website mock tabs
- Automation Preview
  - Display suggested automation recipes (mock)
- Influencer Preview
  - Show mock influencer vetting snippet
- Export
  - Download PDF Summary (via jspdf + html2canvas)

UX flow:
- Single page with left navigation anchors (Overview, AI Studio, Calendar, Assets, Analytics, Automation, Influencers, Export).
- Non-blocking to rest of app; zero backend dependency.
- Feature-flag gated: VITE_DEMO_MODE=true shows Demo entry point prominently.

Acceptance criteria:
- Runs with npm run dev, no backend required.
- Uses only mock services and localStorage.
- All sections render with realistic, coherent data.
- Export report works.

---

## 2) Technical Approach for Demo Page

- No new routing dependency; integrate a Demo entry in App.tsx (a top-level toggle or tab).
- Create components/DemoPage.tsx that composes existing modules:
  - BrandSelector, AIStudio highlights (subset), ContentCalendar, AssetRepository,
    analytics views under components/analytics/*, and a summary exporter.
- Extend services/apiService.ts only if needed to expose convenience selectors for mock dashboards (keep non-breaking).
- Add environment flag:
  - .env.local: VITE_DEMO_MODE=true
  - Guard backend calls in geminiService.ts by defaulting to local post stub in Demo mode (or not used on demo).
- Add lightweight layout:
  - Sticky sidebar with section anchors
  - Main content with cards displaying highlights

Files to add/update:
- New: components/DemoPage.tsx
- Update: App.tsx (add Demo link/section)
- Optional: components/ui additions (if needed for layout)

---

## 3) Implementation Steps (Demo-first)

Step 1: Add env flag
- Create .env.local with:
  - VITE_DEMO_MODE=true
  - VITE_USE_MOCKS=true

Step 2: Demo Page component
- Create components/DemoPage.tsx:
  - Import and compose: BrandSelector, a pruned AIStudio showcase (SocialPostGenerator, AdCopyGenerator, BlogIdeaGenerator), ContentCalendar, AssetRepository, analytics tabs, Automations preview, Influencers preview, Export to PDF.
  - Use existing services/apiService.ts for data.
  - Keep each section collapsible.

Step 3: Wire into App.tsx
- Add a top nav button “Demo” that reveals DemoPage.
- If VITE_DEMO_MODE is true, default to Demo first; fallback to existing dashboard otherwise.

Step 4: Export to PDF
- Integrate jspdf + html2canvas to export the main report area.

Step 5: Polish
- Add EmptyState and Toast where applicable.
- Ensure no backend calls are triggered while in Demo.

Step 6: Docs
- Update README.md: how to run Demo.
- Keep plan.md as the single project plan tracker.

---

## 4) Post-Demo Roadmap (From Mock to Production)

Milestone A: Real API foundation (2–3 weeks)
- Backend
  - Add /api/generate endpoints + provider abstraction (Gemini/OpenAI/Claude).
  - Add /api/events/ingest for analytics.
  - Postgres + migrations (users, brands, campaigns already exist).
  - Health and version endpoint harden.
- Frontend
  - Implement services/dbService.ts to call backend.
  - Config flag: VITE_USE_MOCKS=false to switch over.
  - Add Vite proxy or use VITE_API_URL.
- DevOps
  - Render: Postgres, Redis (for jobs), secrets.

Milestone B: Tone Learning + Brand Memory (2–3 weeks)
- pgvector (or Qdrant) embeddings for brand corpus.
- Endpoints:
  - /api/brand-corpus/upload (PDF/URLs)
  - /api/tone/train and retrieval middleware
- UI: Tone Trainer page, enforce tone across generators.

Milestone C: AI SEO Visibility (2–4 weeks)
- Tables: ai_visibility (query, engine, snippet, sources, coverage).
- Jobs: crawl brand + competitors; fetch visibility via allowed APIs and SERP providers.
- UI: Visibility dashboard; schema.org suggestions.

Milestone D: Ad Experiments (3–5 weeks)
- Integrations: Google Ads + Meta Marketing API.
- Tables: platform_accounts, oauth_tokens, ad_variants, ad_sets, budgets.
- Loop: generate variants, upload, monitor KPIs, iterate.

Milestone E: Analytics & Attribution (2–4 weeks)
- Event schema: user_id/anon_id/brand_id/event/properties/utm/referrer/ts.
- Client SDK snippet + server-side conversion APIs.
- Reporting: funnels, UTM performance, channel mix.

Milestone F: Automation & Scheduling (2–3 weeks)
- Celery tasks for posting, syncs, refresh jobs.
- UI: Schedules, job status, error handling.

---

## 5) Security, Privacy, Governance (Continuous)

- JWT rotation, RBAC per company/brand.
- Secrets stored in Render; no secrets in repo.
- PII minimization; DSR endpoints.
- Rate limiting + input validation.
- Signed URLs for assets; object storage policies.

---

## 6) Success Metrics

- Demo conversion: % viewers who complete a mock campaign loop.
- Time-to-first-demo: < 5 minutes.
- After API cutover:
  - AI SEO coverage lift
  - Ad CAC reduction via automated iteration
  - Content velocity (throughput) and tone consistency
  - Attribution match rate

---

## 7) Task Tracker (Do-First Checklist)

[ ] Create .env.local with VITE_DEMO_MODE=true, VITE_USE_MOCKS=true  
[ ] Add components/DemoPage.tsx (compose existing modules with mocks)  
[ ] Wire Demo into App.tsx (toggle or default view when demo mode)  
[ ] Ensure geminiService.ts not used in Demo or guarded  
[ ] Implement Export to PDF on Demo  
[ ] README: “How to run the Demo”  
[ ] Validate no backend is required for Demo  
[ ] Deploy static Demo to Render (frontend only)  

Next (post-demo):
[ ] Implement backend /api/generate provider scaffolds  
[ ] Implement /api/events/ingest + minimal dashboards  
[ ] services/dbService.ts implementation + VITE_API_URL switch  
[ ] Add migrations for tone learning and ai_visibility  
[ ] Introduce Celery/Redis for scheduled jobs  

---

## 8) Execution Notes

- Keep Demo self-contained: do not add heavy dependencies (e.g., router) unless needed.
- Favor composition of existing components; keep code changes minimal to de-risk.
- Guard all backend calls behind VITE_USE_MOCKS to avoid accidental network calls in Demo.
- Iterate visuals and copy for narrative cohesion: “Plan → Create → Schedule → Analyze.”

---

## 9) Optional Enhancements (If time permits)

- Include a “Guided Tour” overlay (one-time) on Demo.
- Prefill an “Example Brand” with a coherent story across sections.
- Add a “Share Demo” link (pre-render PDF hosted or saved locally).

---

## 10) How to Run the Demo

1) Install deps  
   npm install

2) Create .env.local at project root:  
   VITE_DEMO_MODE=true  
   VITE_USE_MOCKS=true

3) Start  
   npm run dev

4) Open the app and click “Demo” (or it opens by default if Demo mode is enabled).

---

End of plan. Proceeding to implement Step 1–3 when approved or on next commit.