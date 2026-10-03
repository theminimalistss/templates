# Verification

Version 0.2.0, checked 2026-10-03 in local Chrome using Playwright.

## Build and code

- TypeScript: `npm run typecheck` passed.
- Lint: `npm run lint` passed with no warnings.
- Production: `npm run build` passed (Vinext route classifier emits its informational “Unknown” classification notice).
- Deprecations: the TypeScript language service reports no `@deprecated` API usages in project source.
- Media audit: `npm run media:inspect` passed. No raw JPEGs or assets over 5 MiB.

## Layout

- Desktop 1440 × 1000 and mobile 390 × 844: visual review completed; no broken images, failed HTTP responses, browser runtime errors or horizontal overflow.
- Additional viewport widths: 320, 768 and 1024px checked for horizontal overflow.
- JavaScript disabled: server-rendered hero, estate introduction, gallery and cinematic break remain visible.
- Reduced motion: root motion class removed when the preference changes; no curtain, parallax, reveal transforms or gallery rotation.

## Hero and scroll

- Hero: title and supporting text keep their position while the cursor moves; the spatial photo and motes still respond.
- Mobile hero: portrait 768px AVIF selected at DPR2, preserving detail with about 94 KiB of transfer.
- Cinematic break: card opens to full-bleed, the line lights word by word, the film button arrives last and the section releases (desktop and mobile).

## Gallery and lightbox

- Estate filter returns three items, reset returns six, and a live mosaic swap replaces one tile and cleans up the outgoing layer.
- Lightbox next/previous and keyboard navigation cover all nine photos; Escape closes.
- Tile-to-lightbox morph on open and back into the tile on close; closing after navigating to an off-screen photo fades normally; no view-transition names left behind.
- No horizontal scroll-container overflow while stepping through all nine photos at 1440, 400 and 360px.

## Navigation

- Mobile menu opens full-screen at 0,0 and traps focus through the dialog primitive.
- Menu links land on their section with no jump back; focus moves to the section after the menu closes.
- Widening past 768px closes an open menu, and desktop links appear immediately after a resize.

## Inquiry and film

- Valid names, email and guest details produce a downloadable text brief; editing preserves entered email, guest count and story. No delivery is claimed.
- Mobile: bottom sheet with full-width actions; date and guests share a row.
- Mobile drag: a short pull springs back; a long pull from the handle or a quick flick from the form (scrolled to top) closes it.
- Film: local WebM reaches readyState 4, is muted, closes with Escape. No autoplay attribute under reduced motion.

This is functional and visual local verification, not a field Core Web Vitals claim. Measure real-user LCP/CLS/INP after a real production launch and connect genuine venue content and inquiry delivery first. Drag-to-close was exercised with simulated touch events; confirm it once on a physical iPhone, where Safari handles touch scrolling differently.
