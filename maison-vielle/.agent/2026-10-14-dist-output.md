# 2026-10-14 — Use dist for Hostinger output (0.2.2)

## Summary

Changed the static export directory from Next.js's default `out` to the requested `dist`. This completes the Hostinger migration recorded in the preceding 0.2.1 note; that note describes the earlier intermediate folder name.

## Files touched

- `next.config.ts`: `output: 'export'` with `distDir: 'dist'`.
- `package.json`: start/preview serve `dist`.
- `scripts/verify-export.mjs`: verifies `dist`; the packaging script consumes the same exported directory.
- `README.md`, `docs/hostinger.md`, `docs/architecture.md`: current deployment instructions use `dist`.
- `VERSION`, `package.json`, `package-lock.json`: synchronized to 0.2.2.

## Validation

- Typecheck and `npm run package:hostinger` passed.
- Export: 108 files, 11.28 MiB, with index.html, 404, media, fonts and framework assets.
- Rebuilt ZIP: 10.35 MiB, index.html and .htaccess at archive root; no enclosing dist/out directory or Worker server files.
- Native export replaced the old ignored dist/server Worker output. Removed the previous ignored out directory.
- Local development and static preview routes checked after the folder change.

The previously completed desktop/mobile interaction checks remain applicable; this change only affects export, preview and packaging paths. Generated dist/release files remain ignored by Git and can be regenerated with the documented commands.

Development uses `.next` for its cache and generated types, while production exports to `dist`. The export verifier rejects development caches and Worker/server files in `dist`, so the upload ZIP cannot accidentally include them. The development server was checked after the production build to confirm it leaves `dist` unchanged.
