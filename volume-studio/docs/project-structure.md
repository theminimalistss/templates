# Project structure

```text
.agent/                concise AI handoff and decision record
docs/                  architecture, credits, verification and previews
public/fonts/          self-hosted variable fonts and OFL notices
public/media/          optimized AVIF/WebP, MP4/WebM, MP3
scripts/               media pipeline, SSR rendering and release helpers
src/config/            public studio settings/navigation
src/constants/         contact types and initial values
src/repositories/      local content and replaceable adapters
src/services/          pure domain logic
src/hooks/             React-facing content, state and browser effects
src/ui/components/     reusable image, link, metadata and project primitives
src/ui/layouts/        header, footer and document layout
src/ui/sections/       composed homepage/secondary-page sections
src/ui/pages/          route views
src/ui/styles/         responsive design/motion system
src/router/            lazy route definitions
src/tests/             Vitest and Testing Library tests
tests/                 Playwright browser tests
```

Generated, ignored outputs: `dist/`, `.cache/`, `coverage/`, `test-results/`, `playwright-report/`. Required production assets and media metadata are committed. No files from the sibling Maison Vielle application are needed at runtime or build time.
