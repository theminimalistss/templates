#!/usr/bin/env bash
set -euo pipefail
mkdir -p .cache/media public/media/video public/media/audio
curl -L --fail -s 'https://videos.pexels.com/video-files/34955072/14807040_3840_2160_50fps.mp4' -o .cache/media/interior-film.mp4
ffmpeg -hide_banner -loglevel error -y -i .cache/media/interior-film.mp4 -t 5 -an -vf 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24' -c:v libx264 -preset slow -crf 26 -movflags +faststart public/media/video/interior-720.mp4
ffmpeg -hide_banner -loglevel error -y -i .cache/media/interior-film.mp4 -t 5 -an -vf 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24' -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 public/media/video/interior-720.webm
ffmpeg -hide_banner -loglevel error -y -i .cache/media/interior-film.mp4 -frames:v 1 -vf scale=1280:720 .cache/media/interior-poster.png
node --input-type=module -e "import sharp from 'sharp'; await sharp('.cache/media/interior-poster.png').webp({quality:75}).toFile('public/media/video/interior-poster.webp')"
curl -L --fail -s 'https://assets.mixkit.co/active_storage/sfx/2531/2531-preview.mp3' -o .cache/media/click.mp3
ffmpeg -hide_banner -loglevel error -y -i .cache/media/click.mp3 -t 0.35 -af 'afade=t=out:st=0.15:d=0.2' -codec:a libmp3lame -b:a 64k public/media/audio/navigation.mp3
