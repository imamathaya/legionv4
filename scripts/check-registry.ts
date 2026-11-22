import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import ts from "typescript";

type RegistryFile = { path: string; type: string; target?: string; content?: string };
type RegistryItem = {
  name: string;
  type: string;
  dependencies?: string[];
  files?: RegistryFile[];
  cssVars?: { light: Record<string, string>; dark: Record<string, string>; theme: Record<string, string> };
  meta?: { legion?: { version?: string; docs?: { en?: string; id?: string } } };
};

const ROOT = process.cwd();
const packageVersion = (
  JSON.parse(readFileSync(resolve(ROOT, "packages/ui/package.json"), "utf8")) as { version: string }
).version;
const manifest = JSON.parse(readFileSync(resolve(ROOT, "registry.json"), "utf8")) as {
  items: RegistryItem[];
};
const failures: string[] = [];

function outputFor(name: string): RegistryItem {
  const path = resolve(ROOT, `apps/docs/public/r/${name}.json`);
  if (!existsSync(path)) {
    failures.push(`missing generated registry item ${name}.json`);
    return { name, type: "" };
  }
  return JSON.parse(readFileSync(path, "utf8")) as RegistryItem;
}

function runtimeImports(path: string): string[] {
  const source = ts.createSourceFile(
    resolve(ROOT, path),
    readFileSync(resolve(ROOT, path), "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const packages = new Set<string>();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier;
    if (!ts.isStringLiteral(specifier) || specifier.text.startsWith(".")) continue;
    const parts = specifier.text.split("/");
    const name = specifier.text.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? "");
    if (name === "react" || name === "react-dom") continue;
    packages.add(name);
  }
  return [...packages].sort();
}

function readItem(name: string): RegistryItem {
  const item = outputFor(name);
  const sourceItem = manifest.items.find((candidate) => candidate.name === name);
  if (!sourceItem) failures.push(`manifest is missing item ${name}`);
  if (item.name !== name) failures.push(`generated ${name}.json has name ${item.name}`);
  if (sourceItem && item.type !== sourceItem.type) {
    failures.push(`${name}: expected type ${sourceItem.type}, got ${item.type}`);
  }
  return item;
}

for (const name of ["theme", "utils", "button"]) {
  const item = readItem(name);

  for (const file of item.files ?? []) {
    if (file.type === "registry:file") continue;
    const sourcePath = resolve(ROOT, file.path);
    if (!existsSync(sourcePath)) {
      failures.push(`${name}: source file ${file.path} is missing`);
      continue;
    }
    if (file.content !== readFileSync(sourcePath, "utf8")) {
      failures.push(`${name}: registry content for ${file.path} differs from source bytes`);
    }
  }

  const sourceFiles = (manifest.items.find((candidate) => candidate.name === name)?.files ?? [])
    .filter((file) => file.type !== "registry:file")
    .map((file) => file.path);
  const expectedImports = sourceFiles.flatMap(runtimeImports);
  const declared = [...(item.dependencies ?? [])].sort();
  const uniqueExpected = [...new Set(expectedImports)].sort();
  if (JSON.stringify(declared) !== JSON.stringify(uniqueExpected)) {
    failures.push(
      `${name}: dependencies [${declared.join(", ")}] do not match imports [${uniqueExpected.join(", ")}]`,
    );
  }
}

const theme = readItem("theme");
const themeLight = Object.keys(theme.cssVars?.light ?? {});
const themeDark = Object.keys(theme.cssVars?.dark ?? {});
const expectedTokenCount = 20;
if (themeLight.length !== expectedTokenCount || themeDark.length !== expectedTokenCount) {
  failures.push(`theme: expected ${expectedTokenCount} light and dark tokens, got ${themeLight.length}/${themeDark.length}`);
}
if (JSON.stringify(themeLight) !== JSON.stringify(themeDark)) {
  failures.push("theme: light and dark token lists differ");
}
if (Object.keys(theme.cssVars?.theme ?? {}).length !== 26) {
  failures.push("theme: expected 19 colour mappings and 7 radius mappings in theme");
}

const button = readItem("button");
if (button.meta?.legion?.version !== packageVersion) {
  failures.push(`button: meta.legion.version ${button.meta?.legion?.version} != ${packageVersion}`);
}

const sidecarFile = (button.files ?? []).find((file) => file.target === "@ui/button.legion.json");
if (!sidecarFile?.content) {
  failures.push("button: sidecar @ui/button.legion.json is missing");
} else {
  const sidecar = JSON.parse(sidecarFile.content) as {
    item?: string;
    version?: string;
    source?: string;
    documentation?: { en?: string; id?: string };
  };
  if (sidecar.item !== "button") failures.push("sidecar: item must be button");
  if (sidecar.version !== packageVersion) failures.push("sidecar: version does not match package.json");
  if (!sidecar.source?.startsWith("http")) failures.push("sidecar: source URL is missing");
  if (!sidecar.documentation?.en || !sidecar.documentation?.id) {
    failures.push("sidecar: both documentation URLs are required");
  }
  const metaDocs = button.meta?.legion?.docs;
  if (sidecar.documentation?.en !== metaDocs?.en || sidecar.documentation?.id !== metaDocs?.id) {
    failures.push("sidecar: documentation URLs differ from meta.legion.docs");
  }
}

const tracked = execSync("git ls-files -z", { cwd: ROOT, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const componentCopies = tracked.filter(
  (path) => basename(path) === "button.tsx" && !path.includes("node_modules"),
);
if (componentCopies.length !== 1 || componentCopies[0] !== "packages/ui/src/components/ui/button.tsx") {
  failures.push(`expected exactly one button source, found: ${componentCopies.join(", ")}`);
}

if (failures.length > 0) {
  console.error(`check:registry failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `check:registry passed: 3 items, byte-identical sources, version ${packageVersion}, sidecar docs en/id.`,
);
