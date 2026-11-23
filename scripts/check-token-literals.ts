import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import postcss from "postcss";
import ts from "typescript";

const SOURCE_TARGETS = [
  resolve("packages/ui/src/components"),
  resolve("packages/ui/src/lib"),
  resolve("apps/docs/examples"),
];

const CSS_TARGETS = [resolve("packages/ui/src/styles")];

const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/;
const ARBITRARY_UTILITY =
  /\b(?:bg|text|border|ring|outline|shadow|rounded|fill|stroke|p[trblxy]?|m[trblxy]?|w|h|size|gap|space-[xy]|font|leading|tracking|min-[hw]|max-[hw]|transition|duration|ease|grid-cols|grid-rows|basis|top|right|bottom|left|inset(?:-[xy])?)-\[[^\]]+\]/;
const NAMED_RAW_COLOUR = /\b(?:text|bg|border|ring|outline|fill|stroke)-(?:white|black)\b/;

const failures: string[] = [];

function collectFiles(directory: string, extensions: string[]): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...collectFiles(path, extensions));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) found.push(path);
  }
  return found;
}

function inspect(text: string, path: string, line?: number): void {
  const where = line === undefined ? path : `${path}:${line}`;
  if (COLOUR_LITERAL.test(text)) failures.push(`${where}: raw colour literal in "${text}"`);
  if (ARBITRARY_UTILITY.test(text)) failures.push(`${where}: arbitrary utility in "${text}"`);
  if (NAMED_RAW_COLOUR.test(text)) failures.push(`${where}: raw Tailwind colour in "${text}"`);
}

for (const path of SOURCE_TARGETS.flatMap((target) => collectFiles(target, [".ts", ".tsx"]))) {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      inspect(node.text, path, source.getLineAndCharacterOfPosition(node.getStart()).line + 1);
    } else if (ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      inspect(node.text, path, source.getLineAndCharacterOfPosition(node.getStart()).line + 1);
    } else if (ts.isJsxAttribute(node) && node.name.getText(source) === "style") {
      failures.push(`${path}: inline style attribute is not token-driven`);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

for (const path of CSS_TARGETS.flatMap((target) => collectFiles(target, [".css"]))) {
  const stylesheet = postcss.parse(readFileSync(path, "utf8"), { from: path });
  stylesheet.walkDecls((declaration) => {
    const value = declaration.value;
    if (declaration.prop.startsWith("--")) {
      if (/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/.test(value)) {
        failures.push(`${path}: token ${declaration.prop} uses a forbidden colour format`);
      }
      return;
    }
    if (COLOUR_LITERAL.test(value)) {
      failures.push(`${path}: declaration ${declaration.prop} uses a raw colour`);
    }
  });
}

if (failures.length > 0) {
  console.error(`check:token-literals failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("check:token-literals passed: no raw colours or arbitrary visual utilities found.");
