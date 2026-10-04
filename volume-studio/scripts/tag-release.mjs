import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
const { version } = JSON.parse(await fs.readFile("package.json", "utf8"));
execFileSync("node", ["scripts/check-version.mjs"], { stdio: "inherit" });
const tag = `v${version}`;
if (!process.argv.includes("--apply")) {
  console.log(
    `Ready to create local annotated tag ${tag}. Commit the intended release, then run npm run release:tag -- --apply. No remote push or release is performed.`,
  );
  process.exit(0);
}
if (execFileSync("git", ["status", "--porcelain"], { encoding: "utf8" }).trim())
  throw new Error("Commit the intended release before tagging.");
execFileSync("git", ["tag", "-a", tag, "-m", `VOLUME Studio ${version}`], {
  stdio: "inherit",
});
