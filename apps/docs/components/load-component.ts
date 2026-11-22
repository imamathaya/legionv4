import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type PropMetadata = {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string | null;
  descriptions: Record<"en" | "id", string>;
};

export type ComponentMetadata = {
  name: string;
  title: string;
  description: string;
  version: string;
  props: PropMetadata[];
  dependencies: string[];
  docs: { locales: Record<"en" | "id", { route: string; markdownUrl: string }> };
};

export function loadComponentMetadata(name: string): ComponentMetadata {
  const path = resolve(process.cwd(), "generated/metadata", `${name}.json`);
  return JSON.parse(readFileSync(path, "utf8")) as ComponentMetadata;
}

export function loadProse(relativePath: string): string {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}
