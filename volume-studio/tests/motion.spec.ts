import { expect, test } from "@playwright/test";

test("hero brings in the media before the headline and responds with opposing depth", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator(".hero");
  await expect(hero).toHaveAttribute("data-hero-phase", "entering");
  await expect(page.locator(".hero-title-word").first()).toHaveCSS(
    "opacity",
    "0",
  );
  await expect(page.locator(".header .wordmark")).toHaveCSS(
    "animation-name",
    "header-emerge",
  );
  await expect(hero).toHaveCSS("overflow", "visible");
  await expect(hero).toHaveAttribute("data-hero-phase", "ready");
  await expect(page.locator(".hero-title-word").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".header .wordmark")).toHaveCSS("opacity", "1");
  await expect(page.locator(".header .wordmark")).toHaveCSS(
    "transform",
    "none",
  );
  await expect(hero).toHaveCSS("overflow", "hidden");
  await page.mouse.move(1380, 550);
  await expect
    .poll(() =>
      hero.evaluate((node) =>
        parseFloat(node.style.getPropertyValue("--pointer-x")),
      ),
    )
    .toBeGreaterThan(25);
  const translations = await page
    .locator(".hero-main-image, .hero-small-image")
    .evaluateAll((nodes) =>
      nodes.map((node) => new DOMMatrix(getComputedStyle(node).transform).m41),
    );
  expect(translations[0]).toBeGreaterThan(20);
  expect(translations[1]).toBeLessThan(-25);
  await page.screenshot({ path: "test-results/hero-depth.png" });
});

test("hero cycles automatically and preserves a manually selected project until resumed", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator(".hero");
  const caption = page.locator(".hero-project");
  await expect(hero).toHaveAttribute("data-hero-phase", "ready");
  await expect(caption).toContainText("CASA V01");
  await expect(caption).toContainText("MONOLITH HOUSE", { timeout: 8000 });
  await expect(
    page.locator(".hero-main-image .hero-slide-outgoing"),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "Show AXIS WORKSPACE" }).click();
  await page.mouse.move(0, 0);
  await expect(hero).toHaveAttribute("data-carousel-playing", "false");
  await page.clock.install();
  await page.clock.fastForward(6500);
  await expect(caption).toContainText("AXIS WORKSPACE");
  await page
    .getByRole("button", { name: "Resume automatic project slideshow" })
    .click();
  await page.mouse.move(0, 0);
  await expect(hero).toHaveAttribute("data-carousel-playing", "true");
  await page.clock.fastForward(5500);
  await expect(caption).toContainText("NORTH HOUSE");
  await page.keyboard.press("Tab");
  await expect(hero).toHaveAttribute("data-carousel-playing", "false");
});

test("scroll reveals editorial content, expands the film and assembles distinct process drawings", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const heading = page.locator(".manifesto h2");
  await expect(heading).not.toHaveAttribute("data-revealed", "true");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute("data-revealed", "true");
  await expect(heading.locator(".reveal-line > span").first()).toHaveCSS(
    "transform",
    "none",
  );
  const firstTravel = await heading.evaluate((node) =>
    node.style.getPropertyValue("--type-travel"),
  );
  await page.evaluate(() => window.scrollBy({ top: 160, behavior: "instant" }));
  await expect
    .poll(() =>
      heading.evaluate((node) => node.style.getPropertyValue("--type-travel")),
    )
    .not.toBe(firstTravel);
  const film = page.locator(".philosophy");
  await film.evaluate((node) =>
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY - innerHeight * 0.7,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      film.evaluate((node) =>
        parseFloat(node.style.getPropertyValue("--story-progress")),
      ),
    )
    .toBeLessThan(0.5);
  await film.evaluate((node) =>
    window.scrollTo({
      top: node.getBoundingClientRect().top + scrollY,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      film.evaluate((node) => node.style.getPropertyValue("--story-progress")),
    )
    .toBe("1");
  await page.getByRole("tab", { name: /SHAPE/ }).click();
  await expect(
    page.getByRole("img", { name: /Shape: floor, wall and roof/ }),
  ).toBeVisible();
  await page.getByRole("tab", { name: /REALIZE/ }).click();
  await expect(
    page.getByRole("img", { name: /Realize: a completed interior/ }),
  ).toBeVisible();
  await expect(page.locator(".realize-furniture")).toHaveCSS("opacity", "1");
  await page
    .locator(".process")
    .screenshot({ path: "test-results/process-realize.png" });
});

test("filter changes reveal newly mounted project images", async ({ page }) => {
  await page.goto("/work");
  await page.getByRole("button", { name: /Commercial/ }).click();
  await page.getByRole("button", { name: /All/ }).click();
  const photos = page.locator(".work-index .project-photo");
  await expect(photos).toHaveCount(4);
  for (const photo of await photos.all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect(photo).toHaveAttribute("data-revealed", "true");
  }
});

test("reduced motion shows the final composition immediately and keeps manual slide controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveAttribute(
    "data-hero-phase",
    "ready",
  );
  await expect(page.locator(".hero")).toHaveAttribute(
    "data-carousel-playing",
    "false",
  );
  await expect(page.locator(".hero-title-word").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".hero-main-image")).toHaveCSS("transform", "none");
  await expect(page.locator(".hero-playback")).toHaveCount(0);
  await page.getByRole("button", { name: "Show MONOLITH HOUSE" }).click();
  await expect(page.locator(".hero-project")).toContainText("MONOLITH HOUSE");
  await page.clock.install();
  await page.clock.fastForward(12000);
  await expect(page.locator(".hero-project")).toContainText("MONOLITH HOUSE");
});

