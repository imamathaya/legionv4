import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { withCompilerOptions } from "react-docgen-typescript";

type RegistryFile = { path: string; type: string; target?: string };
type RegistryItem = {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
};
type RegistryManifest = { items: RegistryItem[] };
type ExampleManifest = {
  examples: { file: string; title: string; description: string }[];
};

const ROOT = process.cwd();
const SLUG = "button";
const SOURCE = `packages/ui/src/components/ui/${SLUG}.tsx`;
const packageVersion = (
  JSON.parse(readFileSync(resolve(ROOT, "packages/ui/package.json"), "utf8")) as { version: string }
).version;
const config = JSON.parse(readFileSync(resolve(ROOT, "registry.config.json"), "utf8")) as {
  baseUrl: string;
  repository: string;
  docs: { en: string; id: string };
};
const manifest = JSON.parse(readFileSync(resolve(ROOT, "registry.json"), "utf8")) as RegistryManifest;
const item = manifest.items.find((candidate) => candidate.name === SLUG);
if (!item) throw new Error(`registry.json has no item named ${SLUG}`);

const exampleManifest = JSON.parse(
  readFileSync(resolve(ROOT, `apps/docs/examples/${SLUG}/manifest.json`), "utf8"),
) as ExampleManifest;
const overlay = JSON.parse(
  readFileSync(resolve(ROOT, `apps/docs/content/components/${SLUG}.props.id.json`), "utf8"),
) as Record<string, string>;

const PUBLIC_PROPS = ["variant", "size", "asChild", "loading", "loadingLabel", "className"] as const;

const parser = withCompilerOptions(
  { strict: true, jsx: 4, esModuleInterop: true, moduleResolution: 2 },
  { savePropValueAsString: true, shouldExtractLiteralValuesFromEnum: true },
);
const docs = parser.parse(resolve(ROOT, SOURCE));
const component = docs.find((candidate) => candidate.displayName === "Button");
const variantsEntry = docs.find((candidate) => candidate.displayName === "buttonVariants");
if (!component) throw new Error(`docgen did not find Button in ${SOURCE}`);
if (!variantsEntry) throw new Error("docgen did not find buttonVariants");

function unionValues(raw: string | undefined): string[] {
  if (!raw) return [];
  return [...raw.matchAll(/"([^"]+)"/g)]
    .map((match) => match[1] ?? "")
    .filter((value) => value !== "null" && value !== "undefined");
}

const variants = unionValues(variantsEntry.props.variant?.type?.raw ?? variantsEntry.props.variant?.type?.name);
const sizes = unionValues(variantsEntry.props.size?.type?.raw ?? variantsEntry.props.size?.type?.name);
if (variants.length !== 5) throw new Error(`expected 5 variants from source, found ${variants.length}`);
if (sizes.length !== 3) throw new Error(`expected 3 sizes from source, found ${sizes.length}`);

function cleanType(propName: string, name: string | undefined, raw: string | undefined): string {
  if (propName === "variant") return variants.map((value) => `"${value}"`).join(" | ");
  if (propName === "size") return sizes.map((value) => `"${value}"`).join(" | ");
  const source = name === "enum" && raw ? raw : (name ?? raw ?? "unknown");
  return source.replace(/ \| undefined$/, "").replace(/undefined \| /, "");
}

const props = PUBLIC_PROPS.map((name) => {
  const prop = component.props[name];
  if (!prop) throw new Error(`missing public prop ${name} in ${SOURCE}`);
  const english = prop.description.trim();
  const indonesian = overlay[name]?.trim();
  if (!english) throw new Error(`prop ${name} has no English JSDoc`);
  if (!indonesian) throw new Error(`prop ${name} has no Indonesian description`);
  const defaultValue = prop.defaultValue?.value ?? null;
  return {
    name,
    type: cleanType(name, prop.type?.name, prop.type?.raw),
    required: prop.required,
    defaultValue:
      name === "loadingLabel" && defaultValue ? JSON.stringify(defaultValue) : defaultValue,
    descriptions: { en: english, id: indonesian },
  };
});

const checklist = readFileSync(resolve(ROOT, `packages/ui/src/components/ui/${SLUG}.a11y.md`), "utf8");
const criteriaRows = [...checklist.matchAll(/^\|\s*(\d+\.\d+\.\d+)\s*\|(.*)\|\s*(pass|fail|not-run)\s*\|(.*)\|$/gm)];
if (criteriaRows.length === 0) throw new Error("a11y checklist has no parsed criteria");
const criteria = [...new Set(criteriaRows.map((row) => row[1] ?? ""))];
const results = criteriaRows.map((row) => row[3]);
const manualStatus = results.includes("fail")
  ? "fail"
  : results.includes("not-run")
    ? "not-run"
    : "pass";

const examples = exampleManifest.examples.map((example) => {
  const codePath = `apps/docs/examples/${SLUG}/${example.file}`;
  readFileSync(resolve(ROOT, codePath), "utf8");
  return { title: example.title, description: example.description, codePath };
});

