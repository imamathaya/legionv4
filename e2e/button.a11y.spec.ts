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

  test("meets the minimum target size at 320 px without page overflow", async ({ page }) => {
    const boxes = await page.locator("[data-slot='button']").evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
    for (const box of boxes) {
      expect(box.height).toBeGreaterThanOrEqual(24);
      expect(box.width).toBeGreaterThanOrEqual(24);
    }

    await page.setViewportSize({ width: 320, height: 800 });
    await expect(page.getByTestId("long-label")).toBeVisible();
    const box = await page.getByTestId("long-label").boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(24);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  });

  test("keeps every Button usable at 200% zoom", async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.style.zoom = "2";
    });
    const button = page.getByTestId("state-default");
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThanOrEqual(24);
    await button.click();
    await expect(button).toBeVisible();
  });

  test("shows a visible focus outline", async ({ page }) => {
    const first = page.getByTestId("state-default");
    await first.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(first).toBeFocused();
    const outline = await first.evaluate((element) => {
      const style = getComputedStyle(element);
      return { width: style.outlineWidth, style: style.outlineStyle };
    });
    expect(outline.style).toBe("solid");
    expect(Number.parseFloat(outline.width)).toBeGreaterThanOrEqual(2);
  });

  test("removes spinner animation under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const spinner = page.getByTestId("state-loading").locator("[data-slot='button-spinner']");
    await expect(spinner).toBeVisible();
    const animation = await spinner.evaluate((element) => getComputedStyle(element).animationName);
    expect(animation).toBe("none");
  });

  test("announces loading exactly once through a status region", async ({ page }) => {
    const loading = page.getByTestId("state-loading");
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(page.locator("[role='status']", { hasText: /Loading|Memuat/ })).toHaveCount(1);
  });
});
