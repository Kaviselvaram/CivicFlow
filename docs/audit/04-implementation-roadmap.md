# 04 — Implementation Roadmap & Production Path

**Project:** CivicFlow  
**Version:** 1.0.0 Release Architecture  
**Date:** October 15, 2026  

---

## 1. Overview & Strategy

This roadmap details the systematic evolution of CivicFlow from its current verified, hardened MVP state into a municipal-grade, cloud-deployed civic infrastructure product. 

The strategy prioritizes operational reliability, strict authorization boundaries, and verifiable citizen signoff before decorative visual embellishment.

---

## 2. Phase-by-Phase Implementation Plan

### Phase A: Core Hardening & Security (COMPLETED IN CURRENT CYCLE)
- **Deliverables:**
  - Strict role-based authorization guard on `/authority/*` routes and mutation endpoints.
  - Lifecycle state machine preventing illegal status transitions.
  - BOLA protection on `/verify` and `/reopen` preventing unauthorized cross-user mutations.
  - Dedicated `/api/upload` endpoint with magic-byte validation and 5MB size limit.
  - Elimination of all React 19 / ESLint compiler errors.
- **Definition of Done:** All 10 security tests in `tests/security-lifecycle.ts` pass cleanly with 100% success.

---

### Phase B: Citizen Experience & Usability (COMPLETED IN CURRENT CYCLE)
- **Deliverables:**
  - 5-step rapid reporting wizard with client-side Canvas downsampling (<1600px).
  - Synchronized real-time status updates in `VerificationPrompt` via `useRouter().refresh()`.
  - Pixel-perfect Before/After resolution proof comparison slider using CSS `clip-path`.
  - Protected Citizen Dashboard isolating individual resident reports.
- **Definition of Done:** Citizen can register, report an issue, track dispatch progress, inspect photographic proof, verify resolution, or reopen unsatisfactory repairs.

---

### Phase C: Municipal Operations & Triage (COMPLETED IN CURRENT CYCLE)
- **Deliverables:**
  - Operations Command Center with synchronized metrics ribbon, issue table, and live map view.
  - Keyed `TriageDrawer` enabling department reassignment, priority override, crew dispatch, and proof photo upload.
  - Mandatory resolution remarks when advancing issues to `RESOLVED`.
- **Definition of Done:** Authority supervisor can triage unassigned work orders, dispatch crews, and submit resolution proof without data corruption.

---

### Phase D: AI, Maps & Evidence Management (COMPLETED & STABILIZED)
- **Deliverables:**
  - 6-domain deterministic heuristic classifier running zero-latency NLP across civic keywords.
  - Optional OpenAI LLM integration with 3.5s timeout and automatic local heuristic fallback.
  - Custom vector cartography with coordinate mapping and sector reverse-geocoding.
  - Automated AI evaluation test suite verifying classification accuracy.
- **Definition of Done:** AI classification achieves ≥95% accuracy on standard municipal test prompts.

---

### Phase E: Production Cloud Infrastructure (NEXT RELEASE MILESTONE)
- **Scope:**
  - **Database Migration:** Transition from local SQLite to managed PostgreSQL (Supabase / AWS RDS).
    - Update `prisma/schema.prisma` datasource provider to `postgresql`.
    - Run `prisma migrate dev --name init_postgres`.
    - Configure connection pooling via Prisma Accelerate or PgBouncer.
  - **Cloud Media Storage:** Transition from local `/public/uploads` to Cloudflare R2 or AWS S3.
    - Implement S3 client using `@aws-sdk/client-s3`.
    - Issue presigned upload URLs to offload file uploads directly from browser to object store.
- **Acceptance Criteria:** Zero filesystem dependencies in serverless deployment environment; media persistence survives cold container restarts.

---

### Phase F: Real-World GIS Integration (OPTIONAL EXTENSION)
- **Scope:**
  - Replace deterministic sector geocoding with OpenStreetMap Nominatim or Mapbox Geocoding API.
  - Implement browser Geolocation API button in Report Wizard ("Use Current GPS").
  - Add client-side reverse-geocoding cache to prevent rate-limit exhaustion.
- **Acceptance Criteria:** Clicking "Use Current GPS" accurately populates municipal ward and nearest street address.

---

### Phase G: Notification & Citizen Messaging Loop
- **Scope:**
  - Outbound email dispatch via Resend or SendGrid when an issue transitions to `RESOLVED`.
  - SMS notification option via Twilio for critical emergency hazards.
  - In-app notification bell on citizen navbar.
- **Acceptance Criteria:** Reporter receives email with direct link to verification prompt upon field crew completion.

---

### Phase H: Release Governance & Production Deployment
- **Scope:**
  - Containerization via multi-stage `Dockerfile`.
  - Continuous Integration (CI) pipeline running `npm run lint`, `npx tsc --noEmit`, and `npm run test` on every pull request.
  - Environment variable validation using `@t3-oss/env-nextjs` or Zod schema.
- **Acceptance Criteria:** Production container boots cleanly with healthcheck endpoint responding HTTP 200 within 50ms.
