import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type RegistryItem = { files?: { path: string; target?: string; content?: string }[] };

const ROOT = process.cwd();
const fixture = resolve(ROOT, "fixtures/copy-consumer");
const buttonItem = JSON.parse(
  readFileSync(resolve(ROOT, "apps/docs/public/r/button.json"), "utf8"),
) as RegistryItem;
const utilsItem = JSON.parse(
  readFileSync(resolve(ROOT, "apps/docs/public/r/utils.json"), "utf8"),
) as RegistryItem;

const buttonFile = buttonItem.files?.find((file) => file.path.endsWith("button.tsx"));
const sidecarFile = buttonItem.files?.find((file) => file.target === "@ui/button.legion.json");
const utilsFile = utilsItem.files?.[0];
if (!buttonFile?.content || !sidecarFile?.content || !utilsFile?.content) {
  throw new Error("registry output is missing button, sidecar, or utils content");
}

const generated: [string, string][] = [
  ["components/ui/button.tsx", buttonFile.content],
  ["components/ui/button.legion.json", sidecarFile.content],
  ["lib/utils.ts", utilsFile.content],
];

for (const [path, content] of generated) {
  const target = resolve(fixture, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

const theme = readFileSync(resolve(ROOT, "packages/ui/src/styles/theme.css"), "utf8");
writeFileSync(
  resolve(fixture, "app/globals.css"),
  `${theme}\n@source "../components";\n\nbody {\n  background-color: var(--background);\n  color: var(--foreground);\n}\n`,
);

console.log("prepare:copy-fixture installed the registry button, sidecar, utils, and theme.");
