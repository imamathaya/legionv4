import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

type RegistryItem = { files?: { path: string; content?: string }[] };
type Sidecar = { version?: string };

const ROOT = process.cwd();
const generated = resolve(ROOT, "packages/ui/test/generated");

const buttonItem = JSON.parse(
  readFileSync(resolve(ROOT, "apps/docs/public/r/button.json"), "utf8"),
) as RegistryItem;
const utilsItem = JSON.parse(
  readFileSync(resolve(ROOT, "apps/docs/public/r/utils.json"), "utf8"),
) as RegistryItem;

const buttonFile = buttonItem.files?.find((file) => file.path.endsWith("button.tsx"));
const utilsFile = utilsItem.files?.[0];
if (!buttonFile?.content || !utilsFile?.content) {
  throw new Error("registry output is missing button or utils content");
}

for (const [path, content] of [
  ["components/ui/button.tsx", buttonFile.content],
  ["lib/utils.ts", utilsFile.content],
] as const) {
  const target = resolve(generated, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
}

const sidecar = JSON.parse(readFileSync(resolve(ROOT, "packages/ui/registry/button.legion.json"), "utf8")) as Sidecar;
if (!sidecar.version) throw new Error("sidecar has no version");

console.log(`prepare:parity materialized the copy item at packages/ui/test/generated.`);
