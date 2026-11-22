import { expect, test } from "@playwright/test";

test("semantic tokens change the Button surface between light and dark", async ({ page }) => {
  await page.goto("/preview/button");
  const button = page.locator("[data-slot='button']").first();
  const light = await button.evaluate((element) => getComputedStyle(element).backgroundColor);

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const dark = await button.evaluate((element) => getComputedStyle(element).backgroundColor);

  expect(light).not.toBe(dark);
  expect(light.length).toBeGreaterThan(0);
  expect(dark.length).toBeGreaterThan(0);
});
