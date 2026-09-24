# 20 — Completion Checklist & Quality Acceptance

## 1. Product Requirements
- [ ] Citizen can register a new account.
- [ ] Citizen can login via email/password.
- [ ] 1-click Demo accounts provided for rapid evaluation (Citizen & Authority).
- [ ] Citizen can report issue through 5-step wizard.
- [ ] Citizen can upload visual evidence photo (camera / drag & drop).
- [ ] Citizen can select coordinates on interactive map with address reverse-geocoding.
- [ ] Citizen can track submitted issues on Citizen Dashboard with status badges.
- [ ] Issue detail page renders complete chronological status timeline with timestamps and actors.
- [ ] Citizen can confirm resolution (transitions to `VERIFIED` with digital seal).
- [ ] Citizen can reject resolution / flag incomplete (transitions to `REOPENED`).
- [ ] Authority can access Operations Command Center.
- [ ] Authority can inspect issues on both interactive map and high-density triage list.
- [ ] Authority can filter by department, priority, status, and search query.
- [ ] Authority can override category, priority, and assign specialized field crew.
- [ ] Authority can advance issue status and upload resolution proof photo.
- [ ] Operations dashboard displays real-time telemetry counters and analytics.
- [ ] AI classification engine provides instant category, department, and priority suggestions.
- [ ] Relational database stores all records, media URLs, and status history audit entries.

## 2. User Experience & Design
- [ ] Light theme foundation (warm paper `#FBF9F5`, civic terracotta `#E05A47`, pine `#19382F`).
- [ ] Distinctive typography pairing (Editorial serif `Fraunces` + Grotesk `Plus Jakarta Sans`).
- [ ] Custom SVG iconography with uniform stroke weight and geometry.
- [ ] Real-world photography used for all civic categories and before/after comparisons.
- [ ] Clean editorial layout: no generic cards, no generic SaaS templates.
- [ ] Micro-interactions on buttons, tabs, modal dialogs, and map pins.
- [ ] Fluid responsive layouts supporting mobile (375px), tablet (768px), and desktop (1280px+).
- [ ] Full keyboard accessibility, visible focus rings, and `prefers-reduced-motion` compliance.

## 3. Engineering & Code Quality
- [ ] TypeScript type-checking passes with 0 errors (`tsc --noEmit`).
- [ ] Clean REST API architecture with role authorization checks.
- [ ] Input validation on all form submissions and API routes.
- [ ] No hardcoded fake data in production routes; data sourced from seeded relational database.
- [ ] Production build succeeds without errors (`npm run build`).
- [ ] Comprehensive `README.md` and complete documentation in `/docs`.
