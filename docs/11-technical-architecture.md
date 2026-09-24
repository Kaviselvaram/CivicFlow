# 11 — Technical Architecture

## 1. System Architecture Overview

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT (BROWSER)                              │
│                                                                        │
│  • Next.js App Router (React 19 / TypeScript)                          │
│  • Editorial Design System (Tailwind CSS + Custom CSS Variables)       │
│  • Custom SVG Icon Engine & Interactive Canvas / Leaflet Mapping       │
│  • Framer Motion & CSS Micro-Interactions                              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ HTTP / JSON
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS BACKEND ENGINE                          │
│                                                                        │
│  ├── Middleware (Session Auth & Role Guards: CITIZEN vs AUTHORITY)    │
│  ├── API Route Handlers (/api/auth, /api/issues, /api/triage)          │
│  ├── AI Classification Engine (Heuristic NLP + Semantic Rule Triage)   │
│  ├── File Upload Handler (Data URL / Local Public Asset Storage)       │
│  └── Audit Logger (Status History Event Bus)                           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                  │
│                                                                        │
│  • Relational Schema (SQLite via Prisma ORM)                           │
│  • ACID Transactions for Status Transitions & Audit History            │
│  • Deterministic Seed Generator for Realistic Municipal Scenarios       │
└────────────────────────────────────────────────────────────────────────┘
```

## 2. Technology Choices & Justification
- **Framework: Next.js (App Router, TypeScript):** First-class server rendering, snappy client hydration, integrated API routes, and standard industry adoption.
- **Styling: Tailwind CSS + Editorial Custom Tokens:** High development velocity with custom semantic color variables (`--surface-canvas`, `--civic-terracotta`, `--civic-pine`) and strict typography pairing (`Fraunces` + `Plus Jakarta Sans`).
- **Database: SQLite with Prisma ORM:**
  - Complete relational schema with foreign key constraints and transactional integrity.
  - Zero external database installation barrier: works out-of-the-box on macOS/Linux/Docker with no external daemon required.
  - Effortlessly upgradable to PostgreSQL in enterprise production without changing ORM models.
- **Mapping: Leaflet / Interactive Geo-Canvas & SVG Map:**
  - Completely self-contained, no external credit card or Google Maps API key required to view or place markers.
  - Custom SVG markers styled with CivicFlow category glyphs and priority colors.
- **Authentication: Iron-Session / Secure Cookie JWT:**
  - Stateless, encrypted session cookies with server-side validation.
  - Direct 1-click Demo Account switches for frictionless instant evaluation by reviewers.
