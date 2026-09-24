# 08 — Animation System & Motion Choreography

## 1. Core Motion Philosophy: "Every Animation Must Have a Reason to Exist"
Animation in CivicFlow is an instrument of **clarity, spatial orientation, and civic reassurance**—never a gratuitous showcase of decorative noise.

### Guiding Principles:
1. **Direct Cause & Effect:** Visual changes occur directly as feedback to user actions (clicking a marker centers the triage preview; submitting a report smoothly transitions into a verifiable ticket).
2. **Speed & Snappiness:** Interactive micro-transitions must finish within **150ms to 240ms** so the interface feels lightning-fast and responsive.
3. **Editorial Rhythm:** Narrative reveals on the landing page use gentle staggering (40-60ms offset) with ease-out cubic beziers (`cubic-bezier(0.16, 1, 0.3, 1)`).
4. **Accessible Fallback:** When `prefers-reduced-motion` is active, all structural transitions collapse to instantaneous state changes or subtle opacity fades (`0.1s ease`).

## 2. Motion Hierarchy & Implementations

### Level 1 — Essential (Universal UI Feedback)
- **Buttons & Chips:** Subtle scale on tap (`transform: scale(0.98)`), background tint transition (`150ms ease`).
- **Form Focus:** Smooth border contrast shift and subtle glow ring expansion (`200ms ease-out`).
- **Modal & Drawer:** Enter with `translate-y: 12px` to `0px` and opacity from `0` to `1` (`220ms cubic-bezier(0.16, 1, 0.3, 1)`).
- **Toast Notifications:** Slide in from top-right corner with auto-dismiss progress bar.

### Level 2 — Signature (Civic Storytelling & Spatial Depth)
- **Hero Stagger Sequence:** Headline serif letters glide upward through an overflow mask, followed by the pill action buttons and live telemetry counter.
- **Interactive Map Pins:** Gentle pulse ring on unresolved critical incidents; smooth spring scale on marker hover and selection.
- **Resolution Timeline Path:** Connecting lines between timeline nodes draw forward as an issue progresses from `REPORTED` through `VERIFIED`.
- **Before/After Split Slider:** Smooth interactive divider revealing the raw defect image vs the completed field resolution photo.

### Level 3 — Experimental / Spatial
- **Interactive Civic Map Visualization:** Canvas/SVG coordinate network with live glowing telemetry nodes indicating real-time municipal response crews in motion across city districts.

## 3. Standard Easing Tokens
- `--ease-out-civic`: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy entry, natural deceleration)
- `--ease-in-out-civic`: `cubic-bezier(0.65, 0, 0.35, 1)` (smooth coordinate panning)
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (tactile toggle buttons & badges)
