# 05 — MVP Scope & Boundary Definition

## In-Scope: Non-Negotiable Core Deliverables

### Citizen Experience
1. **Authentication:**
   - Registration and login for citizen accounts.
   - Demo 1-click accounts for instant evaluation.
2. **Issue Submission:**
   - Multi-step guided wizard (5 steps: Category, Photo, Map Location, Description, Review).
   - Real-time AI classification recommendation (Category, Department, Priority).
   - Instant ticket generation with tracking reference code (e.g., `#CF-8921`).
3. **Issue Tracking & Verification:**
   - Citizen dashboard displaying submitted issues with status chips and SLA progress.
   - Deep-dive issue detail page with chronological status timeline.
   - Dual-state resolution loop:
     - `Confirm Resolution` (marks ticket `VERIFIED` with citizen rating).
     - `Issue Persists / Reopen` (marks ticket `REOPENED` with escalation flag).

### Authority Experience
1. **Operations Command Center:**
   - Real-time metrics overview (Total, In Triage, Active, Resolved, Verification Rate).
   - Dual-view interface: Interactive Geospatial Operations Map + High-density Triage List.
   - Multi-dimensional filtering (Department, Priority, Status, Search).
2. **Issue Triage & Resolution:**
   - View complete issue details, citizen notes, and geolocation.
   - Override AI recommendations (Category, Department, Priority).
   - Assign to specialized department and field crew units.
   - State transition engine: `REPORTED` → `IN_REVIEW` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`.
   - Attach mandatory field resolution evidence (after photo + crew note).
3. **Operational Analytics:**
   - Key performance indicators: Mean Time to Resolution (MTTR), Department throughput, Resolution distribution chart.

### System & Engineering
- Clean relational database schema with full state history audit trail.
- RESTful Next.js API endpoints with role-based access validation.
- Realistic, high-fidelity municipal seed dataset covering multiple wards and issue types.
- Polished responsive design supporting mobile, tablet, and desktop viewports.

## Explicitly Out-of-Scope for MVP (Deferred to MVP+)
- Native iOS/Android apps (Target: responsive progressive web app).
- Complex SMS gateway integrations (use in-app notifications and timeline status).
- Municipal ERP bidirectional sync (e.g., SAP/Cityworks deep webhooks).
- Autonomous AI resolution decisions (AI provides recommendations only; authority supervision required).
- Hardware IoT sensor integrations (smart bin telemetry, tilt sensors).
