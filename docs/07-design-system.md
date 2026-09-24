# 07 — Design System & Style Tokens

## 1. Color System (Light Foundation)

### Base & Surfaces
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--surface-canvas` | `#FBF9F5` | Primary background canvas (warm paper / limestone) |
| `--surface-card` | `#FFFFFF` | Elevated cards, forms, modals |
| `--surface-subtle` | `#F4EFEA` | Secondary container, table headers, neutral badges |
| `--surface-muted` | `#EBE4DC` | Hover states, active tabs, inset wells |
| `--border-subtle` | `#E8E2D8` | Structural hairline dividers, panel frames |
| `--border-strong` | `#D5CCC0` | Form field borders, active card borders |

### Typography & Content
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--text-primary` | `#182026` | Deep slate ink for primary headings, body, metrics |
| `--text-secondary`| `#4B5563` | Subtitles, supporting copy, metadata labels |
| `--text-muted` | `#788290` | Placeholders, timestamps, disabled indicators |
| `--text-inverse` | `#FFFFFF` | Text on dark buttons, active badges, dark fills |

### Civic Accent Palette
| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| `--civic-terracotta`| `#E05A47` | Primary action CTA, critical alerts, urgent markers |
| `--civic-pine` | `#19382F` | Authority command brand, solid foundations, verified stamp |
| `--civic-cobalt` | `#244B5C` | Information, road department, public transit links |
| `--civic-ochre` | `#D97706` | Warning, in-progress state, electrical hazards |
| `--civic-moss` | `#15803D` | Success, verified status, active resolution progress |

### Status Tokens
| Status | Background | Text | Border | Meaning |
| :--- | :--- | :--- | :--- | :--- |
| `REPORTED` | `#FEF3C7` (Amber-50) | `#92400E` | `#FCD34D` | Intake received, pending supervisor review |
| `IN_REVIEW` | `#EFF6FF` (Blue-50) | `#1E40AF` | `#BFDBFE` | Triaged by department supervisor |
| `ASSIGNED` | `#F3E8FF` (Purple-50)| `#6B21A8` | `#E9D5FF` | Field crew/contractor dispatched |
| `IN_PROGRESS`| `#FFF7ED` (Orange-50)| `#9A3412` | `#FED7AA` | Work crew on-site physically repairing |
| `RESOLVED` | `#ECFDF5` (Green-50) | `#065F46` | `#A7F3D0` | Repair complete, pending citizen verification |
| `VERIFIED` | `#19382F` (Deep Pine) | `#FBF9F5` | `#19382F` | Citizen approved, closed with verification seal |
| `REOPENED` | `#FEF2F2` (Red-50) | `#991B1B` | `#FECACA` | Citizen flagged repair as incomplete |

## 2. Typography Pairing
- **Display & Editorial Headlines:** `Fraunces` (Google Font, optical size 9-144, weights 400, 600, 700). Evokes civic permanence, architectural dignity, and editorial warmth.
- **UI, Navigation & Body:** `Plus Jakarta Sans` or `Outfit` (Google Font, weights 400, 500, 600, 700). High x-height, open apertures, crystal clear legibility on mobile viewports.
- **Monospace & Codes:** `JetBrains Mono` for ticket numbers (`#CF-8921`), GPS coordinates (`40.7128° N, 74.0060° W`), and timestamps.

### Typographic Scale
- `display-2xl`: 56px / 1.1 / Fraunces Semibold
- `display-xl`: 42px / 1.15 / Fraunces Semibold
- `heading-lg`: 32px / 1.25 / Fraunces Medium
- `heading-md`: 24px / 1.3 / Plus Jakarta Sans Bold
- `heading-sm`: 18px / 1.4 / Plus Jakarta Sans SemiBold
- `body-base`: 15px / 1.6 / Plus Jakarta Sans Regular
- `body-sm`: 13px / 1.5 / Plus Jakarta Sans Medium
- `caption`: 11px / 1.4 / Plus Jakarta Sans SemiBold (Uppercase tracking +0.05em)
- `code-badge`: 12px / 1.3 / JetBrains Mono Medium

## 3. Spacing, Radius & Shadows
- **Base Grid:** 4px unit (4, 8, 12, 16, 24, 32, 48, 64, 96, 128px)
- **Border Radius:**
  - Badges & Pills: `9999px`
  - Inputs & Small Buttons: `8px`
  - Cards & Modules: `14px`
  - Large Drawers & Modals: `20px`
- **Shadows (Restrained & Layered):**
  - `shadow-subtle`: `0 1px 3px rgba(24, 32, 38, 0.05), 0 1px 2px rgba(24, 32, 38, 0.03)`
  - `shadow-card`: `0 4px 12px -2px rgba(24, 32, 38, 0.06), 0 2px 6px -1px rgba(24, 32, 38, 0.04)`
  - `shadow-elevated`: `0 16px 32px -4px rgba(24, 32, 38, 0.08), 0 6px 12px -2px rgba(24, 32, 38, 0.04)`
