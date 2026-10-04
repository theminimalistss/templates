import fs from "node:fs/promises";
import { createServer, loadEnv } from "vite";
const server = await createServer({
  mode: "production",
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.tsx");
  const routes = [
    "/",
    "/studio",
    "/services",
    "/work",
    "/work/casa-v01",
    "/work/monolith-house",
    "/work/axis-workspace",
    "/work/north-house",
    "/journal",
    "/journal/the-weight-of-material",
    "/journal/light-as-architecture",
    "/journal/objects-in-space",
    "/contact",
    "/404",
  ];
  const template = await fs.readFile("dist/index.html", "utf8");
  for (const route of routes) {
    let markup = await render(route);
    const head = [];
    markup = markup.replace(
      /<title>.*?<\/title>|<meta [^>]+\/>|<link [^>]+\/>/g,
      (match) => {
        head.push(match);
        return "";
      },
    );
    const html = template
      .replace(/<title>.*?<\/title>/, "")
      .replace("</head>", head.join("") + "</head>")
      .replace('id="root"', `id="root" data-rendered-path="${route}"`)
      .replace("<!--app-html-->", markup);
    const folder = route === "/" ? "dist" : `dist${route}`;
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(`${folder}/index.html`, html);
    if (route !== "/") await fs.writeFile(`dist${route}.html`, html);
  }
  const origin = (
    process.env.VITE_SITE_URL ||
    loadEnv("production", process.cwd(), "VITE_").VITE_SITE_URL ||
    "https://volume-studio.example"
  ).replace(/\/$/, "");
  await fs.writeFile(
    "dist/robots.txt",
    `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
  );
  await fs.writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes
      .filter((route) => route != "/404")
      .map((route) => `<url><loc>${origin}${route}</loc></url>`)
      .join("")}</urlset>`,
  );
  console.log(`Prerendered ${routes.length} routes.`);
} finally {
  await server.close();
}
