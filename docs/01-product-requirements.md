# 01 — Product Requirements Document (PRD)

## 1. Product Objectives
- **Empower Citizens:** Enable any resident to record an issue in under 60 seconds with location auto-detection, image upload, and AI classification.
- **Streamline Municipal Workflows:** Equip city operators with a high-density triage dashboard featuring spatial clustering, status kanban/table, crew assignment, and SLA timers.
- **Enforce Resolution Verification:** Close the loop by requiring visual evidence upon resolution and citizen verification (Approve / Reopen).

## 2. User Roles & Access Matrix
| Role | Capabilities |
| :--- | :--- |
| **Citizen (Public)** | Register, login, report civic defects, view public civic feed/map, track own submissions, receive status updates, verify resolution, reopen failed work orders. |
| **Authority / Supervisor** | Access Operations Command Center, view district map with severity heatmap, filter by department/priority/status, reassign department/crew, update issue status, attach resolution proof, review analytics. |
| **Public Observer (Guest)**| Explore landing page, browse public verified resolutions, view live issue map counter, search neighborhood defects. |

## 3. Functional Requirements

### 3.1 Authentication & Profile
- Email/Password login and registration with role separation (`CITIZEN` vs `AUTHORITY`).
- Session management with JWT / secure cookies.
- Quick switch demo login for immediate review during evaluation.

### 3.2 Citizen Issue Reporting Flow (5-Step Progressive Disclosure)
1. **Category Selection:** 6 Core civic categories with custom visual icons:
   - Roads & Potholes
   - Solid Waste & Sanitation
   - Water Supply & Drainage
   - Streetlights & Electrical
   - Public Infrastructure & Parks
   - Traffic & Encroachment
2. **Visual Evidence:** Real-time photo upload with preview, file size check, and camera trigger.
3. **Precise Geo-Location:** Interactive pin placement on map, automatic reverse-geocoding into human-readable street addresses, and quick "Use Current Location" GPS trigger.
4. **Description & AI Recommendation:** Natural language input field; triggers real-time heuristic & semantic inference suggesting category, department, and priority with explanation.
5. **Review & Dispatch:** Summary card showing all captured data, estimated SLA, and instant confirmation receipt with ticket ID.

### 3.3 Citizen Tracking & Verification
- **My Reports Dashboard:** Tabular and card views filtering by Active, In Progress, Resolved, and Verified.
- **Live Issue Detail & Visual Audit Trail:** Chronological stepper showing:
  - *Reported* (Timestamp + submitter details)
  - *Under Review* (Department triaged)
  - *Assigned* (Field crew dispatched)
  - *In Progress* (Crew on-site)
  - *Resolved* (Resolution timestamp + field resolution proof photo + crew notes)
  - *Verified* (Citizen approved) OR *Reopened* (Citizen flagged incomplete)
- **Verification CTA:** When an issue is marked `RESOLVED`, citizen is prompted with a 1-click "Confirm Resolution" or "Issue Persists (Reopen)" action with rationale.

### 3.4 Authority Operations Command Center
- **Metrics Bar:** Total Reports, Urgent Triage Count, Active Crews, Resolved This Week, Verification Rate (%).
- **Interactive Operations Map:** Interactive markers colored by priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), cluster view, click-to-preview drawer.
- **Triage Queue & Filter Engine:** Filter by Department (Public Works, Waste Management, Water & Sewage, Electrical, Traffic), Priority, Status, and Search query.
- **Issue Action Modal / Drawer:**
  - Override category and priority.
  - Assign to specific municipal crew or contractor.
  - Transition status: `REPORTED` → `IN_REVIEW` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED`.
  - Mandatory resolution note and resolution photo upload.
- **District Analytics:** Breakdown of response time by department, weekly resolution velocity, and neighborhood hotspot counts.

## 4. Non-Functional Requirements
- **Performance:** Initial render < 1.2s; LCP < 1.8s; client-side bundle optimized.
- **Accessibility:** WCAG 2.1 AA compliant; keyboard navigable tabs and modals; visible focus rings; prefers-reduced-motion respected.
- **Security:** Strict role authorization guard on authority routes; sanitized inputs; rate limiting on report creation.
- **Responsiveness:** Fluid scaling across 320px mobile viewport, 768px tablet, 1280px laptop, and 1920px desktop.
