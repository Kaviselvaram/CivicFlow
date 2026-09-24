# 17 — Performance Optimization Strategy

## 1. Performance Targets
- **Largest Contentful Paint (LCP):** < 1.8 seconds on 4G mobile.
- **First Input Delay (FID) / Interaction to Next Paint (INP):** < 100 milliseconds.
- **Cumulative Layout Shift (CLS):** < 0.05.
- **Total JavaScript Bundle Size:** < 180 kB (compressed).

## 2. Asset & Image Optimization
- All photographic evidence and hero images utilize Next.js `<Image />` optimization with automatic WebP conversion, explicit `width`/`height` attributes, and responsive `sizes` definitions.
- Non-critical visual assets (such as ambient map textures and background illustrations) are lazy-loaded with placeholder blur-ups.
- Camera and file uploads are processed on the client side with canvas downsampling before network transmission, capping preview payloads to < 800 kB.

## 3. Font Loading Strategy
- Use `next/font/google` for `Fraunces` and `Plus Jakarta Sans` with `display: swap` and zero external render-blocking network requests.
- Subset fonts to Latin-ext to minimize WOFF2 payload to < 28 kB.

## 4. Database & Query Performance
- Prisma indexes placed on critical query paths:
  - `Issue(status, createdAt)`
  - `Issue(category, priority)`
  - `Issue(reporterId)`
  - `Issue(departmentId)`
  - `StatusHistory(issueId, createdAt)`
- Pagination with default limit of 25 records on authority triage lists with cursor/offset navigation to ensure instantaneous table rendering.
