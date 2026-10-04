import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  ["/", "WE SHAPE"],
  ["/studio", "SPACE,"],
  ["/services", "FROM SPACE"],
  ["/work", "OUR WORK"],
  ["/work/casa-v01", "CASA V01"],
  ["/work/monolith-house", "MONOLITH HOUSE"],
  ["/work/axis-workspace", "AXIS WORKSPACE"],
  ["/work/north-house", "NORTH HOUSE"],
  ["/journal", "THINKING"],
  ["/journal/the-weight-of-material", "THE WEIGHT"],
  ["/journal/light-as-architecture", "LIGHT AS"],
  ["/journal/objects-in-space", "OBJECTS IN"],
  ["/contact", "START"],
  ["/missing-page", "UNBUILT"],
];
for (const [route, title] of routes)
  test(`renders ${route} without browser errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator("h1")).toContainText(title);
    await expect(page).toHaveTitle(/VOLUME Studio/);
    await page.waitForTimeout(200);
    expect(errors).toEqual([]);
    const canonical = await page
      .locator("link[rel=canonical]")
      .getAttribute("href");
    expect(canonical).toContain("https://volume-studio.example");
  });
for (const width of [375, 430, 768, 1024, 1280, 1440, 1920])
  test(`homepage composition at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await page.locator(".hero-main-image img").waitFor();
    await expect
      .poll(() =>
        page
          .locator(".hero-main-image img")
          .evaluate(
            (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
          ),
      )
      .toBe(true);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({ path: `test-results/home-${width}.png` });
    await page.locator("footer").scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("filters projects and navigates through project case studies", async ({
  page,
}) => {
  await page.goto("/work");
  await page.getByRole("button", { name: /Commercial/ }).click();
  await expect(page.locator(".work-index .project-card")).toHaveCount(1);
  await expect(page).toHaveURL(/type=Commercial/);
  await page.getByRole("link", { name: /AXIS WORKSPACE/ }).click();
  await expect(page.locator("h1")).toHaveText("AXIS WORKSPACE");
  await page.getByRole("link", { name: /NEXT PROJECT/ }).click();
  await expect(page.locator("h1")).toHaveText("NORTH HOUSE");
  await page.goBack();
  await expect(page.locator("h1")).toHaveText("AXIS WORKSPACE");
});
test("mobile menu traps focus, closes with Escape and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const open = page.getByRole("button", { name: "MENU" });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 9; i++) await page.keyboard.press("Tab");
  expect(
    await page.evaluate(() =>
      Boolean(document.activeElement?.closest("dialog")),
    ),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(open).toBeFocused();
  await open.click();
  await dialog.getByRole("link", { name: /Work/ }).click();
  await expect(page.locator("h1")).toContainText("OUR WORK");
  await expect(dialog).not.toBeVisible();
  expect(
    await page.evaluate(() => getComputedStyle(document.body).overflow),
  ).not.toBe("hidden");
});
test("contact form validates and downloads a truthful project brief", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "PREPARE PROJECT BRIEF" }).click();
  await expect(page.getByLabel("YOUR NAME")).toBeFocused();
  await expect(page.getByText("Enter a valid email address.")).toBeVisible();
  await page.getByLabel("YOUR NAME").fill("Alex Santos");
  await page.getByLabel("EMAIL ADDRESS").fill("alex@example.com");
  await page
    .getByLabel("PROJECT TYPE", { exact: true })
    .selectOption("Residential");
  await page.getByLabel("PROJECT LOCATION").fill("Cebu");
  await page.getByLabel(/ESTIMATED SIZE/).fill("320");
  await page
    .getByLabel("A LITTLE ABOUT YOUR PROJECT")
    .fill("A quiet courtyard home with space for a growing family.");
  await page.getByRole("button", { name: "PREPARE PROJECT BRIEF" }).click();
  await expect(page.getByText("YOUR BRIEF IS READY.")).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /DOWNLOAD BRIEF/ }).click();
  expect((await download).suggestedFilename()).toBe("volume-project-brief.txt");
});
test("sound requires explicit opt-in and can be disabled", async ({ page }) => {
  await page.goto("/");
  const sound = page.getByRole("button", { name: "SOUND OFF" });
  await expect(sound).toHaveAttribute("aria-pressed", "false");
  await sound.click();
  await expect(page.getByRole("button", { name: "SOUND ON" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "SOUND ON" }).click();
  await expect(sound).toHaveAttribute("aria-pressed", "false");
});
test("reduced motion disables depth, intro and video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".intro")).not.toBeVisible();
  await page.locator(".philosophy").scrollIntoViewIfNeeded();
  await expect(page.locator("video")).toHaveCount(0);
  expect(
    await page
      .locator(".hero-main-image")
      .evaluate((node) => getComputedStyle(node).transform),
  ).toBe("none");
});
test("desktop gallery responds to controls and service rows expand", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.locator(".horizontal-gallery").scrollIntoViewIfNeeded();
  const before = await page
    .locator("[data-track]")
    .evaluate((node) => getComputedStyle(node).transform);
  await page
    .getByRole("button", { name: "Next projects", exact: true })
    .click();
  await page.waitForTimeout(900);
  const after = await page
    .locator("[data-track]")
    .evaluate((node) => getComputedStyle(node).transform);
  expect(after).not.toBe(before);
  await page
    .getByRole("button", { name: /MATERIAL \+ OBJECT CURATION/ })
    .click();
  await expect(
    page.getByText("Furniture selection", { exact: true }),
  ).toBeVisible();
});
test("all loaded images work and production assets stay same-origin", async ({
  page,
}) => {
  const external: string[] = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:4174") &&
      !request.url().startsWith("data:")
    )
      external.push(request.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  for (const image of await page.locator("img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        image.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  expect(external).toEqual([]);
});
for (const path of ["/", "/work", "/contact"])
  test(`accessibility audit ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
test("mobile navigation passes an accessibility audit", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "MENU" }).click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});
test("prerendered project is readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4174/work/casa-v01/");
  await expect(page.locator("h1")).toHaveText("CASA V01");
  await expect(page.locator("meta[name=description]")).toHaveAttribute(
    "content",
    /intimate residence/,
  );
  await context.close();
});
for (const width of [375, 430, 768, 1024, 1280, 1440, 1920])
  test(`all inner pages reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const [route] of routes.slice(1)) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `Overflow on ${route} at ${width}px`,
      ).toBe(true);
    }
  });
test("a bookmarked filter does not produce stale metadata or hydration errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/work?type=Commercial");
  await expect(page.locator(".work-index .project-card")).toHaveCount(1);
  await expect(page.locator("link[rel=canonical]")).toHaveCount(1);
  await expect(page.locator("meta[name=description]")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("film loads near its section, plays silently and respects pause", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
  await page.locator(".philosophy").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("video")
        .evaluate((video: HTMLVideoElement) => video.currentTime),
    )
    .toBeGreaterThan(0);
  expect(
    await page
      .locator("video")
      .evaluate((video: HTMLVideoElement) => video.muted),
  ).toBe(true);
  await page.getByRole("button", { name: /PAUSE MOTION/ }).click();
  expect(
    await page
      .locator("video")
      .evaluate((video: HTMLVideoElement) => video.paused),
  ).toBe(true);
  await page.getByRole("button", { name: /PLAY MOTION/ }).click();
  await expect
    .poll(() =>
      page.locator("video").evaluate((video: HTMLVideoElement) => video.paused),
    )
    .toBe(false);
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("video").count()).toBe(0);
});
