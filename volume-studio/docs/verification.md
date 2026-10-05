# Verification — 0.2.0

Verified locally on **2026-10-05**, macOS arm64, Node 26.5.1. Production checks use Chromium 153 / Playwright 1.63 against the built static site at `127.0.0.1:4174`. Development preview remains available at `127.0.0.1:5174`.

| Check | Result |
| --- | --- |
| TypeScript / ESLint / layer boundaries | Pass |
| Vitest / Testing Library | 44 tests pass |
| Core service coverage | 100% statements, branches, functions and lines |
| Production build | Pass; 14 prerendered routes including 404 |
| Playwright | All 47 tests pass together in 16.0 seconds |
| Hero entrance | Both media settle before headline reveal; stronger opposing pointer depth verified |
| Hero slideshow | Automatic transitions, retained outgoing media, manual pause, explicit resume, keyboard pause and reduced-motion alternative verified |
| Scroll storytelling | Masked heading reveal, kinetic typography, expanding philosophy frame, process drawings and newly mounted filtered images verified |
| Responsive widths | 375, 430, 768, 1024, 1280, 1440, 1920px; homepage and all inner routes |
| Axe | Homepage, work, contact and open mobile dialog pass WCAG 2 A/AA + 2.1 AA rules |
| Network / runtime | Loaded images work; production media stays same-origin; all routes, 404 and bookmarked filter have no page errors |
| Version | Package, lockfile, VERSION, changelog, configuration and handoff updated to 0.2.0 |

## Lighthouse

| Profile | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile | 97 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Fresh production audits after the motion changes: mobile FCP 1.5s, LCP 2.6s, CLS 0, TBT 0ms; desktop FCP 0.4s, LCP 0.5s, CLS 0, TBT 0ms. These are local lab results, not deployed field measurements. Summaries are in `lighthouse-summary.json`; full generated reports remain under ignored `.cache/lighthouse/`.

## Visual review

Reviewed the initial media-only frame, settled desktop and mobile hero, pointer depth, automatic slide change, and both revised process diagrams. Confirmed no headline slivers during the first entrance frame, corrected construction guides to stay inside their drawing, and checked the 390px mobile composition for overflow. Updated `docs/previews/home-desktop.webp`, `home-mobile.webp`, `process-shape.webp` and `process-realize.webp`.

Known environment limits and historical baseline checks follow below. No deployment or contact delivery was added by this motion update.

---

## Previous verification — 0.1.0

Performed locally on **2026-10-04**, macOS arm64, Node 26.5.1. Production browser checks use Chromium 153 through Playwright 1.63 and the built static site on `127.0.0.1:4174`.

Final verification on **2026-10-05**: rebuilt committed implementation `5003201`; all 42 browser tests passed together in 10.5 seconds. Restarted the development preview on `127.0.0.1:5174` and confirmed HTTP 200. Lighthouse and unit/coverage results below are from the original 2026-10-04 audit.

| Check | Result |
| --- | --- |
| TypeScript | Pass, no errors |
| ESLint / layer boundaries | Pass |
| Vitest / Testing Library | 36 tests pass |
| Core service coverage | 100% statements, branches, functions and lines |
| Production build | Pass; 14 prerendered routes including 404 |
| Playwright | Full 42-test suite passes together, including video lifecycle |
| Responsive widths | 375, 430, 768, 1024, 1280, 1440, 1920px; homepage and every inner route |
| Axe | Homepage, work, contact and open mobile dialog pass WCAG 2 A/AA + 2.1 AA rules |
| Media | 90 correctly dimensioned AVIF/WebP files; local audio/video/fonts verified |
| Network | No remote production media/font requests during image-loading flow |
| Browser errors | No page errors across every route, unknown route and bookmarked filter |
| Version | Package, lockfile, VERSION, changelog and handoff state agree at 0.1.0 |

### Lighthouse

Latest measured homepage runs, mobile simulated throttling and desktop profile against local production preview:

| Profile | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile | 97 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile: FCP 1.5s, LCP 2.6s, CLS 0, TBT 0ms. Desktop: FCP 0.4s, LCP 0.5s, CLS 0, TBT 0ms. Runs vary; an earlier mobile run scored 99. Machine-readable local reports are generated under ignored `.cache/lighthouse/` by `npm run audit:performance` while port 4174 is running. These are lab measurements, not production field metrics.

### Manual visual review

Reviewed the desktop and mobile hero, the fully loaded homepage sequence, project case-study layout and contact form. Adjusted bone-surface contrast, the mobile article title, control target sizes and accessible link names after audits. Committed viewport previews live in `docs/previews/`.

### Scope limits

No deployment or live email/API delivery is configured. Reserved `.example` addresses, social platform homepages and fictional project content require replacement for a real business. Safari, Firefox, physical devices, screen-reader testing and production HTTP/cache behavior were not verified. Static hosting must serve the real `404.html` with an HTTP 404 status; Vite preview uses an SPA fallback for unknown paths.
