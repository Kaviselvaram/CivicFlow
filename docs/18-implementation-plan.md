# 18 — Step-by-Step Implementation Plan

## Phase 0: Environment Inspection & Scaffold
- [x] Inspect Node.js v24 environment & git repository.
- [ ] Initialize Next.js 15+ App Router project with TypeScript and Tailwind CSS.
- [ ] Install core dependencies: `prisma`, `@prisma/client`, `lucide-react` (or custom SVGs), `bcryptjs`, `jose` (JWT), `canvas-confetti` (for verification celebration).

## Phase 1–4: Documentation Complete
- [x] Created `00-project-vision.md` through `20-completion-checklist.md`.

## Phase 5: Design Tokens & Custom SVG Component System
- [ ] Configure `tailwind.config.ts` and `app/globals.css` with exact editorial civic tokens (warm limestone canvas `#FBF9F5`, civic terracotta `#E05A47`, pine `#19382F`, cobalt `#244B5C`, ochre `#D97706`).
- [ ] Setup custom typography (`Fraunces` editorial serif + `Plus Jakarta Sans` grotesk).
- [ ] Build reusable UI primitives: `Button`, `Badge`, `Input`, `Textarea`, `Modal`, `Drawer`, `Toast`, `Card`.
- [ ] Create custom SVG icon collection with uniform 2px stroke geometry.

## Phase 6: Database & Backend Engine
- [ ] Define SQLite database schema in `prisma/schema.prisma`.
- [ ] Generate migrations and seed database with rich, realistic municipal data (multiple wards, departments, field crews, active issues in diverse stages with before/after photos).
- [ ] Implement robust auth & session helpers (`/api/auth/login`, `/api/auth/register`, `/api/auth/demo`, `/api/auth/me`).
- [ ] Implement issues CRUD and state advancement endpoints (`/api/issues`, `/api/issues/[id]/status`, `/api/issues/[id]/verify`, `/api/issues/[id]/reopen`).
- [ ] Implement AI classification engine (`/api/ai/classify`).

## Phase 7: Public Showcase & Landing Page
- [ ] Build editorial navigation with live city operational pulse.
- [ ] Build Hero with typography mask reveal and dual CTAs.
- [ ] Build "The Civic Black Hole vs CivicFlow" comparison visual.
- [ ] Build 5-Stage Lifecycle interactive showcase (Capture, Understand, Assign, Resolve, Verify).
- [ ] Build Interactive Civic Map preview with live issue markers and resolution cards.
- [ ] Build Transparency and SLA audit section with live district metrics.
- [ ] Build Editorial footer with public service commitments.

## Phase 8: Citizen Experience
- [ ] Auth login/register view with 1-click Demo switch.
- [ ] 5-Step Rapid Reporting Wizard (`/report`) with Category tiles, Photo upload, Interactive Map pin placement, Real-time AI classification recommendation, and Confirmation receipt.
- [ ] Citizen Dashboard (`/citizen/dashboard`) with My Reports list and status filters.
- [ ] Issue Detail View (`/citizen/reports/[id]`) with chronological timeline, before/after resolution photos, and Verify / Reopen action drawer.

## Phase 9: Authority Operations Command Center
- [ ] Operations Dashboard (`/authority/dashboard`) with real-time incident counters.
- [ ] Geospatial operations map with priority clustering.
- [ ] High-density triage table with column filters (Department, Priority, Status, Search).
- [ ] Triage slide-over drawer: Override AI category/priority, assign department and crew.
- [ ] Status transition modal: Move status to `RESOLVED` with required notes and resolution proof photo.
- [ ] Operational Analytics view (`/authority/analytics`) with MTTR, resolution velocity, and ward density.

## Phase 10: Testing, QA, Refinement & Documentation
- [ ] End-to-end user journey verification: Citizen reports -> AI classifies -> Authority assigns -> Resolves -> Citizen verifies -> Reopen test.
- [ ] Build validation (`npm run build`).
- [ ] Automated and manual testing.
- [ ] Comprehensive README.md with setup instructions, demo credentials, and architectural diagrams.
