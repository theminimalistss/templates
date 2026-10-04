import fs from "node:fs/promises";
import sharp from "sharp";
const manifest = JSON.parse(
  await fs.readFile("scripts/media-manifest.json", "utf8"),
);
let bytes = 0;
let count = 0;
for (const { id } of manifest)
  for (const width of [480, 768, 1024, 1440, 1920])
    for (const format of ["avif", "webp"]) {
      const file = `public/media/images/${id}-${width}.${format}`;
      const metadata = await sharp(file).metadata();
      if (metadata.width !== width)
        throw new Error(`Unexpected width: ${file} (${metadata.width})`);
      bytes += (await fs.stat(file)).size;
      count++;
    }
for (const file of [
  "public/media/audio/navigation.mp3",
  "public/media/video/interior-720.mp4",
  "public/media/video/interior-720.webm",
  "public/media/video/interior-poster.webp",
  "public/fonts/archivo.woff2",
  "public/fonts/manrope.woff2",
])
  await fs.access(file);
console.log(
  `${count} responsive images verified; ${(bytes / 1024 / 1024).toFixed(2)} MiB total across every size/codec. Audio, video and fonts present.`,
);
