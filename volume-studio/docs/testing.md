# Testing

```sh
npm run typecheck
npm run lint
npm run test
npm run test:watch
npm run test:coverage
npm run build
npx playwright install chromium
npm run test:e2e
npm run media:inspect
npm run version:check
```

Vitest + Testing Library cover repositories, filtering, media resolution, next-project wraparound, contact validation boundaries, adapter normalization/error propagation, hook state, images/links, mobile menu state, service expansion, process keyboard behavior, featured project controls and explicit audio opt-in. Motion tests cover image readiness and fallback, automatic timing, manual pause/resume, visibility suspension, reduced motion and distinct process diagrams. Coverage thresholds are 100% statements, branches, functions and lines for `src/services/`.

Playwright runs the production build through Vite preview on port 4174. It exercises all routes, direct-entry hydration, project filters/navigation, the mobile focus trap/Escape behavior, form validation/download, sound state, reduced motion, gallery controls, image loading and same-origin requests. Motion browser checks verify image-before-headline entrance, opposing depth, automatic transitions, pause/resume, scroll typography, the expanding film, process drawings and filter re-registration. Axe audits cover the homepage, work, contact and the open mobile dialog. A JavaScript-disabled check verifies prerendered content.

Responsive checks use 375, 430, 768, 1024, 1280, 1440 and 1920px. Viewport captures are written to ignored `test-results/`; curated previews live in `docs/previews/`.

These are Chromium checks on macOS. Safari, Firefox, real-device audio behavior and production field performance remain separate release checks; do not imply they were verified by Chromium automation. See `verification.md` for measured results.
