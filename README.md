# CivicFlow — Intelligent Civic Issue Reporting & Resolution Tracking Platform

> **"From civic observation to verified resolution."**  
> *Core UX Principle: Hide administrative complexity from citizens while exposing actionable operational intelligence to authorities.*

---

## 🏛️ Executive Summary

**CivicFlow** is an intelligent, human-centric municipal operations and civic defect resolution platform. While traditional 311 systems and municipal portals function as administrative black holes—where citizen observations disappear into bureaucratic silos—CivicFlow restructures municipal defect remediation into an auditable, collaborative 5-stage lifecycle:

```text
[ Physical Defect Observed ]
             │
             ▼
[ Step 1: Rapid Capture ] ──────► Mobile Intake + Camera + Interactive Cartography
             │
             ▼
[ Step 2: Intelligent Triage ] ─► Real-Time NLP Category, Dept & Priority Inference
             │
             ▼
[ Step 3: Operations Command ] ─► Geospatial Clustering + Crew Dispatch + SLA Timers
             │
             ▼
[ Step 4: Field Resolution ] ───► Remediation Executed + Mandatory Photo Proof
             │
             ▼
[ Step 5: Citizen Verification] ─► Citizen Confirms (VERIFIED) OR Flags (REOPENED)
```

---

## ✨ Core Features

### 👤 Citizen Experience
- **Progressive Disclosure Wizard (`/report`):** 5-step intuitive flow (Category, Visual Evidence, Precise Map Pinning, Natural Language Description, Summary Review).
- **Intelligent Real-Time Classification:** Instant AI suggestions recommending category, municipal department, and priority with explainable rationale as the citizen types.
- **My Reports Dashboard (`/citizen/dashboard`):** Real-time tracking of active dispatches, resolution signoffs, and closed tickets.
- **Interactive Before / After Resolution Verification (`/citizen/reports/[id]`):** Dual-layer comparison slider revealing the raw defect against field crew resolution photos.
- **Verification Seal vs Reopen Loop:** 1-click confirmation with star rating awarding the official civic verification seal, or reopen action with escalation rationale if work is incomplete.

### 🛡️ Authority Operations Center (`/authority/dashboard`)
- **Real-Time Operational Health Ribbon:** Telemetry tracking total incidents, critical triage counts, dispatched field units, pending verifications, and ward verification rate (%).
- **Interactive Geospatial Incident Map:** SVG/vector cartography with priority color-coding, critical alert pulse rings, and click-to-triage markers.
- **High-Density Triage Grid:** Multi-dimensional filtering by department, priority level, lifecycle status tabs, and full-text keyword search.
- **Slide-Over Triage Drawer:** Direct authority override for category/priority, assignment to specific municipal field crews, and status advancement controls.
- **Mandatory Field Evidence Requirement:** Field crews must attach photographic proof and resolution notes before an issue can be marked `RESOLVED`.
- **District Analytics (`/authority/analytics`):** Mean Time to Resolution (MTTR) trends, category distribution progress bars, and ward defect density metrics.

---

## 🎨 Design Philosophy: "Editorial Civic Modernism"

CivicFlow rejects the dull grey bureaucracy of legacy government portals and the neon gradients of generic tech templates.
- **Warm Canvas Foundation:** Soft limestone paper palette (`#FBF9F5`, `#F4EFEA`) with architectural hairline borders (`#E8E2D8`).
- **Typographic Distinction:** Pairing the dignified editorial serif **Fraunces** with the crystal-clear grotesk **Plus Jakarta Sans** and **JetBrains Mono**.
- **Coherent SVG Iconography:** 100% custom-crafted SVG icon language with uniform 2px stroke geometry and rounded joints.
- **Accessibility & Inclusivity:** Full WCAG 2.1 Level AA compliance, 14.8:1 contrast ratios, explicit keyboard focus rings, and `prefers-reduced-motion` fallbacks.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router with Turbopack, React 19, TypeScript) |
| **Styling** | Tailwind CSS + Custom CSS Variables & Design System Tokens |
| **Database** | SQLite via Prisma ORM (ACID relational audit trail) |
| **Authentication** | Encrypted JWT session cookies via `jose` & `bcryptjs` |
| **Cartography** | Self-contained Interactive Vector City Cartography Engine |
| **Intelligence** | Dual-Engine Classifier (Zero-latency NLP Heuristics + LLM hook) |
| **Delight** | Interactive Split Slider + Canvas Confetti Celebration |

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+` or `v11+`

### 2. Clone & Install Dependencies
```bash
git clone <repository-url>
cd civicflow
npm install
```

### 3. Environment Configuration
The project is pre-configured with local zero-setup defaults in `.env`:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="civicflow-development-secret-key-32chars-min-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
OPENAI_API_KEY="" # Optional: heuristic engine runs offline with zero latency
```

