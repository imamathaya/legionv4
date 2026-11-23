import { expect, test } from "@playwright/test";

test("semantic tokens change the Button surface between light and dark", async ({ page }) => {
  await page.goto("/preview/button");
  const button = page.getByTestId("state-default");
  const light = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, color: style.color };
  });

  await page.evaluate(() => document.documentElement.classList.add("dark"));
  const dark = await button.evaluate((element) => {
    const style = getComputedStyle(element);
    return { background: style.backgroundColor, color: style.color };
  });

  expect(light.background).not.toBe(dark.background);
  expect(light.color).not.toBe(dark.color);
  expect(await button.getAttribute("data-variant")).toBe("default");
});

test("the root theme switch changes mode without a component override", async ({ page }) => {
  await page.goto("/preview/button");
  const toggle = page.getByTestId("mode-toggle");
  await expect(toggle).toBeVisible();
  const before = await page.locator("html").getAttribute("class");
  await toggle.click();
  await expect.poll(async () => page.locator("html").getAttribute("class")).not.toBe(before);
  await expect(page.getByTestId("state-default")).toBeVisible();
});
