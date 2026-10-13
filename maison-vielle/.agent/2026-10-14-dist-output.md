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

Everything Next.js generates lives in `dist`; there is no `.next` folder. `npm run build` writes the static site to the root of `dist`, and `npm run dev` keeps its own isolated build in `dist/dev`, so the two never overwrite each other. `dist/dev` is local-only: the export verifier skips it, and `npm run package:hostinger` leaves it out of the ZIP. If you upload `dist` by hand instead of the ZIP, leave out the `dev` folder. The verifier still rejects server or cache files at the root of `dist`.
