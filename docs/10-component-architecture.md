# 10 — Component Architecture

## Component Tree & Design System Hierarchy

```text
components/
├── ui/ (Atomic Design System Primitives)
│   ├── Button.tsx (Primary Terracotta, Secondary Limestone, Ghost, Danger, Magnetic wrapper)
│   ├── Badge.tsx (Status badges, Priority pills, Department tags)
│   ├── Input.tsx (Accessible text input with focus ring & error states)
│   ├── Textarea.tsx (Accessible auto-expanding textarea)
│   ├── Select.tsx (Custom accessible select with SVG chevron)
│   ├── Modal.tsx (Accessible dialog with backdrop blur & keyboard ESC trap)
│   ├── Drawer.tsx (Slide-over triage panel for authority actions)
│   ├── Toast.tsx (Floating notification system)
│   ├── Skeleton.tsx (Loading placeholder shimmer)
│   └── Card.tsx (Editorial bordered cards with hover lift)
│
├── icons/ (Consistent Custom SVG Icon Language - 2px stroke, round caps)
│   ├── RoadIcon.tsx
│   ├── WasteIcon.tsx
│   ├── WaterIcon.tsx
│   ├── LightIcon.tsx
│   ├── InfraIcon.tsx
│   ├── TrafficIcon.tsx
│   ├── MapPinIcon.tsx
│   ├── CameraIcon.tsx
│   ├── CheckCircleIcon.tsx
│   ├── AlertTriangleIcon.tsx
│   ├── ClockIcon.tsx
│   ├── FilterIcon.tsx
│   ├── SearchIcon.tsx
│   ├── ArrowRightIcon.tsx
│   └── CivicFlowLogo.tsx
│
├── layout/ (Structural Application Shells)
│   ├── Navbar.tsx (Public & authenticated navigation with responsive drawer)
│   ├── Footer.tsx (Editorial civic footer with links and transparency pledge)
│   ├── CitizenShell.tsx (Citizen layout with breadcrumbs and active trackers)
│   └── AuthorityShell.tsx (Operations command layout with live ticker and quick actions)
│
├── citizen/ (Citizen-specific Feature Components)
│   ├── ReportWizard.tsx (5-step progressive disclosure wizard)
│   ├── CategorySelector.tsx (6-tile visual category picker)
│   ├── ImageUploader.tsx (Photo drag/drop & camera capture preview)
│   ├── LocationPicker.tsx (Interactive pin map with reverse geocoding)
│   ├── AIRecommendationCard.tsx (Real-time category & priority suggestion)
│   ├── IssueCard.tsx (Citizen dashboard issue card with status chip)
│   ├── IssueTimeline.tsx (Chronological visual audit trail with actor details)
│   ├── VerificationPrompt.tsx (Resolution confirmation / reopen actions)
│   └── SplitBeforeAfter.tsx (Interactive comparison slider for repairs)
│
└── authority/ (Authority Command Center Components)
    ├── MetricsRibbon.tsx (High-density telemetry counters)
    ├── OperationsMap.tsx (Interactive spatial map with priority clustering)
    ├── IssueTable.tsx (High-density triage data grid with column sorting)
    ├── TriageDrawer.tsx (Slide-over inspection, department override, assignment)
    ├── StatusTransitionModal.tsx (Status advancement with proof photo upload)
    └── AnalyticsCharts.tsx (Resolution velocity, category breakdown, ward stats)
```

## State Management Pattern
- **Server State:** Handled by Next.js Server Components and React Server Actions / REST API route fetches with SWR-style revalidation.
- **Client UI State:** Lightweight React hooks (`useState`, `useContext`) for auth session context, multi-step report wizard form state, map pin coordinates, and filter criteria.
- **Persistent Storage:** SQLite (via Prisma or robust relational SQLite database driver) for guaranteed zero-setup, rock-solid portability across any local machine, with full relational integrity and migrations.
