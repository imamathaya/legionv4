import { expect, test } from "@playwright/test";

const REQUIRED = {
  en: [
    "Preview and variants",
    "Install as a package",
    "Install as a copy",
    "Usage",
    "Props",
    "Dependencies",
    "Accessibility",
  ],
  id: [
    "Pratinjau dan varian",
    "Pasang sebagai paket",
    "Pasang sebagai salinan",
    "Pemakaian",
    "Props",
    "Dependensi",
    "Aksesibilitas",
  ],
};

test("English documentation has all seven sections, correct lang, and hreflang links", async ({ page }) => {
  await page.goto("/docs/components/button");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const headings = await page.locator("main h2").allTextContents();
  for (const heading of REQUIRED.en) expect(headings).toContain(heading);
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
    "href",
    "/docs/components/button",
  );
  await expect(page.locator('link[rel="alternate"][hreflang="id"]')).toHaveAttribute(
    "href",
    "/id/docs/components/button",
  );
  await expect(page.getByTestId("language-switch")).toHaveAttribute(
    "href",
    "/id/docs/components/button",
  );
  await expect(page.getByTestId("language-switch")).toHaveAttribute("hreflang", "id");
});

test("Indonesian documentation is translated and links back to English", async ({ page }) => {
  await page.goto("/id/docs/components/button");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  const headings = await page.locator("main h2").allTextContents();
  for (const heading of REQUIRED.id) expect(headings).toContain(heading);
  await expect(page.getByText("Gaya visual tombol.")).toBeVisible();
  await expect(page.getByText("Kelas tambahan yang digabungkan setelah kelas varian.")).toBeVisible();
  await expect(page.getByTestId("language-switch")).toHaveAttribute("href", "/docs/components/button");
  await page.getByTestId("language-switch").click();
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("switching language preserves the selected theme", async ({ page }) => {
  await page.goto("/docs/components/button");
  const toggle = page.getByTestId("mode-toggle");
  await expect(toggle).toBeVisible();
  if ((await page.locator("html").getAttribute("class"))?.includes("dark") !== true) {
    await toggle.click();
  }
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByTestId("language-switch").click();
  await expect(page).toHaveURL(/\/id\/docs\/components\/button$/);
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("mode toggle changes the root class and previews follow it", async ({ page }) => {
  await page.goto("/docs/components/button");
  const html = page.locator("html");
  const before = await html.getAttribute("class");
  await page.getByTestId("mode-toggle").click();
  await expect.poll(async () => html.getAttribute("class")).not.toBe(before);
  const button = page.getByTestId("state-default");
  await expect(button).toBeVisible();
  expect(await button.getAttribute("data-variant")).toBe("default");
});
