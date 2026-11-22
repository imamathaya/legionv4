import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { Locale } from "../i18n";

export const REPOSITORY_ROOT = existsSync(resolve(process.cwd(), "packages/ui"))
  ? process.cwd()
  : resolve(process.cwd(), "../..");

export type ProseSection = { title: string; body: string };

export function splitSections(markdown: string): ProseSection[] {
  return markdown
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const newline = chunk.indexOf("\n");
      const title = newline === -1 ? chunk.trim() : chunk.slice(0, newline).trim();
      const body = newline === -1 ? "" : chunk.slice(newline + 1).trim();
      return { title, body };
    });
}

export function readProse(locale: Locale): ProseSection[] {
  const path = resolve(
    REPOSITORY_ROOT,
    `apps/docs/content/components/button.${locale}.md`,
  );
  const sections = splitSections(readFileSync(path, "utf8"));
  if (sections.length !== 7) {
    throw new Error(`${path} has ${sections.length} sections, expected 7`);
  }
  return sections;
}

export function readRepositoryFile(path: string): string {
  return readFileSync(resolve(REPOSITORY_ROOT, path), "utf8");
}