const metadata = {
  schemaVersion: 1,
  name: SLUG,
  title: item.title,
  description: item.description,
  version: packageVersion,
  type: "registry:ui",
  files: (item.files ?? []).map((file) => file.path),
  dependencies: item.dependencies ?? [],
  registryDependencies: item.registryDependencies ?? [],
  variants,
  sizes,
  props,
  examples,
  a11y: {
    standard: "WCAG 2.2 AA",
    criteria,
    notes: "Automated axe, contrast, keyboard, zoom, and reduced-motion checks pass; manual evidence is recorded in the checklist.",
    checklistPath: `packages/ui/src/components/ui/${SLUG}.a11y.md`,
    manualStatus,
  },
  docs: {
    defaultLocale: "en",
    sourcePath: SOURCE,
    locales: {
      en: {
        route: config.docs.en + `/${SLUG}`,
        markdownUrl: config.docs.en + `/${SLUG}.md`,
        prosePath: `apps/docs/content/components/${SLUG}.en.md`,
        htmlLang: "en",
      },
      id: {
        route: config.docs.id + `/${SLUG}`,
        markdownUrl: config.docs.id + `/${SLUG}.md`,
        prosePath: `apps/docs/content/components/${SLUG}.id.md`,
        htmlLang: "id",
      },
    },
  },
};

const SECTION_HEADINGS = {
  en: {
    props: "Props (generated)",
    dependencies: "Dependencies (generated)",
    checklist: "Accessibility checklist (generated)",
    required: "Required",
    yes: "Yes",
    no: "No",
  },
  id: {
    props: "Props (dibangkitkan)",
    dependencies: "Dependensi (dibangkitkan)",
    checklist: "Daftar periksa aksesibilitas (dibangkitkan)",
    required: "Wajib",
    yes: "Ya",
    no: "Tidak",
  },
};

function tableFor(locale: "en" | "id"): string {
  const headings = SECTION_HEADINGS[locale];
  const rows = props.map((prop) => {
    const description = prop.descriptions[locale];
    const defaultValue = prop.defaultValue ?? "—";
    const type = prop.type.replace(/\|/g, "\\|");
    return `| \`${prop.name}\` | \`${type}\` | ${defaultValue} | ${prop.required ? headings.yes : headings.no} | ${description} |`;
  });
  return [
    `## ${headings.props}`,
    "",
    `| Prop | Type | Default | ${headings.required} | Description |`,
    "| --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function dependenciesFor(locale: "en" | "id"): string {
  const headings = SECTION_HEADINGS[locale];
  return [
    `## ${headings.dependencies}`,
    "",
    ...(item?.dependencies ?? []).map((dependency) => `- \`${dependency}\``),
    ...(item?.registryDependencies ?? []).map((dependency) => `- [${dependency}](${dependency})`),
    "",
  ].join("\n");
}

function checklistFor(locale: "en" | "id"): string {
  const headings = SECTION_HEADINGS[locale];
  return [
    `## ${headings.checklist}`,
    "",
    `Standard: WCAG 2.2 AA · manual status: **${manualStatus}**`,
    "",
    ...criteriaRows.map(
      (row) => `- [${row[3] === "pass" ? "x" : " "}] ${row[1]}: ${row[2]?.trim() ?? ""}`,
    ),
    "",
    `See \`${metadata.a11y.checklistPath}\` for evidence.`,
    "",
  ].join("\n");
}

function markdownFor(locale: "en" | "id"): string {
  const prose = readFileSync(
    resolve(ROOT, `apps/docs/content/components/${SLUG}.${locale}.md`),
    "utf8",
  ).trim();
  const sectionCount = (prose.match(/^## /gm) ?? []).length;
  if (sectionCount !== 7) throw new Error(`${locale} prose has ${sectionCount} sections, expected 7`);
  return [
    `# ${item?.title ?? "Button"}`,
    "",
    `> ${item?.description ?? ""}`,
    "",
    prose,
    "",
    tableFor(locale),
    dependenciesFor(locale),
    checklistFor(locale),
  ].join("\n");
}

const base = config.baseUrl;
const llms = [
  "# Legion v4",
  "",
  "> Semantic-token React components, a shadcn copy registry, and bilingual documentation.",
  "",
  "## Components (English)",
  `- [Button](${base}${config.docs.en}/${SLUG}): ${item?.description ?? ""}`,
  `- [Button Markdown](${base}${config.docs.en}/${SLUG}.md): Plain-text component reference with props and dependencies.`,
  `- [Button Preview](${base}/preview/button): Live matrix of variants, sizes, and states.`,
  `- [Component metadata](${base}/r/${SLUG}.json): Generated props, dependencies, examples, and documentation routes.`,
  "",
  "## Komponen (Bahasa Indonesia)",
  `- [Button](${base}${config.docs.id}/${SLUG}): Komponen aksi berbasis token dengan lima varian, tiga ukuran, dan enam state.`,
  `- [Button Markdown](${base}${config.docs.id}/${SLUG}.md): Referensi komponen teks biasa dengan props dan dependensi.`,
  `- [Pratinjau Button](${base}/preview/button): Matriks varian, ukuran, dan state secara langsung.`,
  "",
  "## Tokens",
  `- [Theme item](${base}/r/theme.json): Semantic light and dark tokens with Tailwind mappings.`,
  "",
  "## Registry",
  `- [Registry index](${base}/r/registry.json): theme, utils, and button items.`,
  `- [Repository](${config.repository}): Source, specs, and accessibility checklists.`,
  "",
].join("\n");

for (const [path, content] of [
  [`apps/docs/generated/metadata/${SLUG}.json`, `${JSON.stringify(metadata, null, 2)}\n`],
  [`apps/docs/public/docs/components/${SLUG}.md`, markdownFor("en")],
  [`apps/docs/public/id/docs/components/${SLUG}.md`, markdownFor("id")],
  ["llms.txt", llms],
  ["apps/docs/public/llms.txt", llms],
] as const) {
  mkdirSync(dirname(resolve(ROOT, path)), { recursive: true });
  writeFileSync(resolve(ROOT, path), content);
}

console.log(
  `generate:docs wrote metadata, 2 markdown pages, and llms.txt (${props.length} props, ${variants.length} variants, ${sizes.length} sizes).`,
);
