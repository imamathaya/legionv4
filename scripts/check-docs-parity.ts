import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const ROOT = process.cwd();
const failures: string[] = [];

const metadata = JSON.parse(
  readFileSync(resolve(ROOT, "apps/docs/generated/metadata/button.json"), "utf8"),
) as {
  props: { name: string; descriptions: { en: string; id: string } }[];
  docs: {
    defaultLocale: string;
    locales: Record<
      "en" | "id",
      { route: string; markdownUrl: string; prosePath: string; htmlLang: string }
    >;
  };
  examples: { codePath: string }[];
  a11y: { criteria: string[]; checklistPath: string };
};

const schema = JSON.parse(
  readFileSync(
    resolve(ROOT, "specs/001-fondasi-button/contracts/component-metadata.schema.json"),
    "utf8",
  ),
) as object;
const ajv = new Ajv2020({ allErrors: true, strict: false });
const validate = ajv.compile(schema);
if (!validate(metadata)) {
  for (const error of validate.errors ?? []) {
    failures.push(`metadata schema: ${error.instancePath} ${error.message}`);
  }
}

for (const locale of ["en", "id"] as const) {
  const prosePath = resolve(ROOT, metadata.docs.locales[locale].prosePath);
  if (!existsSync(prosePath)) {
    failures.push(`${locale}: prose file is missing`);
    continue;
  }
  const prose = readFileSync(prosePath, "utf8");
  const sections = prose.match(/^## /gm) ?? [];
  if (sections.length !== 7) {
    failures.push(`${locale}: prose has ${sections.length} sections, expected 7`);
  }
}

for (const prop of metadata.props) {
  if (!prop.descriptions.en.trim()) failures.push(`${prop.name}: missing en description`);
  if (!prop.descriptions.id.trim()) failures.push(`${prop.name}: missing id description`);
  if (prop.descriptions.en === prop.descriptions.id && prop.name !== "className") {
    failures.push(`${prop.name}: en and id descriptions are identical; translate the Indonesian text`);
  }
}

const requiredProps = ["variant", "size", "asChild", "loading", "loadingLabel", "className"];
for (const name of requiredProps) {
  if (!metadata.props.some((prop) => prop.name === name)) {
    failures.push(`metadata is missing public prop ${name}`);
  }
}

for (const example of metadata.examples) {
  if (!existsSync(resolve(ROOT, example.codePath))) {
    failures.push(`example file ${example.codePath} is missing`);
  }
}

if (!existsSync(resolve(ROOT, metadata.a11y.checklistPath))) {
  failures.push("a11y checklist path does not exist");
}
if (metadata.a11y.criteria.length === 0) failures.push("a11y criteria list is empty");

for (const locale of ["en", "id"] as const) {
  const docs = metadata.docs.locales[locale];
  if (docs.htmlLang !== locale) failures.push(`${locale}: htmlLang must be ${locale}`);
  if (!docs.route.includes(`/docs/components/`)) failures.push(`${locale}: invalid route ${docs.route}`);
  const markdownPath = resolve(ROOT, "apps/docs/public", `.${docs.markdownUrl}`);
  if (!existsSync(markdownPath)) failures.push(`${locale}: generated markdown ${docs.markdownUrl} is missing`);
}

const llms = readFileSync(resolve(ROOT, "llms.txt"), "utf8");
for (const heading of ["## Components (English)", "## Komponen (Bahasa Indonesia)"]) {
  if (!llms.includes(heading)) failures.push(`llms.txt is missing ${heading}`);
}

if (failures.length > 0) {
  console.error(`check:docs-parity failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `check:docs-parity passed: 7 sections in both locales, ${metadata.props.length} props with en/id descriptions, schema valid.`,
);
