import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { ROOT } from "./theme-utils.ts";

type Metadata = {
  props: Array<{ name: string; descriptions: { en: string; id: string } }>;
  docs: { locales: Record<"en" | "id", { route: string; markdownUrl: string; prosePath: string; htmlLang: string }> };
};

const metadata = JSON.parse(readFileSync(resolve(ROOT, "apps/docs/generated/metadata/button.json"), "utf8")) as Metadata;
const schema = JSON.parse(
  readFileSync(resolve(ROOT, "specs/001-fondasi-button/contracts/component-metadata.schema.json"), "utf8"),
);
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema);
if (!validate(metadata)) {
  console.error(validate.errors);
  process.exit(1);
}

const requiredHeadings = {
  en: ["Preview and variants", "Install as package", "Install as copy", "Usage", "Props", "Dependencies", "Accessibility"],
  id: ["Pratinjau dan varian", "Pasang sebagai paket", "Pasang sebagai salinan", "Pemakaian", "Props", "Dependensi", "Aksesibilitas"],
};
const errors: string[] = [];

for (const locale of ["en", "id"] as const) {
  const docs = metadata.docs.locales[locale];
  if (docs.route !== (locale === "en" ? "/docs/components/button" : "/id/docs/components/button")) {
    errors.push(`${locale} route is inconsistent`);
  }
  if (docs.htmlLang !== locale) errors.push(`${locale} htmlLang must be ${locale}`);
  for (const heading of requiredHeadings[locale]) {
    const prose = readFileSync(resolve(ROOT, docs.prosePath), "utf8");
    if (!prose.includes(`## ${heading}`)) errors.push(`${locale} prose is missing heading ${heading}`);
    const markdown = readFileSync(resolve(ROOT, "apps/docs/public", docs.markdownUrl.replace(/^\//, "")), "utf8");
    if (!markdown.includes(`## ${heading}`)) errors.push(`${locale} generated markdown is missing heading ${heading}`);
  }
  if (!existsSync(resolve(ROOT, docs.prosePath))) errors.push(`${locale} prose file is missing`);
}

for (const prop of metadata.props) {
  if (!prop.descriptions.en.trim()) errors.push(`Prop ${prop.name} has no English description`);
  if (!prop.descriptions.id.trim()) errors.push(`Prop ${prop.name} has no Indonesian description`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Docs parity check passed for English and Indonesian.");
