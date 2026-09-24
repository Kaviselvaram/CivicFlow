# 09 — Page Specifications & Layout Blueprints

## 1. Landing Page (`/`)
- **Header:** Sticky translucent bar (`backdrop-blur-md bg-canvas/80`), logo mark with live status badge ("Wards Active: 12"), nav links, "Sign In" button, and prominent "Report an Issue" CTA.
- **Section 1: Hero & Vision:**
  - Editorial headline: *"Civic problems should have a visible ending."*
  - Dual action pills: `Report an Issue` (Terracotta primary) & `Explore Live Map` (Limestone secondary).
  - Real-time city telemetry counter: Live Active Issues (34), Average Resolution Time (26.4 hrs), Verified Rate (98.2%).
  - Interactive Visual Component: Real-world city map with interactive defect markers and hover cards showing before/after resolution snapshots.
- **Section 2: The Civic Black Hole vs CivicFlow:**
  - Visual side-by-side: The old 311 void (complaints lost) vs the CivicFlow transparent loop.
- **Section 3: How It Works (The 5-Stage Civic Lifecycle):**
  - Step 1: Capture (Camera + GPS)
  - Step 2: Understand (AI Classification & Department Routing)
  - Step 3: Assign (Field Crew Dispatch)
  - Step 4: Resolve (Work Done + Photo Proof)
  - Step 5: Verify (Citizen Approves or Reopens)
- **Section 4: Live Transparency & District Heatmap:**
  - Dynamic preview of real municipal metrics across city wards with recent verified resolutions carousel.
- **Section 5: Final Call to Action & Footer:**
  - Direct invitation for residents and city officials to experience transparent governance.

## 2. Authentication Page (`/login` & `/register`)
- Clean split layout:
  - Left panel: Editorial civic typography, quote from urban planners, high-resolution municipal infrastructure photograph.
  - Right panel: Tabbed login/register form with instant 1-click **"Demo Citizen"** and **"Demo Authority Supervisor"** buttons for frictionless evaluation.

## 3. Citizen Issue Reporting Wizard (`/report`)
- Fixed top progress stepper: Step 1 (Category) → Step 2 (Photo) → Step 3 (Location) → Step 4 (Description & AI) → Step 5 (Confirm).
- Mobile-first responsive card layout:
  - **Category Grid:** 6 curated tiles with custom SVG icons (Roads, Sanitation, Water, Lighting, Infrastructure, Traffic).
  - **Photo Dropzone:** Snappy drag-and-drop or device camera trigger with instant preview thumbnail.
  - **Interactive Location Picker:** Pinpoint location on mini-map with real-time reverse-geocoded street address, ward detection, and "Use My GPS" button.
  - **Description & AI Recommendation:** As user types, AI engine analyzes text and displays dynamic badge: *"AI Suggestion: Roads Dept • High Priority (Confidence 94%)"*.
  - **Review & Submit:** Card showing complete summary before generating ticket.

## 4. Citizen Dashboard (`/citizen/dashboard`)
- Welcome header with resident name and aggregate counter (Active, In-Progress, Resolved).
- Quick Action: Large primary card: "Report a New Defect".
- Filterable Submissions List / Grid:
  - Shows ticket reference (`#CF-8921`), category badge, thumbnail, location, current status chip, and SLA timer.
  - Click transitions to Issue Detail page.

## 5. Issue Detail & Verification View (`/citizen/reports/[id]`)
- **Breadcrumb Navigation:** Back to My Reports.
- **Header:** Ticket number, category, timestamp, urgency badge, current status banner.
- **Visual Evidence Module:** Original submission photo side-by-side with resolution proof photo (when resolved).
- **Interactive Chronological Timeline:**
  - Vertical stepper showing every status transition with exact timestamps, acting party, and notes.
- **Citizen Verification Action Box:**
  - When status is `RESOLVED`: Highlights prominent action box:
    - Button 1: `Confirm Resolution` (Marks `VERIFIED`, prompt for 5-star rating & comment).
    - Button 2: `Issue Persists (Reopen)` (Prompts for new comment and optional photo, moves to `REOPENED`).
  - When status is `VERIFIED`: Displays official digital seal of citizen verification.

## 6. Authority Operations Command Center (`/authority/dashboard`)
- **Operational Metrics Ribbon:**
  - Total Active Issues, Critical Triages, Field Crews Dispatched, Resolved (Past 7 Days), Verification Rate.
- **Filter & Search Toolbar:**
  - Search by keyword or ticket ID.
  - Category / Department multi-select dropdown.
  - Priority pills (Critical, High, Medium, Low).
  - Status tabs (All, Reported, In Review, Assigned, In Progress, Resolved).
  - View switcher: Split Map & List vs Full-width Data Table.
- **Interactive Operations Map:**
  - Pin markers color-coded by priority and department glyphs.
  - Clicking a pin opens a slide-over quick triage panel.
- **Issue Triage Drawer / Modal:**
  - Complete issue metadata, citizen description, full-size photos.
  - Department selector (Public Works, Sanitation, Water Board, Electrical, Parks).
  - Priority selector (Critical, High, Medium, Low).
  - Assignee selector (Specific crews, e.g., "Road Patching Unit #3").
  - Status transition controls with required resolution notes and resolution proof photo upload.

## 7. Operational Analytics (`/authority/analytics`)
- High-level charts and metrics:
  - Category distribution breakdown.
  - Average resolution time by department.
  - Ward-by-ward defect density bar graph.
  - Resolution verification fidelity (Citizen approval vs reopen percentage).
