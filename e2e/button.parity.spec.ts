import { expect, test } from "@playwright/test";

test("registry copy renders the same markup and computed styles as the package", async ({ page }) => {
  await page.goto("/preview/parity");
  const packageButtons = await page.locator("[data-slot='button']").evaluateAll((buttons) =>
    buttons.map((button) => {
      const style = getComputedStyle(button);
      return {
        variant: button.getAttribute("data-variant"),
        size: button.getAttribute("data-size"),
        className: button.className,
        backgroundColor: style.backgroundColor,
        color: style.color,
        minHeight: style.minHeight,
        busy: button.getAttribute("aria-busy"),
        disabled: button.hasAttribute("disabled"),
      };
    }),
  );

  await page.goto("http://localhost:3001");
  const copyButtons = await page.locator("[data-slot='button']").evaluateAll((buttons) =>
    buttons.map((button) => {
      const style = getComputedStyle(button);
      return {
        variant: button.getAttribute("data-variant"),
        size: button.getAttribute("data-size"),
        className: button.className,
        backgroundColor: style.backgroundColor,
        color: style.color,
        minHeight: style.minHeight,
        busy: button.getAttribute("aria-busy"),
        disabled: button.hasAttribute("disabled"),
      };
    }),
  );

  expect(copyButtons).toEqual(packageButtons);
});
