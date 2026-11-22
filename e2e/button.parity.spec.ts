import { expect, test } from "@playwright/test";

test("copy item renders the same markup and computed styles as the package", async ({ page }) => {
  await page.goto("http://localhost:3001");

  const snapshot = async (source: string) =>
    page.locator(`[data-source="${source}"] [data-slot="button"]`).evaluateAll((buttons) =>
      buttons.map((button) => {
        const style = getComputedStyle(button);
        return {
          html: button.outerHTML,
          backgroundColor: style.backgroundColor,
          color: style.color,
          minHeight: style.minHeight,
          fontSize: style.fontSize,
          outlineColor: style.outlineColor,
        };
      }),
    );

  const packaged = await snapshot("package");
  const copied = await snapshot("copy");
  expect(packaged.length).toBeGreaterThan(0);
  expect(copied).toEqual(packaged);
});

test("copy item keeps loading and disabled behavior", async ({ page }) => {
  await page.goto("http://localhost:3001");
  for (const source of ["package", "copy"]) {
    const section = page.locator(`[data-source="${source}"]`);
    const loading = section.getByTestId("loading");
    await expect(loading).toHaveAttribute("aria-busy", "true");
    await expect(loading).toBeDisabled();
    await expect(section.getByTestId("disabled")).toBeDisabled();
    await expect(section.getByTestId("link")).toHaveAttribute("href", "#copy");
  }
});
