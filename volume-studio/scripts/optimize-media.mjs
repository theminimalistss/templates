import fs from "node:fs/promises";
import sharp from "sharp";
import { execFileSync } from "node:child_process";
const manifest = JSON.parse(
  await fs.readFile("scripts/media-manifest.json", "utf8"),
);
await fs.mkdir(".cache/media", { recursive: true });
await fs.mkdir("public/media/images", { recursive: true });
const metadata = {};
const audit = [];
for (const asset of manifest) {
  const source = `.cache/media/${asset.originalFilename}`;
  try {
    await fs.access(source);
  } catch {
    execFileSync("curl", [
      "-L",
      "--fail",
      "--silent",
      "--show-error",
      asset.url,
      "-o",
      source,
    ]);
  }
  const original = await sharp(source).metadata();
  metadata[asset.id] = { width: original.width, height: original.height };
  for (const width of [480, 768, 1024, 1440, 1920]) {
    for (const format of ["avif", "webp"]) {
      const output = `public/media/images/${asset.id}-${width}.${format}`;
      await sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toFormat(format, { quality: format === "avif" ? 48 : 76, effort: 4 })
        .toFile(output);
      audit.push({ file: output, bytes: (await fs.stat(output)).size });
    }
  }
  console.log(`Optimized ${asset.id}`);
}
await fs.writeFile(
  "src/repositories/media-metadata.json",
  JSON.stringify(metadata, null, 2) + "\n",
);
await fs.writeFile(
  "docs/media-audit.json",
  JSON.stringify(audit, null, 2) + "\n",
);
