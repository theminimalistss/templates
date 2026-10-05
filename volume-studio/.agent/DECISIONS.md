# Decisions

2026-10-04 — Use standalone React/Vite, not Maison Vielle's Vinext/Sites runtime. Reason: the brief explicitly requests Vite and a layered domain architecture. Impact: no hosting/database dependency.

2026-10-04 — Pin TypeScript to the supported 6.0 line and ESLint to 9. Reason: current typescript-eslint requires TypeScript <6.1, and jsx-a11y supports ESLint through 9. Impact: clean dependency resolution while runtime libraries use current stable releases.

2026-10-04 — Use native motion. Reason: bounded depth, masks, a pinned gallery and reveals do not justify heavy libraries/WebGL. Impact: small runtime and straightforward reduced-motion behavior.

2026-10-04 — Contact produces a local brief. Reason: no real studio or delivery credentials exist. Impact: no personal data leaves the browser; provider adapter remains replaceable.

2026-10-04 — Prerender every known route and emit both HTML aliases and directory indexes. Reason: static hosts differ in clean-URL resolution. Impact: direct-entry SEO and hydration work without an application server.

2026-10-04 — Reserve `.example` domain/email and use social platform homepages until verified profile URLs are supplied. Reason: the business is fictional. Impact: configure verified destinations before publishing; no nonexistent account is claimed.

2026-10-05 — Expand native motion through layered depth, cinematic masks and scroll storytelling. Reason: the user wants pronounced, coherent motion without changing the architectural identity. Impact: separate transform layers avoid conflicts; automatic hero rotation waits for its entrance, supports pause/resume and suspends for visibility, keyboard focus, manual selection and reduced motion. Shape assembles planes; Realize shows a furnished interior.
