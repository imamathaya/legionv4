import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import Color from "colorjs.io";

export const ROOT = resolve(import.meta.dirname, "..");
export const THEME_PATH = resolve(ROOT, "packages/ui/src/styles/theme.css");

export const SEMANTIC_COLORS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
] as const;

export const RADIUS_STEPS = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const;

export type TokenBlocks = {
  root: Map<string, string>;
  dark: Map<string, string>;
  theme: Map<string, string>;
};

export function readTheme(): TokenBlocks {
  const css = readFileSync(THEME_PATH, "utf8");
  const root = new Map<string, string>();
  const dark = new Map<string, string>();
  const theme = new Map<string, string>();

  postcss.parse(css).walk((node) => {
    if (node.type === "rule" && (node.selector === ":root" || node.selector === ".dark")) {
      const target = node.selector === ":root" ? root : dark;
      node.walkDecls((decl) => target.set(decl.prop, decl.value.trim()));
    }
    if (node.type === "atrule" && node.name === "theme") {
      node.walkDecls((decl) => theme.set(decl.prop, decl.value.trim()));
    }
  });

  return { root, dark, theme };
}

function srgbOf(value: string): { coords: [number, number, number]; alpha: number } {
  const parsed = new Color(value).to("srgb");
  const coords = parsed.coords.map((coordinate) => Math.min(1, Math.max(0, coordinate)));
  return { coords: [coords[0] ?? 0, coords[1] ?? 0, coords[2] ?? 0], alpha: parsed.alpha };
}

function blend(
  foreground: { coords: [number, number, number]; alpha: number },
  backdrop: { coords: [number, number, number]; alpha: number },
): { coords: [number, number, number]; alpha: number } {
  const alpha = foreground.alpha + backdrop.alpha * (1 - foreground.alpha);
  if (alpha === 0) {
    return { coords: [0, 0, 0], alpha: 0 };
  }
  const coords = foreground.coords.map(
    (channel, index) =>
      (channel * foreground.alpha + (backdrop.coords[index] ?? 0) * backdrop.alpha * (1 - foreground.alpha)) / alpha,
  );
  return { coords: [coords[0] ?? 0, coords[1] ?? 0, coords[2] ?? 0], alpha };
}

function luminance({ coords }: { coords: [number, number, number] }): number {
  const [r, g, b] = coords.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

export function contrastRatio(foreground: string, background: string, backdrop?: string): number {
  const backdropColor = backdrop ? srgbOf(backdrop) : { coords: [1, 1, 1] as [number, number, number], alpha: 1 };
  const backgroundOpaque = blend(srgbOf(background), backdropColor);
  const foregroundOpaque = blend(srgbOf(foreground), backgroundOpaque);
  const light = Math.max(luminance(foregroundOpaque), luminance(backgroundOpaque));
  const darkLum = Math.min(luminance(foregroundOpaque), luminance(backgroundOpaque));
  return (light + 0.05) / (darkLum + 0.05);
}

export function surfaceWithOpacity(surface: string, opacity: number, backdrop: string): string {
  const surfaceColor = srgbOf(surface);
  const composite = blend({ ...surfaceColor, alpha: opacity }, srgbOf(backdrop));
  const [r, g, b] = composite.coords;
  return `color(srgb ${r} ${g} ${b})`;
}