### 4. Database Setup & Seed Data
Initialize the SQLite database and populate it with realistic municipal scenarios:
```bash
npx prisma db push
npm run seed
```

This generates:
- **6 Municipal Departments:** Public Works, Waste Management, Water Supply, Electrical & Lighting, Parks & Infrastructure, Traffic Operations.
- **5 Dedicated Field Units:** Road Patching Crew Bravo, Rapid Asphalt Response, Sanitation Alpha, Hydro-Vac Drainage, Luminaire Lift #2.
- **Seeded Issues in Diverse Lifecycles:** `REPORTED`, `IN_PROGRESS`, `RESOLVED`, `VERIFIED`, and `REOPENED`.

### 5. Run the Application
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 👥 Instant Evaluation Demo Accounts

For frictionless review, the `/login` portal includes **1-Click Evaluation Buttons**:

| Role | Name | Email | Password | Pre-Seeded Context |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen (Resident)** | Maya Chen | `citizen@civicflow.org` | `CivicPass2026!` | Resident of Ward 4; tracks road defects and verifies completed repairs. |
| **Authority Supervisor**| David O'Connor | `authority@civicflow.org` | `CivicPass2026!` | Superintendent of Public Works; triages incidents and dispatches crews. |

---

## 🧪 Testing & Quality Assurance

Run the automated integration test suite:
```bash
npx tsx tests/e2e-workflow.ts
```

This verifies:
1. `POST /api/ai/classify`: Natural language classification and risk prioritization.
2. `POST /api/auth/demo`: Session creation and role assignment.
3. `POST /api/issues`: Ticket generation and initial audit logging.
4. `PATCH /api/issues/[id]/triage`: Authority department and priority overrides.
5. `POST /api/issues/[id]/status`: Lifecycle advancement to `IN_PROGRESS` and `RESOLVED` with photographic proof.
6. `POST /api/issues/[id]/verify`: Citizen 5-star signoff and permanent verification seal.
7. `POST /api/issues/[id]/reopen`: Citizen rejection of incomplete work and priority escalation.
8. `GET /api/analytics`: District resolution metrics and MTTR calculations.

To execute the static type check and production build:
```bash
npm run build
```

---

## 📂 Project Architecture

```text
civicflow/
├── app/
│   ├── page.tsx                     # Editorial Landing & Civic Narrative Showcase
│   ├── layout.tsx                   # Font definitions (Fraunces + Plus Jakarta Sans)
│   ├── globals.css                  # Design tokens, color system, and utility styles
│   ├── login/page.tsx               # Unified Auth & 1-Click Demo Switcher
│   ├── report/page.tsx              # 5-Step Citizen Reporting Wizard
│   ├── citizen/
│   │   ├── dashboard/page.tsx       # Resident Submissions & Active Trackers
│   │   └── reports/[id]/page.tsx    # Detail View, Split Slider, & Verification Drawer
│   ├── authority/
│   │   ├── dashboard/page.tsx       # Operations Command Center
│   │   └── analytics/page.tsx       # District MTTR & SLA Analytics
│   └── api/                         # REST API Route Handlers
│       ├── ai/classify/route.ts
│       ├── analytics/route.ts
│       ├── auth/[login|register|demo|logout|me]/route.ts
│       └── issues/[route|id|triage|status|verify|reopen]/route.ts
│
├── components/
│   ├── ui/                          # Atomic Primitives (Button, Badge, Input, Modal, Toast, Card)
│   ├── icons/                       # 100% Custom SVG Icon Language
│   ├── layout/                      # Navbar & Footer
│   ├── map/                         # InteractiveCityMap (Vector Cartography & Picker)
│   ├── citizen/                     # ReportWizard, SplitBeforeAfter, IssueTimeline, VerificationPrompt
│   └── authority/                   # MetricsRibbon, IssueTable, TriageDrawer, AuthorityDashboardClient
│
├── lib/
│   ├── db.ts                        # Prisma Client Singleton
│   ├── auth.ts                      # JWT Session & Cookie Handlers
│   ├── ai.ts                        # Intelligent NLP Classification Engine
│   └── types.ts                     # Domain TypeScript Definitions & Category Configs
│
├── prisma/
│   ├── schema.prisma                # Relational SQLite Schema
│   └── seed.ts                      # Deterministic Municipal Seed Generator
│
├── docs/                            # 21 Architectural & System Specifications
└── tests/
    └── e2e-workflow.ts              # End-to-End Integration Test Suite
```

