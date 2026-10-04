import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import fs from "node:fs/promises";
const browser = await chromium.launch({
  args: ["--remote-debugging-port=9223"],
});
try {
  await fs.mkdir(".cache/lighthouse", { recursive: true });
  for (const formFactor of ["mobile", "desktop"]) {
    const flags = {
      port: 9223,
      output: "json",
      logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    };
    const config =
      formFactor === "desktop"
        ? {
            extends: "lighthouse:default",
            settings: {
              formFactor: "desktop",
              screenEmulation: {
                mobile: false,
                width: 1440,
                height: 1000,
                deviceScaleFactor: 1,
                disabled: false,
              },
              throttling: {
                rttMs: 40,
                throughputKbps: 10240,
                cpuSlowdownMultiplier: 1,
              },
            },
          }
        : undefined;
    const result = await lighthouse("http://127.0.0.1:4174/", flags, config);
    await fs.writeFile(`.cache/lighthouse/${formFactor}.json`, result.report);
    console.log(
      formFactor,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            Math.round(value.score * 100),
          ]),
        ),
      ),
    );
    console.log(
      "Metrics",
      JSON.stringify(
        Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "cumulative-layout-shift",
            "total-blocking-time",
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
      ),
    );
  }
} finally {
  await browser.close();
}
