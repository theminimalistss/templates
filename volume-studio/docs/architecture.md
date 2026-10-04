# Architecture

VOLUME uses React 19, TypeScript and Vite. The project follows **repository → service → hooks → UI**. Maison Vielle informed the same-origin media pipeline, native scroll motion and honest downloadable inquiry pattern. No Maison Vielle business data, framework adapters or hosting integration was copied.

| Layer | Responsibility | Entry points |
| --- | --- | --- |
| Repository | Typed local content, image dimensions, replaceable contact adapter | `src/repositories/` |
| Service | Resolve media, filter projects, next-project ordering, validate/normalize inquiries | `src/services/` |
| Hooks | React-facing domain access, form state, browser motion/audio lifecycle | `src/hooks/` |
| UI | Semantic layouts, responsive compositions and controls | `src/ui/` |

UI imports domain hooks, types and public configuration. It never imports repositories or services. Browser effects belong to hooks; their observers, listeners, frames and audio are cleaned up. Pure presentation text remains with its section.

The contact repository implements `ContactRepository.prepare`. The default returns a text artifact without network delivery or storage. A future provider must implement a server endpoint; keep secrets on the server, validate again, rate-limit requests and return honest success/error states. Do not rename the current action “Send” until delivery exists.

## Routing and rendering

React Router exposes all eight requested route patterns, four project slugs, three journal slugs and a custom 404. Page modules are lazy-loaded. `scripts/prerender.mjs` uses Vite's SSR module loader and React's awaited server stream to emit fully rendered HTML, metadata, sitemap and robots files at build time. It writes both `route.html` and `route/index.html` for static hosts with different clean-URL behavior.

The browser hydrates only when the server's `data-rendered-path` matches the current route and there is no query string. SPA fallbacks and filtered queries mount cleanly, removing stale route metadata first. Configure real hosting to return `404.html` with status 404 for unknown paths. The Vite preview fallback alone cannot provide that HTTP status.

No server, database, authentication, tracking, CMS, heavy animation library or WebGL runtime is required. Stock photographs illustrate fictional projects and are not evidence of a real studio portfolio.
