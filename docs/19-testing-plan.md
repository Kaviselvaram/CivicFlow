# 19 — Quality Assurance & Testing Plan

## 1. Test Strategy Overview
The testing plan verifies that CivicFlow is not merely a visual prototype, but a resilient, production-ready full-stack application with strict role enforcement and complete state machine integrity.

## 2. Testing Levels & Matrix

| Level | Scope | Method / Tool | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **Type Check** | Static TypeScript analysis across components, API routes, Prisma models | `tsc --noEmit` | 0 type errors |
| **Unit & Heuristics**| AI classification NLP engine, regex matching, priority matrix | Automated test suite | 100% correct classification of core municipal phrases |
| **API Integration** | Auth endpoints, Issue creation, Status transitions, Verify & Reopen | HTTP integration test script | 200/201 status codes, role enforcement (401/403) |
| **End-to-End Workflow** | Full citizen-to-authority-to-verification loop | Browser subagent & manual verification script | Complete loop executes from ticket creation to verified seal |
| **Responsive & a11y** | Viewports (375px mobile to 1920px desktop), keyboard focus | Browser inspection & accessibility audit | No overflow, clean focus states, 0 blocking layout issues |
| **Production Build** | Static generation, SSR routes, asset bundling | `npm run build` | Clean production build with 0 compiler errors |

## 3. Mandatory Workflow Verification Scenarios

### Scenario A: The Complete Happy Path
1. Citizen logs in via Demo Citizen account.
2. Navigates to `/report`.
3. Selects category "Roads & Potholes", snaps photo, pinpoints coordinates on map.
4. Types "Deep pothole damaging car tires near bus stop".
5. Verifies AI recommendation cards suggests Roads Department & High priority.
6. Submits issue; ticket `#CF-XXXX` is created with status `REPORTED`.
7. Switches to Authority Operations Center (`/authority/dashboard`).
8. Finds new ticket in Triage queue, views location and description.
9. Sets department to "Department of Public Works" and assigns "Road Patching Crew Bravo".
10. Advances status: `REPORTED` → `IN_REVIEW` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`.
11. Uploads resolution proof photo showing smoothed asphalt patch.
12. Switches back to Citizen account.
13. Opens `/citizen/reports/[id]`.
14. Inspects before/after comparison photo and timeline notes.
15. Clicks "Confirm Resolution" and submits 5-star rating.
16. Verifies status advances to `VERIFIED` and verification badge is permanently displayed.

### Scenario B: Unhappy Path / Citizen Reopen
1. Authority marks an issue as `RESOLVED`.
2. Citizen reviews site, finds defect still active.
3. Citizen clicks "Issue Persists (Reopen)" and inputs reason.
4. Issue status moves to `REOPENED` with escalation priority.
5. Authority triage list immediately highlights the reopened ticket with urgent alert badge.
