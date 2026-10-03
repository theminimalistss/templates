# Architecture

Maison Vielle is a fictional luxury wedding estate template built with React 19, TypeScript and Vinext/Vite. Source lives in this project directory. It can run locally or as a Cloudflare Worker through Sites. The current version is in `VERSION`, mirrored in `package.json` and `package-lock.json`.

## Structure

- `app/page.tsx`: server-rendered editorial homepage and section content.
- `app/globals.css`: ivory/olive design tokens, responsive composition, typography and motion. Local Cormorant Garamond and Manrope fonts.
- `components/maison/responsive-image.tsx`: AVIF/WebP sources, responsive sizes, intrinsic dimensions, positioning, fit, decoding and priority.
- `components/maison/motion.tsx`: scroll reveals (`data-reveal="fade-up|rise|fade|image|lines|gallery"`, `data-rule`), `data-parallax="pixels"` effects, the hero's scroll progress (`--hero-progress`), pinned-section progress (`data-scrub` → `--scrub`) and the end-of-intro flag (`html.intro-done`).
- `components/maison/hero-effects.tsx` and `hero-depth.ts`: the hero's spatial photograph, light, motes and magnetic scroll badge.
- `components/maison/petals.tsx`: falling petals over the cinematic break.
- `components/maison/interactions.tsx`: navigation, living-mosaic gallery with filters and lightbox, on-demand film, and the enquiry brief with its mobile drag-to-close sheet.
- `components/ui/dialog.tsx`: existing Radix/shadcn dialog primitive; manages focus trap, Escape, focus restoration and accessible names. Composed and styled without changing vendored source.
- `content/media.ts`: typed display configuration and gallery content.
- `content/media-manifest.json`: verified media provenance and processing settings.
- `public/media`: production assets only; raw sources live in ignored `.cache/media` or an external directory.
- `scripts/generate-depth.mjs`: offline Depth Anything V2 depth maps for the hero (`npm run media:depth`).
- `.agent/`: dated change notes for AI-assisted work, one per version.

## Motion

Native IntersectionObserver reveals selected headings and images once. One visibility observer tracks parallax frames, and one passive scroll listener schedules a single requestAnimationFrame. That frame writes CSS custom properties directly (`--parallax-y`, `--hero-progress`, `--scrub`); scrolling never renders React components. Image overscan is 40px per edge, and translations stay inside that budget. Effects use opacity, transforms, clip-path and short blur filters; nothing animates layout. The sticky desktop header uses a compact ivory surface after scrolling.

The header and hero intro are timed in CSS from page load. About 3.4s in, Motion adds `html.intro-done`, which removes those intro animations. Elements that only become visible later, such as the desktop links after a resize from mobile, then appear immediately instead of replaying the delayed intro.

`prefers-reduced-motion` disables reveals/parallax and film autoplay, including changes made while the page is open. Mobile parallax is zero. Native anchor scrolling is retained. No animation library or scroll hijacking is used. Content is visible by default when JavaScript fails.

## Hero

The page opens with a loading curtain. The MV monogram waits on a filling line, then an ivory panel lifts with a curved trailing edge and an olive panel follows just behind. As the panels clear, the title rises letter by letter and the supporting lines follow. The intro is pure CSS and ends in its resting state, so it also works without JavaScript.

The photograph is a spatial scene. An offline depth map (`npm run media:depth`, Depth Anything V2) drives a WebGL parallax-occlusion shader. It pivots on the house, so the lawn and sky separate as the virtual camera moves. The camera follows the cursor, device tilt where the browser allows it without a permission prompt, and scroll. It opens with a sweep and otherwise drifts in a slow orbit. The canvas mirrors the `<picture>` geometry and fades in over it once ready. The `<picture>` stays the LCP element and the fallback when WebGL or JavaScript is unavailable.

Ambient layers are a warm grade, soft rays, a cursor-following glow, canvas motes and film grain. They use blend modes and transforms only. One requestAnimationFrame loop drives the camera, motes, glow and the magnetic badge. The hero text deliberately does not follow the cursor; it only moves in the intro and on scroll. It stops while the hero is off screen. Reduced motion removes the curtain, motes and spatial canvas and resets all delays.

## Scroll reveals

