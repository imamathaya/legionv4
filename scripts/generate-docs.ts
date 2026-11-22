import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { withCustomConfig } from "react-docgen-typescript";
import { ROOT } from "./theme-utils.ts";

const packageJson = JSON.parse(readFileSync(resolve(ROOT, "packages/ui/package.json"), "utf8")) as {
  version: string;
};
const registryConfig = JSON.parse(readFileSync(resolve(ROOT, "registry.config.json"), "utf8")) as {
  baseUrl: string;
};
const localizedProps = JSON.parse(
  readFileSync(resolve(ROOT, "apps/docs/content/components/button.props.id.json"), "utf8"),
) as Record<string, string>;

const VARIANT_NAMES = ["default", "secondary", "destructive", "outline", "ghost"];
const SIZE_NAMES = ["sm", "default", "lg"];
const EXAMPLE_TITLES: Record<string, string> = {
  basic: "Basic",
  icon: "Icon only",
  link: "Link with asChild",
  loading: "Loading",
  variants: "All variants",
};

const docsLocales = {
  en: {
    route: "/docs/components/button",
    markdownUrl: "/docs/components/button.md",
    prosePath: "apps/docs/content/components/button.en.md",
    htmlLang: "en",
  },
  id: {
    route: "/id/docs/components/button",
    markdownUrl: "/id/docs/components/button.md",
    prosePath: "apps/docs/content/components/button.id.md",
    htmlLang: "id",
  },
} as const;

function extractProps() {
  const parser = withCustomConfig(resolve(ROOT, "packages/ui/tsconfig.json"), {
    savePropValueAsString: true,
    shouldExtractLiteralValuesFromEnum: true,
    propFilter: (prop) => {
      if (!prop.parent) return true;
      return !prop.parent.fileName.includes("node_modules");
    },
  });
  const components = parser.parse(resolve(ROOT, "packages/ui/src/components/ui/button.tsx"));
  const component = components.find((entry) => entry.displayName === "Button");
  if (!component) throw new Error("Button metadata could not be extracted");

  const defaults: Record<string, string> = { variant: "default", size: "default" };
  return Object.entries(component.props).map(([name, prop]) => {
    const en = prop.description?.trim() ?? "";
    const id = localizedProps[name]?.trim() ?? "";
    if (!en) throw new Error(`Missing English JSDoc for prop ${name}`);
    if (!id) throw new Error(`Missing Indonesian description for prop ${name}`);
    return {
      name,
      type: prop.type.raw ?? prop.type.name,
      required: prop.required,
      defaultValue: prop.defaultValue?.value ?? defaults[name] ?? null,
      descriptions: { en, id },
    };
  });
}

const props = extractProps();
const examples = readdirSync(resolve(ROOT, "apps/docs/examples/button"))
  .filter((file) => file.endsWith(".tsx"))
  .sort()
  .map((file) => {
    const name = file.replace(/\.tsx$/, "");
    return {
      title: EXAMPLE_TITLES[name] ?? name,
      codePath: `apps/docs/examples/button/${file}`,
    };
  });

const metadata = {
  schemaVersion: 1,
  name: "button",
  title: "Button",
  description: "A token-driven action control with five variants, three sizes, and six states.",
  version: packageJson.version,
  type: "registry:ui",
  files: ["packages/ui/src/components/ui/button.tsx", "packages/ui/src/lib/utils.ts"],
  dependencies: [
    "@radix-ui/react-slot",
    "class-variance-authority",
    "clsx",
    "lucide-react",
    "tailwind-merge",
  ],
  registryDependencies: [
    `${registryConfig.baseUrl}/r/theme.json`,
    `${registryConfig.baseUrl}/r/utils.json`,
  ],
  variants: VARIANT_NAMES,
  sizes: SIZE_NAMES,
  props,
  examples,
  a11y: {
    standard: "WCAG 2.2 AA",
    criteria: ["1.4.1", "1.4.3", "1.4.4", "1.4.10", "1.4.11", "2.4.7", "2.4.11", "2.5.7", "2.5.8", "3.3.2", "4.1.2", "4.1.3"],
    checklistPath: "packages/ui/src/components/ui/button.a11y.md",
    manualStatus: "not-run",
  },
  docs: {
    defaultLocale: "en",
    sourcePath: "packages/ui/src/components/ui/button.tsx",
    locales: docsLocales,
  },
};

