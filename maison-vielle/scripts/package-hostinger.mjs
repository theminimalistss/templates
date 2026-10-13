import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zipSync } from 'fflate';
import { exportDirectory, isUploadEntry, verifyExport } from './verify-export.mjs';

await verifyExport();
const entries = {};
async function collect(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    const name = `${prefix}${entry.name}`;
    if (!isUploadEntry(name)) continue; // skips dist/dev (the local dev build) and .DS_Store
    if (entry.isDirectory()) await collect(filename, `${name}/`);
    else if (entry.isFile()) {
      entries[name] = new Uint8Array(await readFile(filename));
    }
  }
}
await collect(exportDirectory);
const directory = fileURLToPath(new URL('../release/', import.meta.url));
await mkdir(directory, { recursive: true });
const filename = path.join(directory, 'maison-vielle-hostinger.zip');
const archive = zipSync(entries, { level: 6 });
await writeFile(filename, archive);
console.log(`Created ${filename} (${(archive.byteLength / 1024 / 1024).toFixed(2)} MiB).`);
console.log('Extract it inside your domain’s public_html folder. index.html must be directly inside public_html.');
