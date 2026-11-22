import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { ROOT, RADIUS_STEPS, SEMANTIC_COLORS } from "./theme-utils.ts";

const packageJson = JSON.parse(readFileSync(resolve(ROOT, "packages/ui/package.json"), "utf8")) as {
  version: string;
};
const config = JSON.parse(readFileSync(resolve(ROOT, "registry.config.json"), "utf8")) as { baseUrl: string };
const sourceRegistry = JSON.parse(readFileSync(resolve(ROOT, "registry.json"), "utf8")) as {
  items: Array<Record<string, unknown> & { name: string; files?: Array<Record<string, string>> }>;
};

const css = readFileSync(resolve(ROOT, "packages/ui/src/styles/theme.css"), "utf8");
const light: Record<string, string> = {};
const dark: Record<string, string> = {};
const theme: Record<string, string> = {};

postcss.parse(css).walk((node) => {
  if (node.type === "rule" && (node.selector === ":root" || node.selector === ".dark")) {
    const target = node.selector === ":root" ? light : dark;
    node.walkDecls((decl) => {
      if (decl.prop === "--radius" || SEMANTIC_COLORS.includes(decl.prop.replace("--", "") as never)) {
        target[decl.prop.replace("--", "")] = decl.value.trim();
      }
    });
  }
  if (node.type === "atrule" && node.name === "theme") {
    node.walkDecls((decl) => {
      if (decl.prop.startsWith("--color-") || decl.prop.startsWith("--radius-")) {
        theme[decl.prop.replace("--", "")] = decl.value.trim();
      }
    });
  }
});

const sidecar = {
  item: "button",
  version: packageJson.version,
  source: `${config.baseUrl}/r/button.json`,
  documentation: {
    en: `${config.baseUrl}/docs/components/button`,
    id: `${config.baseUrl}/id/docs/components/button`,
  },
};
const sidecarPath = resolve(ROOT, "packages/ui/registry/button.legion.json");
mkdirSync(resolve(sidecarPath, ".."), { recursive: true });
writeFileSync(sidecarPath, `${JSON.stringify(sidecar, null, 2)}\n`);

const generated = structuredClone(sourceRegistry);
for (const item of generated.items) {
  if (item.name === "theme") {
    item.cssVars = { light, dark, theme };
  }
  if (item.name === "button") {
    item.meta = {
      legion: {
        version: packageJson.version,
        source: sidecar.source,
        docs: sidecar.documentation,
      },
    };
  }
}

const generatedRegistryPath = resolve(ROOT, "registry.generated.json");
writeFileSync(generatedRegistryPath, `${JSON.stringify(generated, null, 2)}\n`);

const outputDir = resolve(ROOT, "apps/docs/public/r");
execFileSync(resolve(ROOT, "node_modules/.bin/shadcn"), ["build", generatedRegistryPath, "--output", outputDir], {
  cwd: ROOT,
  stdio: "inherit",
});

for (const file of readdirSync(outputDir)) {
  if (!file.endsWith(".json")) continue;
  const path = resolve(outputDir, file);
  const item = JSON.parse(readFileSync(path, "utf8")) as {
    name: string;
    meta?: Record<string, unknown>;
    files?: Array<{ path: string; type: string; target?: string; content?: string }>;
  };
  if (item.name === "button") {
    const generatedMeta = generated.items.find((entry) => entry.name === "button")?.meta as
      | { legion?: Record<string, unknown> }
      | undefined;
    item.meta = { ...(item.meta ?? {}), legion: generatedMeta?.legion };
    const files = item.files ?? [];
    if (!files.some((entry) => entry.target === "@ui/button.legion.json")) {
      files.push({
        path: "packages/ui/registry/button.legion.json",
        type: "registry:file",
        target: "@ui/button.legion.json",
        content: readFileSync(sidecarPath, "utf8"),
      });
    }
    item.files = files;
    writeFileSync(path, `${JSON.stringify(item, null, 2)}\n`);
  }
}

console.log(`Registry built at ${outputDir} with version ${packageJson.version}.`);
