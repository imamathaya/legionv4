import { expect, test } from "@playwright/test";

const required = {
  en: ["Preview and variants", "Install as package", "Install as copy", "Usage", "Props", "Dependencies", "Accessibility"],
  id: ["Pratinjau dan varian", "Pasang sebagai paket", "Pasang sebagai salinan", "Pemakaian", "Props", "Dependensi", "Aksesibilitas"],
};

test("English documentation has all required sections and a language switch", async ({ page }) => {
  await page.goto("/docs/components/button");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  const headings = await page.locator("article h2").allTextContents();
  for (const heading of required.en) expect(headings).toContain(heading);
  await expect(page.getByRole("link", { name: "Bahasa Indonesia" })).toHaveAttribute(
    "href",
    "/id/docs/components/button",
  );
  await expect(page.getByRole("link", { name: "Bahasa Indonesia" })).toHaveAttribute("hreflang", "id");
});

test("Indonesian documentation is translated and the language switch returns to English", async ({ page }) => {
  await page.goto("/id/docs/components/button");
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  const headings = await page.locator("article h2").allTextContents();
  for (const heading of required.id) expect(headings).toContain(heading);
  await expect(page.getByText("Gaya visual tombol.")).toBeVisible();
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/docs\/components\/button$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("mode toggle changes the root class without changing component code", async ({ page }) => {
  await page.goto("/docs/components/button");
  await expect(page.locator("html")).toHaveAttribute("class", /light|dark/);
  await page.waitForTimeout(3000);
  const toggle = page.getByRole("button", { name: /Toggle theme/ });
  const before = await page.locator("html").getAttribute("class");
  await toggle.click();
  await expect.poll(async () => page.locator("html").getAttribute("class"), { timeout: 10_000 }).not.toBe(before);
});
