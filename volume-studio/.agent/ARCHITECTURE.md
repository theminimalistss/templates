# Architecture map

- Domain: repositories → services → `hooks/useContent.ts` → UI. Contact follows the same flow through `useContact`.
- Routes: `src/router/routes.tsx`; page-level lazy imports.
- HTML: Vite build + `scripts/prerender.mjs`; React server stream, path-aware hydration in `main.tsx`.
- Design: `src/ui/styles/index.css`; layouts, sections and route pages are separate.
- Motion: `useMotion`, `usePointerDepth`, `useRouteMotion`, `useReducedMotion`; native APIs with cleanup.
- Media: `scripts/media-manifest.json` → optimization → `public/media/` + `media-metadata.json` → repository/service → `ResponsiveImage`.
- Checks: Vitest/RTL in `src/tests/`; Playwright/axe in `tests/`; scripts audit media and version consistency.
