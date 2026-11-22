import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { ROOT } from "./theme-utils.ts";

const packageJson = JSON.parse(readFileSync(resolve(ROOT, "packages/ui/package.json"), "utf8")) as {
  version: string;
};
const sidecar = JSON.parse(readFileSync(resolve(ROOT, "packages/ui/registry/button.legion.json"), "utf8")) as {
  item: string;
  version: string;
  source: string;
  documentation: Record<string, string>;
};
const button = JSON.parse(readFileSync(resolve(ROOT, "apps/docs/public/r/button.json"), "utf8")) as {
  name: string;
  files: Array<{ path: string; type: string; target?: string; content?: string }>;
  meta?: { legion?: { version?: string; docs?: Record<string, string> } };
};
const metadata = JSON.parse(readFileSync(resolve(ROOT, "apps/docs/generated/metadata/button.json"), "utf8")) as {
  dependencies: string[];
  version: string;
};

const errors: string[] = [];
if (button.name !== "button") errors.push("Registry item name must be button");
if (button.meta?.legion?.version !== packageJson.version) errors.push("Registry meta version must match package.json");
if (sidecar.version !== packageJson.version) errors.push("Sidecar version must match package.json");
if (metadata.version !== packageJson.version) errors.push("Metadata version must match package.json");
if (sidecar.item !== "button") errors.push("Sidecar item must be button");
if (!sidecar.documentation.en || !sidecar.documentation.id) errors.push("Sidecar must contain en/id documentation URLs");
if (button.meta?.legion?.docs?.en !== sidecar.documentation.en) errors.push("Registry docs.en must match sidecar");
if (button.meta?.legion?.docs?.id !== sidecar.documentation.id) errors.push("Registry docs.id must match sidecar");
if (JSON.stringify(metadata.dependencies) !== JSON.stringify(button.dependencies ?? metadata.dependencies)) {
  // The item carries dependencies; metadata must agree with the item.
  const item = JSON.parse(readFileSync(resolve(ROOT, "apps/docs/public/r/button.json"), "utf8")) as { dependencies?: string[] };
  if (JSON.stringify(metadata.dependencies) !== JSON.stringify(item.dependencies)) {
    errors.push("Metadata dependencies must match the registry item");
  }
}

for (const file of button.files) {
  if (file.type === "registry:file") {
    if (file.target !== "@ui/button.legion.json") errors.push("Sidecar target must be @ui/button.legion.json");
    continue;
  }
  const sourcePath = resolve(ROOT, file.path);
  const source = readFileSync(sourcePath, "utf8");
  if (file.content !== source) errors.push(`Registry file ${file.path} is not byte-identical to its source`);
}

function countButtonSources(directory: string): number {
  return readdirSync(directory).reduce((count, name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return count + countButtonSources(path);
    return count + (name === "button.tsx" ? 1 : 0);
  }, 0);
}
const sourceCount = countButtonSources(resolve(ROOT, "packages/ui/src"));
if (sourceCount !== 1) errors.push(`Expected exactly one button source, found ${sourceCount}`);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Registry identity check passed for ${relative(ROOT, resolve(ROOT, "apps/docs/public/r/button.json"))}.`);
