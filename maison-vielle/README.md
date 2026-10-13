# Maison Vielle

Version 0.2.2 (see `VERSION`).

An editorial luxury wedding-estate website inspired by Adovasio and Linka. Built with React 19, TypeScript and Next.js, with a static export for Hostinger.

## Highlights

- **Cinematic intro and spatial hero.** A loading curtain lifts away and the title rises letter by letter. The hero photograph is a depth-separated WebGL scene: the lawn and sky drift apart as the cursor, device tilt or scroll moves the camera.
- **Scroll reveals.** Headings slide up line by line, text rises in sequence, photographs unveil, and section rules draw across.
- **Cinematic break.** A pinned section where a framed photograph opens to full-bleed and "Let the world wait. This moment is yours." lights word by word as you scroll.
- **Living gallery.** Tiles swap photographs every few seconds with a push transition. Opening a photo morphs it from its tile into the lightbox and back again.
- **Inquiry brief builder.** Validated fields produce a downloadable brief. On phones the form is a bottom sheet with drag-to-close.
- **Accessible by default.** Keyboard-accessible dialogs, reduced-motion support throughout, and content that stays visible without JavaScript.

## Run

Requires Node 22.13 or newer (Node 22 LTS recommended). Run these commands inside the `maison-vielle` directory.

```sh
npm ci
npm run dev
```

Open the local URL printed by the server, normally http://localhost:5173.

```sh
npm run typecheck
npm run lint
npm run build
npm run media:inspect
```

## Hostinger deployment

```sh
npm run package:hostinger
```

Upload `release/maison-vielle-hostinger.zip` to your domain’s `public_html` folder and extract it there. `index.html` must sit directly inside `public_html`. The build also creates `dist/`; you can upload its contents instead, leaving out `dist/dev`, which is the local dev server's build. Node.js is not required on the hosting server.

Run `npm start` (or `npm run preview`) to preview the built static website at http://localhost:4173.

See [Hostinger setup and troubleshooting](docs/hostinger.md) for the complete instructions.

## Customize

- **Copy:** `app/page.tsx`.
- **Visual tokens and motion:** `app/globals.css`.
- **Gallery and media configuration:** `content/media.ts`.
- **Hero depth maps:** regenerate with `npm run media:depth` whenever the hero photograph changes. It needs a one-off `npm i --no-save @huggingface/transformers`.

[Architecture](docs/architecture.md) describes motion, interactions and component boundaries. [Media sources](docs/media-sources.md) records licensing and credits. [Media guidelines](docs/media-guidelines.md) has measured optimization results and reproducible processing commands. [Verification](docs/verification.md) lists what was checked for this version. Change notes for AI-assisted work live in [`.agent/`](.agent/README.md).

## Before using it for a real venue

This is a fictional venue template. Location, capacity, history and testimonial are sample content. The inquiry flow downloads a validated brief; it does not send an email or reserve a date. Connect real venue delivery and replace demonstration claims before using the site for a real business.

Stock media and fonts retain their separate licenses. Do not resell stock assets as standalone media or imply endorsement.
