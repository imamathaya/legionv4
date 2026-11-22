import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(repoRoot, "packages/ui/src/styles/theme.css");
const target = resolve(repoRoot, "packages/ui/dist/styles.css");
mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);
