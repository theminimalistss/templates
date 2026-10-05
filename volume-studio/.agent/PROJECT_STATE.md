# Project state

- Version: **0.3.0**
- Status: Complete and verified local implementation. Build/lint/types pass; 44 unit/component tests pass; 51 of 52 browser checks pass (the `/services` expertise-text hover check fails and predates 0.3.0, see `.agent/TODO.md`); core service coverage is 100%. Lighthouse: mobile 97/100/100/100, desktop 100/100/100/100. See `docs/verification.md`.
- Latest verification: 2026-10-05, 0.3.0 header entrance: build/lint/types, 44 unit/component tests, 51 of 52 browser tests and fresh Lighthouse audits. Desktop (1440px) and mobile (390px) entrance frames visually reviewed.
- Header entrance (0.3.0): during the hero intro the header shares its camera. Its items converge on the main image's vanishing point from in front of the viewer, and the receding imagery passes across the header band. Coupled purely in CSS through `:root:has(.hero[data-hero-phase])` in `src/ui/styles/motion.css`.
- Motion update: staggered image-first entrance, stronger damped opposing hero depth, automatic masked project transitions with pause/resume, scroll typography/image/film storytelling, and meaningful Shape/Realize illustrations. Reduced motion and native scrolling remain supported.
- Active route: `/` (homepage). All requested route patterns are implemented.
- Previous verification: 2026-10-05, committed implementation `5003201` rebuilt successfully; full 42-test browser suite passed together. Development preview restarted at `http://127.0.0.1:5174/`.
- Complete: original responsive design; four case studies; project filters; studio/services; three journal entries; native motion and reduced-motion alternatives; menu focus trap; optional sound; optimized local images/video/fonts; contact validation/download; SSR prerender; SEO/404; tests/docs.
- Intentionally unconfigured: live email/API delivery, real studio social accounts, production domain and deployment. Contact prepares a truthful local download.
- Known limits: stock media illustrates multiple real locations; projects/areas/locations are fictional. Chromium verified; other engines/physical devices have not been tested. Reserved `.example` domain and email must be replaced before real launch.
- Next recommended task: configure real business content and domain; implement a server contact provider if requested; then publish and run production-device audits.
