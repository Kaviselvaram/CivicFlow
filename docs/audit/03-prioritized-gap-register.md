# 03 — Prioritized Gap Register

**Project:** CivicFlow  
**Classification:** Engineering & Security Audit  
**Status:** Audit & Remediation Log  

---

## Priority Severity Classification Standard
- **P0 — Critical:** Security vulnerabilities, data loss, broken core workflows, authorization bypass.
- **P1 — High:** Missing or broken core functionality, inaccurate data, major usability bottlenecks, unhandled failures.
- **P2 — Medium:** Incomplete workflows, weak responsive behavior, accessibility gaps, visual inconsistencies.
- **P3 — Polish:** Advanced decorative motion, optional 3D models, nonessential enhancements.

---

## 1. Resolved & Hardened Gaps (Implemented in This Session)

| ID | Priority | Affected Domain | Finding / Weakness | Impact & Risk | Resolution Implemented | Verification Method |
| :--- | :---: | :--- | :--- | :--- | :--- | :--- |
| **GAP-01** | **P0** | **Authorization** | Missing role check on `PATCH /api/issues/[id]/triage` and `POST /api/issues/[id]/status` (defaulted to demo authority). | Any unauthenticated user or citizen could triage issues and advance work order status. | Added server-side authorization guard requiring `currentUser.role === 'AUTHORITY' \|\| role === 'ADMIN'`. Returns 401/403. | Automated Security Test S1 & S2 |
| **GAP-02** | **P0** | **Lifecycle Engine** | No validation of issue status transitions in `POST /api/issues/[id]/status`. | Work orders could jump directly from `REPORTED` to `VERIFIED` without repair. | Implemented strict state machine transition graph. Transition to `RESOLVED` strictly mandates resolution notes. | Automated Security Test S4 & S5 |
| **GAP-03** | **P0** | **Citizen Verification (BOLA)** | `/api/issues/[id]/verify` and `/api/issues/[id]/reopen` allowed arbitrary users to verify/reopen issues. | Citizen A could approve or reopen Citizen B's reported issues; non-resolved issues could be verified. | Enforced: 1) Must be in `RESOLVED` status to verify, 2) Only reporting citizen can verify/reopen, 3) Auto-escalates priority on reopen. | Automated Security Test S6, S7, S8, S9 |
| **GAP-04** | **P0** | **Route Protection** | `/authority/dashboard` and `/authority/analytics` had no server-side route guards. | Any anonymous visitor or citizen navigating to `/authority/dashboard` was served municipal operational records. | Added server component route guards redirecting unauthenticated visitors to `/login` and citizens to `/citizen/dashboard`. | Tested via browser subagent & direct URL navigation |
| **GAP-05** | **P1** | **Data Integrity** | Analytics routes (`/authority/analytics` and `/api/analytics`) displayed fabricated values (26.4h MTTR, 96% verification rate) when counts were zero or missing. | Presenting fabricated metrics in municipal analytics compromises institutional trust. | Replaced all hardcoded fallbacks with empirical calculations from actual database records (`resolvedAt - createdAt`). | Automated Analytics Test A4 & A5 |
| **GAP-06** | **P1** | **Media Upload** | Missing dedicated evidence upload endpoint; direct FileReader base64 strings risked SQLite payload bloat. | Mobile camera uploads (5–12MB) could crash server payload limit or exhaust SQLite string buffers. | Built dedicated `/api/upload` endpoint with MIME validation, binary magic-byte checks, 5MB limit, and client-side Canvas downsampling. | Automated Security Test S10 & ReportWizard test |
| **GAP-07** | **P1** | **Sequential Ticket Collisions** | Ticket numbering used `CF-${1000 + count + 1}`; deleting or seeding issues caused unique constraint collision. | `Unique constraint failed on ticketNumber` crash during issue creation. | Replaced with safe sequential scanner querying highest existing `CF-${seq}` and incrementing safely. | End-to-End Test 3 & Multiple sequential report runs |
| **GAP-08** | **P2** | **React 19 & ESLint Errors** | 6 compilation errors in `SplitBeforeAfter.tsx` (ref access during render), `TriageDrawer.tsx` (setState in effect), and `ReportWizard.tsx`. | Console warnings, cascading re-renders, and potential Next.js Turbopack build failures. | 1) Refactored comparison slider to pure CSS `clip-path`, 2) Split TriageDrawer into keyed component, 3) Debounced description checks in ReportWizard. ESLint now exits with 0 errors. | `npm run lint` & `npx tsc --noEmit` clean exit |
| **GAP-09** | **P2** | **Citizen UX State Sync** | `VerificationPrompt.tsx` closed modal without triggering `router.refresh()`. | Issue detail page remained in `RESOLVED` state after citizen verification until manual page reload. | Injected `useRouter().refresh()` in both verification and reopening confirmation callbacks. | Verified in citizen detail view |
| **GAP-10** | **P2** | **Dependency Hygiene** | `lucide-react` declared in dependencies but never used in UI code (all custom SVGs). | Unnecessary bundle weight and phantom dependency warnings. | Removed `lucide-react` from `package.json`; preserved custom SVG icon language in `components/icons/index.tsx`. | `npm run build` verified |

---

## 2. Outstanding Production Gaps (Roadmap for Final Release)

| ID | Priority | Domain | Description | Impact | Recommended Production Solution |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **GAP-11** | **P1** | **Cloud Storage** | Uploaded evidence currently stored on local disk in `/public/uploads`. | On ephemeral serverless hosts (e.g. Vercel), uploaded images do not persist across redeployments. | Configure S3 / Cloudflare R2 bucket integration using `@aws-sdk/client-s3` with signed upload URLs. |
| **GAP-12** | **P1** | **Production Database** | Database configured as SQLite (`DATABASE_URL="file:./dev.db"`). | SQLite is ideal for zero-config portable evaluation, but concurrent multi-user write throughput is limited. | Migrate to managed PostgreSQL (Supabase, Neon, AWS RDS) by changing Prisma datasource provider and running `prisma migrate deploy`. |
| **GAP-13** | **P2** | **External GIS Service** | Reverse-geocoding currently uses deterministic sector estimation. | Real-world street addresses require external geocoding API keys (Mapbox, Google Maps, OpenStreetMap Nominatim). | Integrate OpenStreetMap Nominatim or Mapbox Reverse Geocoding API with client caching. |
| **GAP-14** | **P2** | **Citizen Notification Engine** | No email or SMS notifications sent when status advances to `RESOLVED`. | Citizens must manually check the web app to verify resolutions. | Integrate Resend or Twilio webhook to dispatch notification when issue status transitions to `RESOLVED`. |
| **GAP-15** | **P3** | **Advanced GSAP Motion** | Hero section uses CSS grid and radar pulse animations rather than GSAP ScrollTrigger timeline. | Purely visual enhancement; existing CSS/Framer motion is smooth and accessible. | Optionally add GSAP ScrollTrigger sequence for the 5-stage lifecycle section on larger screens. |
