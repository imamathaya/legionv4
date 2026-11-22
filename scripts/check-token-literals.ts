import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import ts from "typescript";
import postcss from "postcss";
import { ROOT } from "./theme-utils.ts";

const sourceRoot = resolve(ROOT, "packages/ui/src");
const themeFile = resolve(sourceRoot, "styles/theme.css");
const findings: string[] = [];

const forbiddenValues = [
  { pattern: /#[0-9a-fA-F]{3,8}\b/, label: "hex color" },
  { pattern: /\brgba?\(/, label: "rgb color" },
  { pattern: /\bhsla?\(/, label: "hsl color" },
  { pattern: /\boklch\(/, label: "oklch color" },
];
const arbitraryUtility =
  /(?:^|\s)(?:bg|text|border|ring|shadow|rounded|fill|stroke|outline|decoration|from|via|to|w|h|min-w|min-h|max-w|max-h|size|inset|top|bottom|left|right|z|gap|space-x|space-y|p[xytrbl]?|m[xytrbl]?)-\[[^\]]+\]/;

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return walk(path);
    return [path];
  });
}

function checkString(value: string, file: string, line: number) {
  for (const rule of forbiddenValues) {
    if (rule.pattern.test(value)) findings.push(`${relative(ROOT, file)}:${line} ${rule.label}: ${value}`);
  }
  if (arbitraryUtility.test(value)) findings.push(`${relative(ROOT, file)}:${line} arbitrary visual utility: ${value}`);
}

for (const file of walk(sourceRoot)) {
  const extension = extname(file);
  if (extension === ".css") {
    if (file === themeFile) continue;
    for (const declaration of postcss.parse(readFileSync(file, "utf8")).nodes) {
      if (declaration.type === "decl") checkString(declaration.value, file, declaration.source?.start?.line ?? 0);
    }
    continue;
  }
  if (extension !== ".ts" && extension !== ".tsx") continue;

  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
      checkString(node.text, file, line);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log("Token literal check passed: no raw colors or arbitrary visual values in component sources.");
