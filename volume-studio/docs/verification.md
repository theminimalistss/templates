# Verification — 0.1.0

Performed locally on **2026-10-04**, macOS arm64, Node 26.5.1. Production browser checks use Chromium 153 through Playwright 1.63 and the built static site on `127.0.0.1:4174`.

| Check | Result |
| --- | --- |
| TypeScript | Pass, no errors |
| ESLint / layer boundaries | Pass |
| Vitest / Testing Library | 36 tests pass |
| Core service coverage | 100% statements, branches, functions and lines |
| Production build | Pass; 14 prerendered routes including 404 |
| Playwright | 42 checks pass: 41-test regression suite plus focused video lifecycle test |
| Responsive widths | 375, 430, 768, 1024, 1280, 1440, 1920px; homepage and every inner route |
| Axe | Homepage, work, contact and open mobile dialog pass WCAG 2 A/AA + 2.1 AA rules |
| Media | 90 correctly dimensioned AVIF/WebP files; local audio/video/fonts verified |
| Network | No remote production media/font requests during image-loading flow |
| Browser errors | No page errors across every route, unknown route and bookmarked filter |
| Version | Package, lockfile, VERSION, changelog and handoff state agree at 0.1.0 |

## Lighthouse

Latest measured homepage runs, mobile simulated throttling and desktop profile against local production preview:

| Profile | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Mobile | 97 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

Mobile: FCP 1.5s, LCP 2.6s, CLS 0, TBT 0ms. Desktop: FCP 0.4s, LCP 0.5s, CLS 0, TBT 0ms. Runs vary; an earlier mobile run scored 99. Machine-readable local reports are generated under ignored `.cache/lighthouse/` by `npm run audit:performance` while port 4174 is running. These are lab measurements, not production field metrics.

## Manual visual review

Reviewed the desktop and mobile hero, the fully loaded homepage sequence, project case-study layout and contact form. Adjusted bone-surface contrast, the mobile article title, control target sizes and accessible link names after audits. Committed viewport previews live in `docs/previews/`.

## Scope limits

No deployment or live email/API delivery is configured. Reserved `.example` addresses, social platform homepages and fictional project content require replacement for a real business. Safari, Firefox, physical devices, screen-reader testing and production HTTP/cache behavior were not verified. Static hosting must serve the real `404.html` with an HTTP 404 status; Vite preview uses an SPA fallback for unknown paths.
