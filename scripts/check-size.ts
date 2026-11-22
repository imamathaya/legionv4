import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";
import { ROOT } from "./theme-utils.ts";

const path = resolve(ROOT, "packages/ui/dist/components/ui/button.js");
const compressed = gzipSync(readFileSync(path)).byteLength;
const budget = 4096;
if (compressed > budget) {
  console.error(`Button bundle is ${compressed} bytes gzipped, above the ${budget} byte budget`);
  process.exit(1);
}
console.log(`Button bundle size: ${compressed} bytes gzipped (budget ${budget}).`);
