import fs from "node:fs/promises";
const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
const lock = JSON.parse(await fs.readFile("package-lock.json", "utf8"));
const versionFile = (await fs.readFile("VERSION", "utf8")).trim();
const state = await fs.readFile(".agent/PROJECT_STATE.md", "utf8");
const changelog = await fs.readFile("CHANGELOG.md", "utf8");
if (
  pkg.version !== lock.version ||
  pkg.version !== versionFile ||
  !state.includes(pkg.version) ||
  !changelog.includes(pkg.version)
)
  throw new Error("Version files disagree.");
console.log(`Version ${pkg.version} is consistent.`);
