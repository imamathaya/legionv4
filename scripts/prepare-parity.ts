import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "./theme-utils.ts";

type RegistryItem = {
  files: Array<{ type: string; content?: string }>;
};

function readItem(name: string): RegistryItem {
  return JSON.parse(readFileSync(resolve(ROOT, "apps/docs/public/r", `${name}.json`), "utf8")) as RegistryItem;
}

const fixtureRoot = resolve(ROOT, "packages/ui/test-fixture");
mkdirSync(resolve(fixtureRoot, "components/ui"), { recursive: true });
mkdirSync(resolve(fixtureRoot, "lib"), { recursive: true });

const button = readItem("button").files.find((file) => file.type === "registry:ui");
const utils = readItem("utils").files.find((file) => file.type === "registry:lib");
if (!button?.content || !utils?.content) throw new Error("Registry copy content is missing");

writeFileSync(resolve(fixtureRoot, "components/ui/button.tsx"), button.content);
writeFileSync(resolve(fixtureRoot, "lib/utils.ts"), utils.content);
console.log("Prepared registry copy fixture for parity tests.");
