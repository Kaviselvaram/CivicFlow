# 15 — Asset Sourcing & Visual Media Registry

All photography and media assets used in CivicFlow are sourced from reputable open-license libraries (Unsplash, Wikimedia Commons) under permissive licenses allowing commercial and non-commercial public application use with attribution.

## Curated Photography & Media Registry

| Asset Name | Theme / Subject | Source | Direct Image URL | License | Application Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `hero-urban-city` | Aerial view of modern European city grid with clean streets & sunlight | Unsplash (Photo by Claudio Schwarz) | `https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=80` | Unsplash License (Free to use) | Landing Page Hero background & interactive city canvas |
| `hero-municipal-work` | Municipal crew in high-vis vests fixing road infrastructure | Unsplash (Photo by Ricardo Gomez Angel) | `https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=1200&q=80` | Unsplash License (Free to use) | Landing Page "How it works" stage 4 (Field Crew Resolve) |
| `pothole-severe-before`| Deep road pothole with broken asphalt and gravel | Unsplash (Photo by Matt Boitor) | `https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1001 Original defect evidence photo |
| `pothole-repaired-after`| Freshly rolled, smooth black asphalt patch on road | Unsplash (Photo by Patrick Hendry) | `https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1001 Resolution verification proof photo |
| `waste-overflow-before`| Overflowing waste bins with cardboard & litter on curb | Unsplash (Photo by Nick Fewings) | `https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1002 Original waste accumulation photo |
| `waste-cleaned-after` | Spotless clean urban sidewalk with modern waste receptacle | Unsplash (Photo by Pawel Czerwinski) | `https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1002 Resolution verification proof photo |
| `streetlight-broken` | Malfunctioning historical street lamp in urban neighborhood | Unsplash (Photo by Jack B) | `https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1003 Original streetlight outage photo |
| `streetlight-repaired`| Brightly illuminated modern LED street luminaire at dusk | Unsplash (Photo by Aleksandr Popov) | `https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1003 Resolution proof photo |
| `water-leak-before` | Water main leak bubbling onto asphalt road surface | Unsplash (Photo by Scott Rodgerson) | `https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1004 Water supply burst report photo |
| `water-leak-after` | Repaired pipeline valve box and dry, clean street drainage | Unsplash (Photo by Etienne Girardet) | `https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1004 Resolution proof photo |
| `park-bench-damaged` | Broken wooden slats on public park bench | Unsplash (Photo by Kostiantyn Li) | `https://images.unsplash.com/photo-1588718889399-f2735738096f?auto=format&fit=crop&w=1000&q=80` | Unsplash License (Free to use) | Demo Issue #CF-1005 Public infrastructure report photo |
| `auth-civic-architecture`| Warm limestone municipal hall with sunbeam and archways | Unsplash (Photo by Ilia Bronskiy) | `https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80` | Unsplash License (Free to use) | Login and Registration page backdrop |

## Video & Atmospheric Media Usage
- Subtle HTML5 looping video ambient background (with low opacity and reduced-motion fallback):
  - Urban street movement with pedestrians and light traffic, establishing civic life.
  - Video poster fallback directly provided to prevent layout shift or heavy mobile bandwidth consumption.

## Image Processing & Optimization Strategy
- Next.js Image component optimization with responsive `sizes` attribute.
- Modern WebP / AVIF format delivery with crisp aspect ratios.
- Fallback local SVG placeholders for offline or network-constrained testing environments.
