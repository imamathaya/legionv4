import { expect, test } from "@playwright/test";

test("llms.txt indexes both languages and its markdown links resolve", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("## Components (English)");
  expect(body).toContain("## Komponen (Bahasa Indonesia)");
  expect(body).toContain("/docs/components/button.md");
  expect(body).toContain("/id/docs/components/button.md");

  for (const path of ["/docs/components/button.md", "/id/docs/components/button.md"]) {
    const page = await request.get(path);
    expect(page.ok()).toBeTruthy();
    expect(await page.text()).toContain("## Props");
  }
});

test("registry item is available with its sidecar", async ({ request }) => {
  const item = await request.get("/r/button.json");
  expect(item.ok()).toBeTruthy();
  const json = (await item.json()) as { meta?: { legion?: { version?: string } }; files?: Array<{ target?: string }> };
  expect(json.meta?.legion?.version).toBe("0.1.0");
  expect(json.files?.some((file) => file.target === "@ui/button.legion.json")).toBe(true);
});
