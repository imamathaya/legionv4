import { readTheme, RADIUS_STEPS, SEMANTIC_COLORS } from "./theme-utils.ts";

const { root, dark, theme } = readTheme();
const errors: string[] = [];

const allowedRoot = new Set<string>(["--radius", ...SEMANTIC_COLORS.map((name) => `--${name}`)]);
const allowedDark = new Set<string>(["--radius", ...SEMANTIC_COLORS.map((name) => `--${name}`)]);

for (const name of SEMANTIC_COLORS) {
  const lightValue = root.get(`--${name}`);
  const darkValue = dark.get(`--${name}`);
  if (!lightValue) errors.push(`Missing --${name} in :root`);
  if (!darkValue) errors.push(`Missing --${name} in .dark`);
  if (lightValue && !/^oklch\(/.test(lightValue)) errors.push(`--${name} light must use oklch(), got ${lightValue}`);
  if (darkValue && !/^oklch\(/.test(darkValue)) errors.push(`--${name} dark must use oklch(), got ${darkValue}`);
  if (theme.get(`--color-${name}`) !== `var(--${name})`) {
    errors.push(`Missing @theme inline mapping --color-${name}: var(--${name})`);
  }
}

const lightRadius = root.get("--radius");
const darkRadius = dark.get("--radius");
if (!lightRadius || !/^[\d.]+rem$/.test(lightRadius)) errors.push("--radius light must be a rem value");
if (!darkRadius || !/^[\d.]+rem$/.test(darkRadius)) errors.push("--radius dark must be a rem value");

const radiusFormulas: Record<(typeof RADIUS_STEPS)[number], string> = {
  sm: "calc(var(--radius) * 0.6)",
  md: "calc(var(--radius) * 0.8)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) * 1.4)",
  "2xl": "calc(var(--radius) * 1.8)",
  "3xl": "calc(var(--radius) * 2.2)",
  "4xl": "calc(var(--radius) * 2.6)",
};
for (const step of RADIUS_STEPS) {
  if (theme.get(`--radius-${step}`) !== radiusFormulas[step]) {
    errors.push(`@theme inline --radius-${step} must be ${radiusFormulas[step]}`);
  }
}

for (const name of root.keys()) {
  if (!allowedRoot.has(name) && !name.startsWith("--color-")) {
    errors.push(`Unexpected semantic token ${name} in :root`);
  }
}
for (const name of dark.keys()) {
  if (!allowedDark.has(name)) errors.push(`Unexpected token ${name} in .dark`);
}

const destructiveForegroundLight = root.get("--destructive-foreground");
const destructiveForegroundDark = dark.get("--destructive-foreground");
if (destructiveForegroundLight !== "oklch(0.985 0 0)") {
  errors.push("--destructive-foreground light must be oklch(0.985 0 0)");
}
if (destructiveForegroundDark !== "oklch(0.205 0 0)") {
  errors.push("--destructive-foreground dark must be oklch(0.205 0 0)");
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Token check passed: ${SEMANTIC_COLORS.length} semantic colors + ${RADIUS_STEPS.length + 1} radius tokens.`);
