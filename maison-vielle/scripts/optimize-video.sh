#!/usr/bin/env bash
set -euo pipefail
command -v ffmpeg >/dev/null || { echo 'FFmpeg is required. Install it before running npm run media:video.' >&2; exit 1; }
SOURCE_DIR="${MEDIA_SOURCE_DIR:-.cache/media}"
DEST="public/media/video/atmosphere"
mkdir -p "$DEST" .cache/media
ffmpeg -hide_banner -loglevel error -y -i "$SOURCE_DIR/foliage-original.mp4" -t 11.7 -an -vf 'scale=1280:-2,fps=24' -c:v libvpx-vp9 -crf 36 -b:v 0 -row-mt 1 -threads 4 "$DEST/garden-film.webm"
ffmpeg -hide_banner -loglevel error -y -i "$SOURCE_DIR/foliage-original.mp4" -t 11.7 -an -vf 'scale=1280:-2,fps=24' -c:v libx264 -crf 27 -preset medium -pix_fmt yuv420p -movflags +faststart "$DEST/garden-film.mp4"
ffmpeg -hide_banner -loglevel error -y -ss 2 -i "$SOURCE_DIR/foliage-original.mp4" -frames:v 1 -vf 'scale=1280:-2' .cache/media/garden-film-poster.png
node --input-type=module -e "import sharp from 'sharp'; await sharp('.cache/media/garden-film-poster.png').webp({quality:80}).toFile('public/media/video/atmosphere/garden-film-poster.webp');"
echo 'Garden film optimized to 1280px, 24fps, silent WebM + MP4 with poster.'
