import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./theme-utils.ts";

type RegistryItem = {
  files: Array<{ type: string; content?: string }>;
  cssVars?: { light: Record<string, string>; dark: Record<string, string>; theme: Record<string, string> };
};

function readItem(name: string): RegistryItem {
  return JSON.parse(readFileSync(resolve(ROOT, "apps/docs/public/r", `${name}.json`), "utf8")) as RegistryItem;
}

const button = readItem("button").files.find((file) => file.type === "registry:ui");
const utils = readItem("utils").files.find((file) => file.type === "registry:lib");
const theme = readItem("theme").cssVars;
if (!button?.content || !utils?.content || !theme) throw new Error("Registry content is incomplete");

const fixture = resolve(ROOT, "fixtures/copy-consumer");
mkdirSync(resolve(fixture, "components/ui"), { recursive: true });
mkdirSync(resolve(fixture, "lib"), { recursive: true });
writeFileSync(resolve(fixture, "components/ui/button.tsx"), button.content);
writeFileSync(resolve(fixture, "lib/utils.ts"), utils.content);

const declarations = (values: Record<string, string>, indent: string) =>
  Object.entries(values)
    .map(([name, value]) => `${indent}--${name}: ${value};`)
    .join("\n");

writeFileSync(
  resolve(fixture, "app/globals.css"),
  `@import "tailwindcss";
@source "../components";
@custom-variant dark (&:is(.dark *));

@theme inline {
${declarations(theme.theme, "  ")}
}

:root {
${declarations(theme.light, "  ")}
}

.dark {
${declarations(theme.dark, "  ")}
}
`,
);

console.log("Prepared copy-consumer fixture from the built registry.");
