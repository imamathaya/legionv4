import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Button accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/preview/button");
    await page.waitForSelector('[data-testid="button-showcase"]');
  });

  for (const mode of ["light", "dark"] as const) {
    test(`has no axe violations in ${mode} mode`, async ({ page }) => {
      await page.evaluate((theme) => {
        document.documentElement.classList.toggle("dark", theme === "dark");
      }, mode);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("meets the minimum target size and keeps long labels usable", async ({ page }) => {
    const boxes = await page.locator("[data-slot='button']").evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height, text: button.textContent };
      }),
    );
    for (const box of boxes) {
      expect(box.height).toBeGreaterThanOrEqual(24);
      expect(box.width).toBeGreaterThanOrEqual(24);
    }

    await page.setViewportSize({ width: 320, height: 800 });
    const longLabel = page.getByRole("button", { name: /long label/i });
    await expect(longLabel).toBeVisible();
    const box = await longLabel.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });

  test("shows a visible focus outline", async ({ page }) => {
    const first = page.locator("[data-slot='button']").first();
    await first.focus();
    const outlineWidth = await first.evaluate((element) => getComputedStyle(element).outlineWidth);
    expect(outlineWidth).not.toBe("0px");
  });

  test("removes spinner animation under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const spinner = page.locator("[data-slot='button'] .animate-spin").first();
    if ((await spinner.count()) > 0) {
      const animation = await spinner.evaluate((element) => getComputedStyle(element).animationName);
      expect(animation).toBe("none");
    }
  });
});