const schemaPath = resolve(ROOT, "specs/001-fondasi-button/contracts/component-metadata.schema.json");
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(JSON.parse(readFileSync(schemaPath, "utf8")));
if (!validate(metadata)) {
  console.error(validate.errors);
  throw new Error("Generated component metadata does not match the contract schema");
}

const metadataDir = resolve(ROOT, "apps/docs/generated/metadata");
mkdirSync(metadataDir, { recursive: true });
writeFileSync(resolve(metadataDir, "button.json"), `${JSON.stringify(metadata, null, 2)}\n`);

const buttonSource = readFileSync(resolve(ROOT, "packages/ui/src/components/ui/button.tsx"), "utf8");
const basicExample = readFileSync(resolve(ROOT, "apps/docs/examples/button/basic.tsx"), "utf8");

function propsTable(locale: "en" | "id"): string {
  const header =
    locale === "en"
      ? "| Prop | Type | Default | Description |\n| --- | --- | --- | --- |"
      : "| Prop | Tipe | Default | Keterangan |\n| --- | --- | --- | --- |";
  const rows = props.map(
    (prop) =>
      `| \`${prop.name}\` | \`${prop.type}\` | ${prop.defaultValue === null ? "—" : `\`${prop.defaultValue}\``} | ${prop.descriptions[locale]} |`,
  );
  return [header, ...rows].join("\n");
}

function renderMarkdown(locale: "en" | "id"): string {
  const prose = readFileSync(resolve(ROOT, docsLocales[locale].prosePath), "utf8");
  return prose.replace(/\[\[(PREVIEW|EXAMPLES|PROPS|DEPENDENCIES|SOURCE)\]\]/g, (_match, token: string) => {
    switch (token) {
      case "PREVIEW":
        return `Variants: ${VARIANT_NAMES.join(", ")}. Sizes: ${SIZE_NAMES.join(", ")}. States: default, hover, focus, active, disabled, loading. Open the documentation site to see the live preview in light and dark mode.`;
      case "EXAMPLES":
        return `\`\`\`tsx\n${basicExample.trim()}\n\`\`\``;
      case "PROPS":
        return propsTable(locale);
      case "DEPENDENCIES":
        return metadata.dependencies.map((dependency) => `- \`${dependency}\``).join("\n");
      case "SOURCE":
        return `\`\`\`tsx\n${buttonSource.trim()}\n\`\`\``;
      default:
        return "";
    }
  });
}

for (const locale of ["en", "id"] as const) {
  const outputPath = resolve(ROOT, "apps/docs/public", docsLocales[locale].markdownUrl.replace(/^\//, ""));
  mkdirSync(resolve(outputPath, ".."), { recursive: true });
  writeFileSync(outputPath, `${renderMarkdown(locale)}\n`);
}

const llms = `# Legion v4

Design system documentation for AI agents and application developers.

## Components (English)

- [Button](/docs/components/button.md): A token-driven action control with five variants, three sizes, and six states.

## Komponen (Bahasa Indonesia)

- [Button](/id/docs/components/button.md): Kontrol aksi berbasis token dengan lima varian, tiga ukuran, dan enam state.

## Tokens

Token definitions live in \`packages/ui/src/styles/theme.css\`; every semantic color has light and dark values.

## Registry

- [Button registry item](${registryConfig.baseUrl}/r/button.json): install with \`npx shadcn@latest add ${registryConfig.baseUrl}/r/button.json\`.
`;

writeFileSync(resolve(ROOT, "llms.txt"), llms);
console.log("Generated docs metadata, bilingual markdown pages, and llms.txt.");
