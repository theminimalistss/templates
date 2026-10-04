# Media pipeline

All runtime media and fonts are same-origin. Production assets live in `public/`; source downloads and processing scratch files live in ignored `.cache/media/`.

```sh
npm run media:optimize
bash scripts/optimize-video.sh
npm run media:inspect
```

Image source URLs, original names, creators and licenses are in `scripts/media-manifest.json` and `media-sources.md`. `optimize-media.mjs` fetches missing sources with curl, preserves aspect ratios and writes **480, 768, 1024, 1440 and 1920px** AVIF (quality 48) and WebP (quality 76). It emits authoritative dimensions in `src/repositories/media-metadata.json` and byte measurements in `docs/media-audit.json`.

`ResponsiveImage` outputs picture/source/srcset/sizes, intrinsic dimensions and loading/decoding hints. The hero is eager/high priority; lower images are lazy. React SSR adds the responsive hero preload. No production asset references remote stock URLs.

Video source: 3840×2160 at 50fps, 9.3MB. Outputs: silent 1280×720 at 24fps, five seconds, MP4/H.264 with fast start (~276KB) and WebM/VP9 (~185KB), plus a ~31KB WebP poster. Use ffmpeg with libx264 and libvpx-vp9; sharp encodes the poster because not every ffmpeg build includes a WebP encoder.

Audio: 0.35-second fade-trimmed MP3 at 64kbps, ~3.3KB. The MP3 is broadly supported; no uncompressed WAV is shipped.

Archivo (Latin subset variable WOFF2, ~34KB) and Manrope (variable WOFF2, ~24KB) are self-hosted with OFL notices. Source image files are not required to run/build because all optimized variants are committed.