test("expertise text stays revealed through hover, expansion and returning to the section", async ({
  page,
}) => {
  await page.goto("/services");
  await expect(page.locator(".route-scene")).toHaveAttribute(
    "data-route-phase",
    "ready",
  );
  const rows = page.locator(".service-row");
  await rows.first().scrollIntoViewIfNeeded();
  for (const row of await rows.all()) {
    const button = row.getByRole("button");
    await button.hover();
    await expect(row).toHaveCSS("opacity", "1");
    await expect(row).toHaveAttribute("data-revealed", "true");
    await expect(row.locator(".service-title > span[aria-hidden]")).toHaveCSS(
      "transform",
      "matrix(1, 0, 0, 1, 0, 0)",
    );
    await button.click();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(row.locator(".service-details")).toBeVisible();
    await button.click();
  }
  await page.locator("footer").scrollIntoViewIfNeeded();
  await rows.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  for (const row of await rows.all())
    await expect(row).toHaveCSS("opacity", "1");
});

test("process keeps its focal circle and smoothly retargets all four stages", async ({
  page,
}) => {
  await page.goto("/studio");
  await page.getByRole("tab", { name: /OBSERVE/ }).click();
  const tracker = page.locator(".diagram-tracker");
  const circle = page.locator(".diagram-focus");
  await circle.evaluate((node) =>
    node.setAttribute("data-identity", "persistent"),
  );
  await expect(tracker).toHaveCSS("transform", "matrix(1, 0, 0, 1, 205, 75)");
  const stages = [
    ["DEFINE", 240, 105],
    ["SHAPE", 205, 20],
    ["REALIZE", 309, 128],
    ["OBSERVE", 205, 75],
  ] as const;
  for (const [name, x, y] of stages) {
    const before = await tracker.evaluate(
      (node) => getComputedStyle(node).transform,
    );
    await page.getByRole("tab", { name: new RegExp(name) }).click();
    await expect(circle).toHaveAttribute("data-identity", "persistent");
    const target = `matrix(1, 0, 0, 1, ${x}, ${y})`;
    await expect
      .poll(() => tracker.evaluate((node) => getComputedStyle(node).transform))
      .not.toBe(before);
    expect(
      await tracker.evaluate((node) => getComputedStyle(node).transform),
    ).not.toBe(target);
    await expect(tracker).toHaveCSS("transform", target);
  }
});

test("every primary destination enters after mounting and has image and heading parallax", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  for (const [name, path] of [
    ["Studio", "/studio"],
    ["Work", "/work"],
    ["Services", "/services"],
    ["Journal", "/journal"],
    ["LET’S TALK", "/contact"],
  ]) {
    const link =
      name === "LET’S TALK"
        ? page.getByRole("link", { name, exact: true })
        : page
            .getByRole("navigation", { name: "Primary", exact: true })
            .getByRole("link", { name, exact: true });
    await link.click();
    const scene = page.locator(`.route-scene[data-route-path="${path}"]`);
    await expect(scene).toHaveAttribute("data-route-phase", "entering");
    expect(
      await scene
        .locator(".route-content")
        .evaluate((node) =>
          node
            .getAnimations()
            .some(
              (animation) =>
                animation.id === "volume-route-enter" &&
                animation.playState === "running",
            ),
        ),
    ).toBe(true);
    await expect(scene).toHaveAttribute("data-route-phase", "ready");
    const heading = page.locator("[data-scroll-heading]").first();
    const initialHeading = await heading.evaluate(
      (node) => getComputedStyle(node).transform,
    );
    await page.evaluate(() => scrollBy({ top: 150, behavior: "instant" }));
    await expect
      .poll(() => heading.evaluate((node) => getComputedStyle(node).transform))
      .not.toBe(initialHeading);
    const media = page.locator("[data-image-depth]").first();
    await media.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        media.evaluate((node) => node.style.getPropertyValue("--image-drift")),
      )
      .not.toBe("");
    const before = await media.evaluate((node) =>
      node.style.getPropertyValue("--image-drift"),
    );
    await page.evaluate(() => scrollBy({ top: 180, behavior: "instant" }));
    await expect
      .poll(() =>
        media.evaluate((node) => node.style.getPropertyValue("--image-drift")),
      )
      .not.toBe(before);
  }
});

test("a slow route chunk still receives its full entrance after navigation", async ({
  page,
}) => {
  await page.route("**/ServicesPage-*.js", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1600));
    await route.continue();
  });
  await page.goto("/work");
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  const scene = page.locator('.route-scene[data-route-path="/services"]');
  await expect(scene).toHaveAttribute("data-route-phase", "entering");
  expect(
    await scene
      .locator(".route-content")
      .evaluate((node) => Number(node.getAnimations()[0]?.currentTime)),
  ).toBeLessThan(600);
  await expect(scene).toHaveAttribute("data-route-phase", "ready");
  await expect(page.locator("h1")).toContainText("FROM SPACE");
});

test("reduced motion skips route and scroll movement while preserving service and process controls", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/services");
  await expect(page.locator(".route-scene")).toHaveAttribute(
    "data-route-phase",
    "ready",
  );
  expect(
    await page
      .locator(".route-content")
      .evaluate((node) => node.getAnimations().length),
  ).toBe(0);
  await expect(page.locator("h1")).toHaveCSS("transform", "none");
  await page.getByRole("button", { name: /RESIDENTIAL INTERIORS/ }).click();
  await expect(page.getByText("Private residences")).toBeVisible();
  await page.getByRole("tab", { name: /OBSERVE/ }).click();
  await page.getByRole("tab", { name: /DEFINE/ }).click();
  await expect(page.locator(".diagram-tracker")).toHaveCSS(
    "transform",
    "matrix(1, 0, 0, 1, 240, 105)",
  );
  await expect(page.locator(".diagram-tracker")).toHaveCSS(
    "transition-duration",
    "0s",
  );
});
