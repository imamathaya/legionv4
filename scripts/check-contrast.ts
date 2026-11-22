import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { readTheme, ROOT, contrastRatio, surfaceWithOpacity } from "./theme-utils.ts";

type Pair = {
  foreground: string;
  background: string;
  min: number;
  kind: "text" | "non-text";
  stateSurfaceOpacities?: number[];
};

const manifest = JSON.parse(
  readFileSync(resolve(ROOT, "packages/ui/src/styles/contrast-pairs.json"), "utf8"),
) as { pairs: Pair[] };
const { root, dark } = readTheme();
const failures: string[] = [];

function valueOf(map: Map<string, string>, token: string, mode: string): string {
  const value = map.get(token);
  if (!value) {
    throw new Error(`Missing ${token} in ${mode}`);
  }
  return value;
}

for (const mode of ["light", "dark"] as const) {
  const tokens = mode === "light" ? root : dark;
  const background = valueOf(tokens, "--background", mode);
  const card = valueOf(tokens, "--card", mode);

  for (const pair of manifest.pairs) {
    const foreground = valueOf(tokens, pair.foreground, mode);
    const surface = valueOf(tokens, pair.background, mode);
    const baseRatio = contrastRatio(foreground, surface);
    if (baseRatio < pair.min) {
      failures.push(`${mode} ${pair.foreground} on ${pair.background}: ${baseRatio.toFixed(2)} < ${pair.min}`);
    }

    for (const opacity of pair.stateSurfaceOpacities ?? []) {
      for (const backdrop of [background, card]) {
        const stateSurface = surfaceWithOpacity(surface, opacity, backdrop);
        const stateRatio = contrastRatio(foreground, stateSurface);
        if (stateRatio < pair.min) {
          failures.push(
            `${mode} ${pair.foreground} on ${pair.background}/${opacity} over ${backdrop}: ${stateRatio.toFixed(2)} < ${pair.min}`,
          );
        }
      }
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Contrast check passed for light and dark, including hover/active state surfaces.");
