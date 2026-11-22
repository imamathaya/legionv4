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
    const markdown = await request.get(path);
    expect(markdown.ok()).toBeTruthy();
    const text = await markdown.text();
    expect(text).toMatch(/## Props/);
    expect(text).toMatch(/## (?:Dependencies|Dependensi)/);
    expect(text).toMatch(/## (?:Accessibility checklist|Daftar periksa aksesibilitas)/);
  }
});

test("registry item carries the sidecar and generated metadata", async ({ request }) => {
  const item = await request.get("/r/button.json");
  expect(item.ok()).toBeTruthy();
  const json = (await item.json()) as {
    meta?: { legion?: { version?: string } };
    files?: Array<{ target?: string; content?: string }>;
  };
  expect(json.meta?.legion?.version).toBe("0.1.0");
  const sidecar = json.files?.find((file) => file.target === "@ui/button.legion.json");
  expect(sidecar?.content).toContain('"version": "0.1.0"');
  expect(sidecar?.content).toContain("/docs/components/button");
  expect(sidecar?.content).toContain("/id/docs/components/button");
});

test("metadata props and dependencies match the published component", async ({ request }) => {
  const metadata = (await (await request.get("/r/button.json")).json()) as {
    dependencies?: string[];
    files?: Array<{ path?: string; content?: string }>;
  };
  for (const dependency of metadata.dependencies ?? []) {
    expect(typeof dependency).toBe("string");
  }
  const component = metadata.files?.find((file) => file.path?.endsWith("button.tsx"));
  expect(component?.content).toContain("export const Button");
  expect(component?.content).toContain("loadingLabel");
});