Motion adds `.is-visible` once an element is about 6% inside the viewport. Headings use masked lines (`.reveal-line`) that slide up one after another. `fade-up` containers bring their children in sequence with a short rise and blur-to-sharp. `rise` does the same for a single element. Photos unveil upward while zooming out. `data-rule` draws a section's top rule across. All reveal styles are scoped to `.motion-ready`, so content is fully visible without JavaScript or under reduced motion.

## Cinematic break

The section pins for about 2.3 viewports. Motion writes `--scrub`, the number of viewports scrolled since pinning, and the CSS derives three phases from it. First, the garden photo opens from a framed card on ivory to full-bleed (`--e`). Next, the centred line "Let the world wait. / This moment is yours." lights word by word (`--t`): each word sharpens from a faint blur and rises slightly, while the photo slowly pushes in and the shade deepens. A hairline under the text fills with that progress. Finally, the film button rises in (`--f`) and the section releases. A few faint canvas petals drift throughout. The headline is one real `h2` in reading order. Without JavaScript or under reduced motion, the section is a single screen with the photo full-bleed and the line fully lit.

## Gallery

The gallery is a living mosaic. The pool holds nine photos, six of them on screen. Every 3.8 seconds one tile pushes in a photo that is not showing. It never swaps the hovered tile or the same tile twice running, and it only swaps for a matching orientation. Wide tiles push from the right and tall tiles from below. The incoming photo waits until it has loaded, and the caption rolls over to match. Photos also drift slowly while the gallery is on screen. Rotation pauses while the gallery is off screen, a filter is active, the lightbox is open, the tab is hidden or reduced motion is on. Filters show their matching photos as a static row. The lightbox steps through the full pool.

The lightbox is the photo alone on a dark, softly blurred backdrop, with its caption and controls rising in just after. Previous and next glide the new photo in from the matching side. Opening a photo morphs the tile into the lightbox with the View Transitions API. Only the photo travels: the page's own crossfade is switched off, so nothing ghosts. The tile's photo box and the lightbox photo take turns holding `view-transition-name: gallery-photo`, and the crop opens out to the full frame. The lightbox file is preloaded first, with a wait capped at 0.7s. Closing collapses back into whichever tile shows that photo, or fades if it is not on screen. Browsers without the API, and reduced motion, get the plain dialog.

## Media/performance

Hero uses eager/high-priority responsive photography, with fixed media geometry to prevent layout shift. Below-fold photographs are lazy-loaded. Film elements are mounted only after the visitor opens the film; controls and poster remain available. All media and fonts are same-origin. No third-party embeds, tracking or production stock hotlinks. Total repository media includes multiple image resolutions and both codecs; a page visit transfers only selected variants. Measured asset sizes are in `media-guidelines.md`; field Core Web Vitals require real production traffic and are not claimed from local tests.

## Navigation

On phones the menu is a full-screen dialog. Tailwind v4 centres dialogs with the `translate` property, so the menu resets it along with `transform`. Choosing a link closes the menu first. Once it has fully closed and released the scroll lock, the page scrolls to the section and moves focus there; otherwise the dialog would return focus to the toggle at the top of the page and scroll back up. The menu closes itself if the window widens past 768px.

## Inquiry behavior

This template has no configured venue email, booking backend or form service. The form validates names, email, guest count and date; it prepares a downloadable text inquiry. It explicitly states that nothing was sent. No personal details are persisted or transmitted. Connect a real destination before changing the action to “Send inquiry”; add server validation, rate limiting and delivery/error states then.

On phones the inquiry dialog is a bottom sheet with a grab handle. It can be dragged down from the handle area, or from anywhere once the sheet is scrolled to the top. Releasing past a quarter of its height, or with a flick faster than about 0.5px/ms over the last 120ms, closes it; anything less springs back. Fields use an underline that darkens on focus instead of the browser's outline box.

## Fictional content

Maison Vielle, its Provence location, coordinates, 1892 date, guest capacity, weekend availability and Charlotte/James testimonial are demonstration content. The selected stock images depict multiple locations and events. Replace venue claims and testimonial with verified business content before a real-world launch. The current private preview is a design/template demonstration.

## Design references

[Adovasio](https://www.adovasio.it/) informed the photographic editorial rhythm and expressive serif hierarchy. [Linka](https://linkaproduction.com/) informed immersive visual sections and controlled movement. Their code, media and brand elements were not copied.
