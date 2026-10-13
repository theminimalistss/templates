import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const exportDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
/** `next dev` keeps its own build in dist/dev. It is local-only: never verified, counted or uploaded. */
export const devDirectory = 'dev';
export const isUploadEntry = (relativePath) => relativePath.split(/[\\/]/)[0] !== devDirectory && path.basename(relativePath) !== '.DS_Store';

export async function verifyExport() {
  const required = ['index.html', '404.html', '.htaccess', '_next/static', 'media', 'fonts'];
  for (const name of required) {
    try { await access(path.join(exportDirectory, name)); }
    catch { throw new Error(`Missing dist/${name}. Run npm run build before uploading.`); }
  }

  const rootEntries = await readdir(exportDirectory);
  const runtimeFiles = ['server', 'cache', 'BUILD_ID', 'wrangler.json'];
  if (rootEntries.some(name => runtimeFiles.includes(name))) {
    throw new Error('dist contains server or cache files. Run npm run build to regenerate a clean static export.');
  }

  const html = await readFile(path.join(exportDirectory, 'index.html'), 'utf8');
  if (!html.includes('Maison Vielle') || !html.includes('id="main"')) {
    throw new Error('The export must contain the rendered venue page, not an empty app shell.');
  }

  const urls = new Set();
  for (const match of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) urls.add(match[1]);
  for (const match of html.matchAll(/(?:srcset|imageSrcSet)="([^"]+)"/gi)) {
    for (const candidate of match[1].split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url.startsWith('/')) urls.add(url);
    }
  }
  for (const url of urls) {
    const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
    const filename = path.join(exportDirectory, pathname);
    try { await access(filename); }
    catch { throw new Error(`Exported HTML references a missing file: ${url}`); }
  }

  let count = 0;
  let bytes = 0;
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name);
      if (!isUploadEntry(path.relative(exportDirectory, filename))) continue;
      if (entry.isDirectory()) await inspect(filename);
      else if (entry.isFile()) { count++; bytes += (await stat(filename)).size; }
    }
  }
  await inspect(exportDirectory);
  console.log(`Static export verified: ${count} files, ${(bytes / 1024 / 1024).toFixed(2)} MiB. Upload the contents of dist/ (except dev/) to public_html/, or use npm run package:hostinger.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await verifyExport();
}
