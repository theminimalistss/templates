# Host Maison Vielle on Hostinger

The template now exports a complete static site: HTML, CSS, JavaScript, fonts, photography, video and hero depth maps. Hostinger does not need to run Node.js, Cloudflare Workers, a database or a build service for this website. Node is only needed on your computer to develop and build it.

## Local setup

Use Node.js 22 LTS (22.13 or newer) and npm. If you use nvm, run `nvm install` and `nvm use` in this directory; `.nvmrc` selects Node 22.

From the repository root:

```sh
cd maison-vielle
npm ci
npm run dev
```

Development runs at http://localhost:5173. Run these commands inside `maison-vielle`, not the parent `templates` directory.

## Build and check the production website

```sh
npm run build
npm start
```

The build creates `dist/index.html`, `dist/404.html`, `dist/_next/`, `dist/media/`, `dist/fonts/`, and the other public files. It automatically checks that the exported homepage and referenced assets exist. `npm start` serves this exact static output at http://localhost:4173; it does not start a Cloudflare or Next.js application server. `npm run preview` is an alias.

## Create an upload package

```sh
npm run package:hostinger
```

This rebuilds the site and creates `release/maison-vielle-hostinger.zip`. The ZIP has `index.html` at its root and includes the hidden `.htaccess` file. It contains no project source, dependencies, credentials or raw media.

## Upload in hPanel

1. Use a **Custom PHP/HTML website** for the domain in Hostinger. The managed Website Builder editor is a separate product and does not accept this project as its theme.
2. Open that website's **File Manager** and its document root, normally `public_html`.
3. Back up any existing website files before replacing them. Remove or rename any old default `index.php` or `index.html` that would compete with this site's homepage.
4. Upload `release/maison-vielle-hostinger.zip` to `public_html` and extract it there.
5. Check that the resulting path is **`public_html/index.html`**, not `public_html/dist/index.html` or another nested directory. Keep `_next`, `media`, `fonts`, `favicon.svg`, `404.html` and `.htaccess` alongside it.
6. Remove the uploaded ZIP after extraction. Open your domain, then test the mobile menu, gallery and inquiry download. If an old version is still shown, clear the Hostinger cache and refresh your browser.

Alternatively, upload all **contents** of `dist/` directly, including hidden `.htaccess`. The current asset URLs target the root of a domain or subdomain, not a subdirectory such as `/maison-vielle/`.

The `.htaccess` file selects `index.html`, configures the static 404 page and provides modern media MIME types for Apache/LiteSpeed. Static hosts that ignore `.htaccess` can still serve the website; configure their 404 handling separately if needed.

## Updating the website

Edit the source, run `npm run package:hostinger` again and replace the deployed files with the new ZIP contents. Upload `_next` and the homepage together so the HTML and hashed JS/CSS remain in sync. Never upload `node_modules` or `.next`; `dist/` is the static upload directory.

## Troubleshooting

- **Commands fail in the parent directory:** enter `maison-vielle` first; there is no root package.json for the templates repository.
- **Unsupported Node version:** use Node 22.13+ and run `npm ci` again.
- **Dependencies from an older setup:** `npm ci` installs the exact updated lockfile and replaces the old dependency tree. Do not copy another computer's `node_modules`.
- **`dist/` does not exist:** run `npm run build` successfully before `npm start` or upload.
- **Homepage works but assets return 404:** check that `_next`, `media`, and `fonts` were extracted directly into `public_html` and that the site is at the domain root.
- **An old `dist/server` folder exists:** run `npm run build` to replace the retired Worker output with a clean static export. The completed build contains `dist/index.html` and no Worker server.
- **Inquiry does not send an email:** the existing inquiry feature intentionally downloads a brief. A real delivery service still needs to be connected; this hosting change does not add one.

## Official references

- [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
- [Hostinger: upload a website using File Manager](https://www.hostinger.com/support/how-to-upload-a-website-from-backups/)
- [Hostinger: add a website and select its platform](https://www.hostinger.com/support/1583214-how-to-add-a-website-in-hostinger/)
