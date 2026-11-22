import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/docs/components/button", "/id/docs/components/button"]) {
  test(`axe finds no violations on ${path} in light and dark`, async ({ page }) => {
    await page.goto(path);
    for (const theme of ["light", "dark"] as const) {
      await page.evaluate(
        (value) => document.documentElement.classList.toggle("dark", value === "dark"),
        theme,
      );
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    }
  });
}
