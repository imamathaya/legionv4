import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Color from "colorjs.io";
import postcss from "postcss";

type Pair = {
  foreground: string;
  background: string;
  min: number;
  kind: string;
  stateSurfaceOpacities?: number[];
};

type Manifest = { version: number; pairs: Pair[] };

const THEME_PATH = resolve("packages/ui/src/styles/theme.css");
const PAIRS_PATH = resolve("packages/ui/src/styles/contrast-pairs.json");
const STATE_BASES = ["--background", "--card"] as const;

const root = postcss.parse(readFileSync(THEME_PATH, "utf8"), { from: THEME_PATH });

function tokensFor(selector: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  root.walkRules((rule) => {
    if (rule.selector.trim() !== selector) return;
    rule.walkDecls((declaration) => {
      tokens[declaration.prop] = declaration.value.trim();
    });
  });
  return tokens;
}

function composite(foreground: Color, background: Color, opacity?: number): Color {
  const front = foreground.to("srgb");
  const back = background.to("srgb");
  const alpha = Math.min(1, Math.max(0, opacity ?? front.alpha ?? 1));
  const channels = front.coords.map((coordinate, index) => {
    const value = coordinate * alpha + (back.coords[index] ?? 0) * (1 - alpha);
    return Math.min(1, Math.max(0, value));
  });
  return new Color("srgb", channels);
}

function ratio(foreground: Color, background: Color): number {
  const opaqueBack = composite(background, new Color("srgb", [1, 1, 1]), 1);
  const opaqueFront = composite(foreground, opaqueBack);
  return opaqueFront.contrast(opaqueBack, "WCAG21");
}

const modes = {
  light: tokensFor(":root"),
  dark: tokensFor(".dark"),
} as const;

const manifest = JSON.parse(readFileSync(PAIRS_PATH, "utf8")) as Manifest;
const failures: string[] = [];
let checks = 0;

for (const [mode, tokens] of Object.entries(modes)) {
  for (const pair of manifest.pairs) {
    const backgroundValue = tokens[pair.background];
    const foregroundValue = tokens[pair.foreground];
    if (!backgroundValue || !foregroundValue) {
      failures.push(`${mode}: ${pair.foreground} / ${pair.background} token missing`);
      continue;
    }

    const background = new Color(backgroundValue);
    const foreground = new Color(foregroundValue);
    const baseRatio = ratio(foreground, background);
    checks += 1;
    if (baseRatio + 1e-9 < pair.min) {
      failures.push(
        `${mode}: ${pair.foreground} on ${pair.background} = ${baseRatio.toFixed(2)} (< ${pair.min})`,
      );
    }

    for (const opacity of pair.stateSurfaceOpacities ?? []) {
      for (const baseName of STATE_BASES) {
        const baseValue = tokens[baseName];
        if (!baseValue) {
          failures.push(`${mode}: missing state base ${baseName}`);
          continue;
        }
        const base = new Color(baseValue);
        const stateSurface = composite(background, base, opacity);
        const stateRatio = ratio(foreground, stateSurface);
        checks += 1;
        if (stateRatio + 1e-9 < pair.min) {
          failures.push(
            `${mode}: ${pair.foreground} on ${pair.background}/${Math.round(opacity * 100)} ` +
              `over ${baseName} = ${stateRatio.toFixed(2)} (< ${pair.min})`,
          );
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(`check:contrast failed with ${failures.length} problem(s):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `check:contrast passed: ${checks} checks across ${manifest.pairs.length} token pairs in light/dark.`,
);
