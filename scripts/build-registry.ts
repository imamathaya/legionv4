import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import postcss from "postcss";

type RegistryFile = {
  path: string;
  type: string;
  target?: string;
  content?: string;
};

type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
  cssVars?: { light: Record<string, string>; dark: Record<string, string>; theme: Record<string, string> };
  meta?: { legion?: Record<string, unknown> };
  $schema?: string;
};

type RegistryManifest = {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
};

const ROOT = process.cwd();
const manifestPath = resolve(ROOT, "registry.json");
const outputDirectory = resolve(ROOT, "apps/docs/public/r");
const sidecarPath = resolve(ROOT, "packages/ui/registry/button.legion.json");
const packageJson = JSON.parse(
  readFileSync(resolve(ROOT, "packages/ui/package.json"), "utf8"),
) as { version: string };
const config = JSON.parse(readFileSync(resolve(ROOT, "registry.config.json"), "utf8")) as {
  baseUrl: string;
  repository: string;
  docs: { en: string; id: string };
};

const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as RegistryManifest;

function cssVars(): NonNullable<RegistryItem["cssVars"]> {
  const stylesheet = postcss.parse(
    readFileSync(resolve(ROOT, "packages/ui/src/styles/theme.css"), "utf8"),
  );
  const result = { light: {} as Record<string, string>, dark: {} as Record<string, string>, theme: {} as Record<string, string> };

  stylesheet.walkRules((rule) => {
    const selector = rule.selector.trim();
    if (selector !== ":root" && selector !== ".dark") return;
    const target = selector === ":root" ? result.light : result.dark;
    rule.walkDecls((declaration) => {
      target[declaration.prop] = declaration.value.trim();
    });
  });

  stylesheet.walkAtRules("theme", (atRule) => {
    if (atRule.params.trim() !== "inline") return;
    atRule.walkDecls((declaration) => {
      result.theme[declaration.prop] = declaration.value.trim();
    });
  });

  return result;
}

const docs = {
  en: `${config.baseUrl}${config.docs.en}/button`,
  id: `${config.baseUrl}${config.docs.id}/button`,
};

const sidecar = {
  item: "button",
  version: packageJson.version,
  source: `${config.baseUrl}/r/button.json`,
  documentation: docs,
};

mkdirSync(dirname(sidecarPath), { recursive: true });
writeFileSync(sidecarPath, `${JSON.stringify(sidecar, null, 2)}\n`);

const items: RegistryItem[] = manifest.items.map((item) => {
  const built: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    files: (item.files ?? []).map((file) => ({
      ...file,
      content: readFileSync(resolve(ROOT, file.path), "utf8"),
    })),
  };

  if (item.name === "theme") built.cssVars = cssVars();
  if (item.name === "button") {
    built.meta = {
      legion: {
        version: packageJson.version,
        repository: config.repository,
        docs,
      },
    };
  }
  return built;
});

mkdirSync(outputDirectory, { recursive: true });
for (const item of items) {
  writeFileSync(resolve(outputDirectory, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
}
writeFileSync(
  resolve(outputDirectory, "registry.json"),
  `${JSON.stringify({ ...manifest, items }, null, 2)}\n`,
);

console.log(
  `build:registry wrote ${items.length} items (theme, utils, button) for version ${packageJson.version}.`,
);
