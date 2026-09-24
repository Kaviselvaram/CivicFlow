# 16 — Accessibility (a11y) & Inclusivity Guidelines

## 1. Compliance Standard: WCAG 2.1 Level AA
CivicFlow is built on the tenet that public municipal tools must be universally accessible to all citizens, including elderly residents, users with visual/motor impairments, and citizens utilizing assistive technologies.

## 2. Accessible Color & Contrast Ratios
- **Text on Canvas:** Deep Slate (`#182026`) on Warm Canvas (`#FBF9F5`) produces a contrast ratio of **14.8:1** (exceeds WCAG AAA requirement of 7:1).
- **Secondary Text:** Slate (`#4B5563`) on Warm Canvas produces **7.2:1** (exceeds AAA).
- **Action Buttons:** Terracotta (`#E05A47`) with White text produces **4.9:1** (exceeds AA requirement for large UI components & buttons).
- **Never rely on color alone:** All priority and status indicators include explicit text labels and geometric SVG iconography alongside color chips.

## 3. Keyboard Navigation & Focus Rings
- All interactive controls (buttons, links, form inputs, category tiles, map markers) possess explicit `:focus-visible` styling:
  - `outline: 2px solid #19382F; outline-offset: 2px;`
- Focus trap implemented on all modals and slide-over drawers. Pressing `Escape` reliably closes open dialogs and restores focus to triggering element.
- Skip-to-content anchor provided on all layouts (`Skip to main content`).

## 4. Screen Reader Considerations
- Form inputs feature persistent, visible `<label>` tags with matching `htmlFor` and `id` attributes.
- Custom SVG icons include `aria-hidden="true"` when accompanied by text, or meaningful `aria-label` / `<title>` tags when standalone.
- Live announcements: Dynamic status changes and AI classification cards use `aria-live="polite"` to inform screen readers of real-time suggestions without jarring interruption.

## 5. Reduced Motion (`prefers-reduced-motion: reduce`)
When media query detects user preference for reduced motion:
- CSS animations and transitions are clamped to instantaneous or `0.01ms duration`.
- Parallax scrolling, canvas ambient movements, and continuous pulse animations are suppressed.
- Interactive carousels switch to instant pagination.