---

## 📚 Complete Architectural Documentation (`/docs`)

All system blueprints are maintained in the `/docs` directory:
- [`00-project-vision.md`](docs/00-project-vision.md)
- [`01-product-requirements.md`](docs/01-product-requirements.md)
- [`02-user-personas.md`](docs/02-user-personas.md)
- [`03-user-journeys.md`](docs/03-user-journeys.md)
- [`04-information-architecture.md`](docs/04-information-architecture.md)
- [`05-mvp-scope.md`](docs/05-mvp-scope.md)
- [`06-design-direction.md`](docs/06-design-direction.md)
- [`07-design-system.md`](docs/07-design-system.md)
- [`08-animation-system.md`](docs/08-animation-system.md)
- [`09-page-specifications.md`](docs/09-page-specifications.md)
- [`10-component-architecture.md`](docs/10-component-architecture.md)
- [`11-technical-architecture.md`](docs/11-technical-architecture.md)
- [`12-database-schema.md`](docs/12-database-schema.md)
- [`13-api-contract.md`](docs/13-api-contract.md)
- [`14-ai-features.md`](docs/14-ai-features.md)
- [`15-asset-sourcing.md`](docs/15-asset-sourcing.md)
- [`16-accessibility.md`](docs/16-accessibility.md)
- [`17-performance.md`](docs/17-performance.md)
- [`18-implementation-plan.md`](docs/18-implementation-plan.md)
- [`19-testing-plan.md`](docs/19-testing-plan.md)
- [`20-completion-checklist.md`](docs/20-completion-checklist.md)

---

## 📷 Photographic Asset Sources

All media assets are sourced under open licenses from [Unsplash](https://unsplash.com) with complete attribution recorded in [`/docs/15-asset-sourcing.md`](docs/15-asset-sourcing.md):
- Pothole Defect: Matt Boitor (`https://images.unsplash.com/photo-1515162816999-a0c47dc192f7`)
- Cured Asphalt Resolution: Patrick Hendry (`https://images.unsplash.com/photo-1578575437130-527eed3abbec`)
- Waste Accumulation: Nick Fewings (`https://images.unsplash.com/photo-1530587191325-3db32d826c18`)
- Cleaned Sidewalk: Pawel Czerwinski (`https://images.unsplash.com/photo-1563245372-f21724e3856d`)
- Streetlight Outage: Jack B (`https://images.unsplash.com/photo-1509198397868-475647b2a1e5`)
- LED Luminaire Repair: Aleksandr Popov (`https://images.unsplash.com/photo-1519501025264-65ba15a82390`)
- Water Main Burst: Scott Rodgerson (`https://images.unsplash.com/photo-1544717305-2782549b5136`)
- Dry Drainage Valve: Etienne Girardet (`https://images.unsplash.com/photo-1584467735871-8e85353a8413`)

---

## 🚀 Known Limitations & MVP+ Roadmap
1. **SMS Gateway:** MVP utilizes instant in-app alerts and timeline progress; SMS gateway (Twilio) can be connected for non-smartphone push notifications.
2. **Cityworks / SAP ERP Webhooks:** Ready for bidirectional webhook dispatch via `/api/issues/[id]/status`.
3. **Automated Duplicate Spatial Clustering:** Heuristic spatial bounding box grouping can be expanded to multi-ward density heatmaps in MVP+.

---

## ⚖️ License
Released under the [MIT License](LICENSE). Built for open, transparent, and collaborative municipal governance.
