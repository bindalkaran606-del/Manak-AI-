# MANAK AI — Product Specification (SIH 26108)

## 1. Executive Summary
**MANAK AI** is an AI-powered recommendation and compliance decision-support engine for identifying applicable Indian Standards (IS standards) for public procurement specifications. Developed for **Smart India Hackathon 2026** (Problem Statement **SIH 26108**), it bridges the gap between raw procurement requirements and the Bureau of Indian Standards (BIS) regulatory knowledge base.

## 2. Core Architecture & Philosophy
- **Aesthetic**: Apple design discipline + Bureau of Indian Standards (BIS) institutional authority + modern subtle Indian identity.
- **Human Decision-Maker Mandate**: The AI assists procurement committees by providing mathematical relevance scores, clause evidence, and gap analysis. Final specification formulation remains with the human officer.
- **GFR 2017 Rule 144 & QCO Compliance**: Aligns procurement specifications with mandatory Quality Control Orders and General Financial Rules.

## 3. Key Workflows & User Flow
1. **Landing Page (`/`)**: High-impact institutional entry, metrics ticker (22,480+ indexed standards, 96% precision), 4-stage workflow walkthrough, and quick interactive test bench.
2. **Dashboard (`/dashboard`)**: Daily intake screen, quick requirement input, 1-click verified demonstration presets (LED street lighting, TMT steel rebars, Safety PPE, Distribution transformers, HDPE water supply pipes), and recent analyses list.
3. **New Procurement Requirement (`/new`)**:
   - Option 1: Plain text entry with rich sector, department, and budget parameters.
   - Option 2: Tender PDF upload simulation with pre-loaded real tender documents.
   - Refined 4-stage AI processing visualizer: Understanding requirement -> Finding relevant standards -> Ranking recommendations -> Preparing MANAK Insight.
4. **Requirement Analysis & Recommendations (`/analysis/:id`)**:
   - **Requirement Extraction Breakdown**: Product Identified, Purpose, Operating Environment, Keywords, Key Technical Parameters Matrix.
   - **Recommended Standards**: Ranked cards with relevance %, status (🟢 Current / 🟡 Under Revision / 🔴 Withdrawn), Why Recommended explanation, and expandable Clause Evidence drawer.
   - **Standard Detail Modal / View**: Scope, mandatory clauses, test methods, version amendments, and related standards.
   - **MANAK Insight & Gap Analysis**: Compliance readiness score (0-100), missing parameters checklist with severity ratings, ambiguous phrasing flags with direct fixes, mandatory QCO alerts, and ready-to-copy NIT tender specification clause block.
   - **Tender Specification Appendix Generator**: Printable and copyable official document format (`ExportBriefModal`).
5. **Standards Knowledge Base (`/standards`, `/standards/:code`)**: Searchable, filterable directory of Indian Standards across electrotechnical, civil, safety, utilities, and mechanical sectors.
6. **Procurement Audit History (`/history`)**: Complete audit history with search, sector filtering, and 1-click re-open.
7. **Model Transparency & Scope (`ModelTransparencyModal`)**: Dataset coverage disclosures, vector search methodology, and regulatory disclaimers.

## 4. Color System
- **Primary**: BIS Manak Red (`#B81D24`, hover `#991319`, light `#FDF2F2`, border `#F5C2C4`)
- **Secondary**: Deep Navy (`#0B132B`, `#1C2541`, `#334155`)
- **Accent**: Saffron (`#E67E22`, used sparingly for critical warnings and gap tags)
- **Base**: Warm Off-White (`#FAF8F5`, card `#FFFFFF`, surface `#F3EFEA`, border `#E5DFD5`)
- **Status Badges**: Current (`#15803D`), Under Revision (`#B45309`), Withdrawn (`#B91C1C`)
- **Guilloche Watermark**: Security guilloche background pattern integrated with low opacity.

## 5. API Endpoints
- `GET /api/standards` — Search and filter curated Indian Standards
- `GET /api/standards/{code}` — Detailed standard specifications with clauses and amendments
- `GET /api/standards/presets` — 5 curated SIH 26108 demonstration scenarios
- `POST /api/analyze-requirement` — Intelligent extraction, IS ranking, and gap analysis pipeline
- `GET /api/analyses` — List all past procurement analyses
- `GET /api/analyses/{id}` — Get single analysis report
- `DELETE /api/analyses/{id}` — Delete analysis report
- `GET /api/stats` — Analytics metrics (standards indexed, audits, precision, gaps prevented)
- `POST /api/export-tender-brief` — Export formatted tender appendix

## Update (this session)
- Brand: Hindi "मानक" emblem removed; wordmark is text-only "MANAK AI" (header, footer, landing hero). Landing hero now leads with the MANAK AI wordmark + one-line description of what it does.
- Background: user-supplied guilloche security-paper image served from `frontend/public/manak-bg.webp`; applied as a fixed, masked `body::before` layer (opacity 0.32) plus a hero watermark (`.guilloche-watermark`, 0.4).
- De-fabricated data: invented tender departments, budget figures, officer persona ("CPWD / GeM Desk") and inflated metrics removed.
  - `budget_range` renamed to `conformity_scheme` (backend model, routers, seed, TS types, UI) and now carries real BIS conformity assessment schemes (Scheme-I ISI Mark, Scheme-II CRS, QCO references).
  - `department` now holds real BIS technical departments (ETD, CED, PGD, PCD).
  - `/api/stats` returns live DB counts only (no floor values, no invented precision/"gaps prevented" figures).
  - Footer carries an explicit BIS (bis.gov.in) sourcing + curated-subset disclaimer.
- Typography: switched from Plus Jakarta Sans / JetBrains Mono to **Lato** (the typeface used on bis.gov.in) for all UI text and headings, with **IBM Plex Mono** for institutional metadata labels. Loaded via @fontsource/lato + @fontsource/ibm-plex-mono in index.css; heading tracking relaxed to -0.005em.
