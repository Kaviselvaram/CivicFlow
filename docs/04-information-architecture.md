# 04 — Information Architecture

## Sitemap & Route Topology

```text
CIVICFLOW (Root)
│
├── / (Public Landing & Narrative Showcase)
│   ├── #hero (Interactive Visual Hero + Instant Action)
│   ├── #problem (The Broken Civic Black Hole Visualized)
│   ├── #how-it-works (Pinned Storytelling: 5-Stage Lifecycle)
│   ├── #map-preview (Live Interactive City Issues Heatmap)
│   ├── #transparency (Public SLA & Verification Metrics)
│   └── #cta (Civic Participation Commitment)
│
├── /login (Unified Authentication Portal with Role Selector & Demo Logins)
├── /register (Citizen Registration Portal)
│
├── /report (Citizen Rapid Reporting Wizard)
│   ├── Step 1: Category Selection (Visual Grid)
│   ├── Step 2: Evidence Photo (Upload / Camera)
│   ├── Step 3: Precise Geo-Location (Interactive Map Pin + Reverse Geocode)
│   ├── Step 4: Description + Real-Time AI Suggestion Card
│   └── Step 5: Verification & Dispatch Confirmation
│
├── /citizen/dashboard (Citizen Portal)
│   ├── /citizen/reports (My Reports — Filter by Active, In-Progress, Resolved)
│   └── /citizen/reports/[id] (Interactive Timeline, Photo Audit, Verify/Reopen CTA)
│
└── /authority/dashboard (Municipal Operations Center)
    ├── /authority/issues (Interactive Data Grid + Map Dual-View)
    ├── /authority/issues/[id] (Triage Details, Crew Assignment, Status Engine, Proof Upload)
    └── /authority/analytics (Resolution Velocities, Department Leaderboards, Hotspot Analysis)
```

## Navigation Structure
- **Global Header (Sticky, Blur-Backdrop):**
  - Brand identity with live civic status indicator (`🟢 City Operations Active`).
  - Navigation links: `Explore Map`, `How it Works`, `Live Transparency`.
  - Action button: `Report an Issue` (High-contrast primary pill).
  - Auth trigger: Dynamic avatar / `Sign In` modal switch.
- **Citizen Navigation Drawer/Subheader:**
  - `My Submissions`, `Active Trackers`, `New Report (+)`.
- **Authority Command Bar:**
  - Department switcher, Priority filter pills, Live incident count badge, Quick Search (`⌘K`), Operations map toggle.

## Data Relationships across Screens
```text
Issue (Core Object)
├── Citizen (Reporter: Name, Phone, Email, Avatar)
├── Department (Target: Roads, Sanitation, Water, Electrical, Infra)
├── Crew (Assignee: Name, Contact, Dispatch Unit)
├── Location (Address, Latitude, Longitude, District/Ward)
├── StatusHistory[] (Array of { from, to, timestamp, actor, note })
├── Media[] (Original issue photo, Additional angles)
└── Resolution (ResolvedAt, ProofPhotoUrl, SupervisorNote, CitizenRating, VerifiedAt, ReopenedAt)
```
