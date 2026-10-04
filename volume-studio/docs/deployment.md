# Deployment

```sh
npm ci
VITE_SITE_URL=https://your-real-domain.com npm run build
npm run preview
```

Publish the contents of `dist/` to any static host. It contains route-specific rendered HTML, `.html` aliases, `404.html`, static media, robots and sitemap. Set long-lived immutable caching for fingerprinted `/assets/` files, normal versioned caching for `/media/`, and short cache lifetimes for HTML.

A generic nginx route rule is:

```nginx
location / { try_files $uri $uri.html $uri/index.html =404; }
error_page 404 /404.html;
```

Equivalent clean-URL/static-file rules work on other hosts. Avoid rewriting every request to the homepage when the host can serve prerendered route files. The client can recover from an SPA fallback, but search crawlers and JavaScript-disabled visitors need the correct route HTML. Unknown paths should return the custom page with **HTTP 404**, not 200.

`VITE_SITE_URL` is the only public build variable. It sets canonical, social and structured-data URLs; the build generates the sitemap from the same origin. `.env.example` uses a reserved `.example` domain. No secrets belong in Vite client variables.

Before a real business launch, configure a real domain/email/social profiles (the template currently links to platform homepages) in `src/config/site.ts`, replace fictional project claims and illustrative stock images, and connect a server-side contact provider if delivery is wanted. The current contact action intentionally prepares a download only. No deployment, domain purchase, remote release or external publishing is performed by the build.

For a release: run all verification scripts, update the package version, lockfile, `CHANGELOG.md` and `.agent/PROJECT_STATE.md`, then commit. `npm run release:tag` previews the local tag action; `npm run release:tag -- --apply` creates it only from a clean Git state. It never pushes tags or creates a remote release.
