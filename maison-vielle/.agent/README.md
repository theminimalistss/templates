# Maison Vielle AI Working Notes

This folder is for AI-assisted change tracking and handoff notes. ChatGPT, Claude, or another coding assistant can add Markdown files here when a change needs context beyond a commit message.

## Versioning

The version lives in the project-level `VERSION` file and is mirrored in `package.json` and `package-lock.json`. Bump all three together, for example with `npm version <x.y.z> --no-git-tag-version` followed by updating `VERSION`, and add a dated note here.

## Project flow

Keep changes moving through these layers:

1. `content/` — typed media records, gallery pool and provenance (`media.ts`, `media-manifest.json`).
2. `app/page.tsx` — server-rendered sections and copy. Marks elements for motion with `data-reveal`, `data-parallax`, `data-rule` and `data-scrub`.
3. `components/maison/` — client behaviour: `motion.tsx` (one scroll loop for reveals, parallax and scrub progress), `hero-effects.tsx` and `hero-depth.ts` (spatial hero), `petals.tsx`, and `interactions.tsx` (navigation, gallery, lightbox, film, inquiry).
4. `app/globals.css` — tokens, layout and every animation. Scroll-linked effects read CSS custom properties written by Motion; React never re-renders on scroll.

Rules worth keeping:

- Content must stay visible without JavaScript. Scope reveal styles to `.motion-ready`.
- Honour `prefers-reduced-motion` in both CSS and any requestAnimationFrame loop.
- Keep `components/ui/` as vendored shadcn source; style it from `globals.css` instead of editing it.
- Regenerate hero depth maps with `npm run media:depth` whenever the hero photograph changes.

## Suggested note format

Create one Markdown file per meaningful change, named `YYYY-MM-DD-short-title.md`:

```md
# YYYY-MM-DD — Short change title

## Summary

What changed and why.

## Files touched

- `app/...`

## Validation

- `npm run typecheck`

## Follow-ups

- Anything the next assistant or developer should know.
```
