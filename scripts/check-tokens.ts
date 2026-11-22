import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss, { type Declaration } from "postcss";

const THEME_PATH = resolve("packages/ui/src/styles/theme.css");

const SEMANTIC_COLORS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
] as const;

const RADIUS_STEPS = [
  ["--radius-sm", "0.6"],
  ["--radius-md", "0.8"],
  ["--radius-lg", null],
  ["--radius-xl", "1.4"],
  ["--radius-2xl", "1.8"],
  ["--radius-3xl", "2.2"],
  ["--radius-4xl", "2.6"],
] as const;

const FORBIDDEN_NAMES = [
  "--tertiary",
  "--success",
  "--warning",
  "--error",
  "--information",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
];

const failures: string[] = [];

const css = readFileSync(THEME_PATH, "utf8");
const root = postcss.parse(css, { from: THEME_PATH });

function declarationsOf(ruleSelector: string): Declaration[] {
  const declarations: Declaration[] = [];
  root.walkRules((rule) => {
    if (rule.selector.trim() !== ruleSelector) return;
    rule.walkDecls((declaration) => declarations.push(declaration));
  });
  return declarations;
}

function declarationsInAtRule(name: string, params: string): Declaration[] {
  const declarations: Declaration[] = [];
  root.walkAtRules(name, (atRule) => {
    if (atRule.params.trim() !== params) return;
    atRule.walkDecls((declaration) => declarations.push(declaration));
  });
  return declarations;
}

function checkMode(mode: "light" | "dark", selector: string): Map<string, string> {
  const declarations = declarationsOf(selector);
  const values = new Map(declarations.map((entry) => [entry.prop, entry.value.trim()]));
  if (declarations.length === 0) failures.push(`${mode}: selector ${selector} is missing`);

  for (const token of SEMANTIC_COLORS) {
    const value = values.get(token);
    if (!value) {
      failures.push(`${mode}: missing ${token}`);
      continue;
    }
    if (!/^oklch\(/.test(value)) failures.push(`${mode}: ${token} must use oklch(), got ${value}`);
  }

  const radius = values.get("--radius");
  if (!radius) failures.push(`${mode}: missing --radius`);
  else if (!/^(?:\d*\.?\d+rem|calc\(.+\))$/.test(radius)) {
    failures.push(`${mode}: --radius must use rem or calc(), got ${radius}`);
  }

  const allowed: Record<string, true> = Object.fromEntries(
    [...SEMANTIC_COLORS, "--radius"].map((name) => [name, true]),
  );
  for (const [name] of values) {
    if (name.startsWith("--color-")) continue;
    if (!allowed[name]) failures.push(`${mode}: token outside the constitution list: ${name}`);
    if (FORBIDDEN_NAMES.includes(name)) failures.push(`${mode}: forbidden Legion v3 token ${name}`);
  }
  return values;
}

const light = checkMode("light", ":root");
const dark = checkMode("dark", ".dark");
if (light.size !== dark.size) {
  failures.push(`light has ${light.size} declarations, dark has ${dark.size}; modes must be equal`);
}

const themeInline = declarationsInAtRule("theme", "inline");
const inline = new Map(themeInline.map((entry) => [entry.prop, entry.value.trim()]));

for (const token of SEMANTIC_COLORS) {
  const mapped = inline.get(`--color-${token.slice(2)}`);
  if (!mapped) failures.push(`@theme inline: missing --color-${token.slice(2)}`);
  else if (mapped !== `var(${token})`) {
    failures.push(`@theme inline: --color-${token.slice(2)} must map to var(${token})`);
  }
}

for (const [step, factor] of RADIUS_STEPS) {
  const value = inline.get(step);
  if (!value) {
    failures.push(`@theme inline: missing ${step}`);
    continue;
  }
  if (factor === null) {
    if (value !== "var(--radius)") failures.push(`@theme inline: ${step} must be var(--radius)`);
  } else if (value !== `calc(var(--radius) * ${factor})`) {
    failures.push(`@theme inline: ${step} must be calc(var(--radius) * ${factor})`);
  }
}

let hasDarkVariant = false;
root.walkAtRules("custom-variant", (atRule) => {
  if (/^dark\b/.test(atRule.params.trim())) hasDarkVariant = true;
});
if (!hasDarkVariant) failures.push('missing @custom-variant dark (&:is(.dark *))');

const semanticInRoot = new Set(
  declarationsOf(":root")
    .map((entry) => entry.prop)
    .filter((name) => name.startsWith("--") && !name.startsWith("--color-")),
);
for (const token of SEMANTIC_COLORS) {
  if (!semanticInRoot.has(token)) failures.push(`:root: semantic token ${token} is not declared`);
}

if (failures.length > 0) {
  console.error(`check:tokens failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `check:tokens passed: ${SEMANTIC_COLORS.length} semantic colours + radius in light/dark, ` +
    `${inline.size} Tailwind mappings.`,
);
